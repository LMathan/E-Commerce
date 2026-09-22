/**
 * NextAuth.js v5 (Auth.js) Configuration
 *
 * Handles:
 * - Email/password authentication with bcrypt
 * - Session management (JWT + DB sessions)
 * - RBAC — roles and permissions loaded into session
 * - Separate admin authorization
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { DefaultSession } from "next-auth";

// Extend session types to include roles and permissions
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      avatar?: string | null;
      roles: string[];
      permissions: string[];
      isAdmin: boolean;
      emailVerified?: Date | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    avatar?: string | null;
    roles: string[];
    permissions: string[];
    isAdmin: boolean;
    emailVerified?: Date | null;
  }
}

const credentialsSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    rolePermissions: {
                      include: { permission: true },
                    },
                  },
                },
              },
            },
          },
        });

        if (!user || !user.passwordHash) return null;

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) return null;

        // Check account status
        if (user.status === "SUSPENDED" || user.status === "DELETED") {
          return null;
        }

        // Collect roles and permissions
        const roles = user.roles.map((ur) => ur.role.name);
        const permissions = [
          ...new Set(
            user.roles.flatMap((ur) =>
              ur.role.rolePermissions.map((rp) => rp.permission.name)
            )
          ),
        ];

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          roles,
          permissions,
          isAdmin: user.isAdmin,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.permissions = user.permissions;
        token.isAdmin = user.isAdmin;
        token.emailVerified = user.emailVerified;
        token.avatar = user.avatar;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.roles = (token.roles as string[]) ?? [];
        session.user.permissions = (token.permissions as string[]) ?? [];
        session.user.isAdmin = (token.isAdmin as boolean) ?? false;
        session.user.emailVerified = token.emailVerified as Date | null;
        session.user.avatar = token.avatar as string | null;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
  },

  events: {
    async signOut(message) {
      // Optionally invalidate sessions in DB
      // In JWT strategy, there's no server-side session to delete
      // This is a no-op for now but can be extended for blocklisted JWTs
      const token = "token" in message ? message.token : null;
      if (token?.id) {
        await prisma.session
          .deleteMany({ where: { userId: token.id as string } })
          .catch(() => {}); // Don't throw on cleanup failure
      }
    },
  },
});
