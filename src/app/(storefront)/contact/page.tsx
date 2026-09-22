"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toaster";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (res.ok) {
        addToast({ type: "success", title: "Message sent! We'll reply within 24 hours." });
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        addToast({ type: "error", title: "Failed to send message" });
      }
    } catch (err) {
      addToast({ type: "error", title: "Error sending message" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-neutral-100">Contact Us</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Have a question about an order, shipping, or returns? We're here to help 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-start gap-4">
            <Mail className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100">Email Us</h3>
              <p className="text-sm text-neutral-500 mt-1">support@luxeshop.com</p>
              <p className="text-xs text-neutral-400 mt-0.5">Response within 24 hours</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-start gap-4">
            <Phone className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100">Call Us</h3>
              <p className="text-sm text-neutral-500 mt-1">+91 98765 43210</p>
              <p className="text-xs text-neutral-400 mt-0.5">Mon - Sat, 9am - 6pm IST</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-start gap-4">
            <MapPin className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100">Head Office</h3>
              <p className="text-sm text-neutral-500 mt-1">LuxeShop Retail India Pvt Ltd</p>
              <p className="text-xs text-neutral-400 mt-0.5">Cyber City, Gurugram, Haryana</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 space-y-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Send a Message</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Your Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Subject *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 text-sm focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">Message *</label>
            <textarea
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 text-sm focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full flex items-center justify-center gap-2">
            <Send className="h-4 w-4" />
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}
