import "./globals.css";
import Navbar from "../components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TourGen",
  icons: {
    icon: "/branding/favicon.png",
  },
  description:
    "AI-powered travel planning, curated Agra tours, and personalized travel experiences.",

  keywords: [
    "TourGen",
    "Agra Tours",
    "Taj Mahal Tours",
    "AI Travel Planner",
    "Travel Concierge",
    "Agra Travel",
  ],

  openGraph: {
    title: "TourGen",
    description:
      "AI-powered travel planning and curated Agra experiences.",
    siteName: "TourGen",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body>

        <Navbar />

        <div className="px-4 py-4 md:p-6">
          {children}
        </div>

        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

        <a
          href="https://wa.me/917599921173"
          target="_blank"
          className="fixed bottom-4 right-4 md:bottom-5 md:right-5 bg-green-500 hover:bg-green-600 transition-all text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl md:text-3xl z-50"
        >
          💬
        </a>

      </body>
    </html>
  );
}