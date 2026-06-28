import "./globals.css";
import Navbar from "../components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://tourgen.in"),

  title: {
    default: "TourGen | Agra Tours & AI Travel Planner",
    template: "%s | TourGen",
  },

  description:
    "Book Agra tours, Taj Mahal tours, and AI-powered custom travel itineraries. TourGen combines expert local travel planning with AI to create unforgettable experiences.",

  keywords: [
    "Agra Tours",
    "Taj Mahal Tour",
    "Delhi to Agra Tour",
    "Agra Sightseeing",
    "Private Agra Tour",
    "Sunrise Taj Mahal Tour",
    "AI Travel Planner",
    "Custom India Itinerary",
    "TourGen",
  ],

  authors: [
    {
      name: "TourGen",
    },
  ],

  creator: "TourGen",

  publisher: "TourGen",

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/favicon.png",
  },

  themeColor: "#2563eb",

  category: "Travel",

  openGraph: {
    title: "TourGen | Agra Tours & AI Travel Planner",

    description:
      "Discover curated Agra tours, Taj Mahal experiences, and AI-powered personalized travel planning.",

    url: "https://tourgen.in",

    siteName: "TourGen",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TourGen - Agra Tours & AI Travel Planner",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "TourGen | Agra Tours & AI Travel Planner",

    description:
      "Book Agra tours and generate AI-powered travel itineraries.",

    images: ["/og-image.jpg"],
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