import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { BottomNav } from "@/components/navigation/BottomNav";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content" tabIndex={-1} className="pb-16 lg:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
