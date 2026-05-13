import "./globals.css";
import Navbar from "../components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="p-6">{children}</div>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <a
          href="https://wa.me/917599921173"
          target="_blank"
          className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 transition-all text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-3xl z-50"
        >
          💬
        </a>
      </body>
    </html>
  );
}