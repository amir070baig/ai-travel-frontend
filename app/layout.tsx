import "./globals.css";
import Navbar from "../components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://tourgen.in"),

  title: {
    default: "Agra Tours, Taj Mahal Tours & AI Travel Planner | TourGen",
    template: "%s | TourGen",
  },

  description:
  "Book private Taj Mahal tours, Agra sightseeing tours, Delhi to Agra day trips and AI-powered personalized travel itineraries. Trusted local experts, secure booking and flexible travel planning.",

  keywords: [
    "Agra Tours",
    "Taj Mahal Tours",
    "Private Taj Mahal Tour",
    "Delhi to Agra Day Tour",
    "Agra Fort Tour",
    "Fatehpur Sikri Tour",
    "Agra Sightseeing",
    "Sunrise Taj Mahal Tour",
    "Same Day Agra Tour",
    "Private Tour Guide Agra",
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
  applicationName: "TourGen",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  referrer: "origin-when-cross-origin",

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
      "Book private Taj Mahal tours, Agra sightseeing experiences and AI-powered personalized itineraries with trusted local travel experts.",

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
      "Book Taj Mahal tours, Agra day trips and personalized AI travel itineraries with TourGen.",

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