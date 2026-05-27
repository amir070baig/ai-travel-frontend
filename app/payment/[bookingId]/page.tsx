"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {

  const params = useParams();

  const router = useRouter();

  const [booking, setBooking] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const fetchBooking = async () => {

      try {

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        const foundBooking = data.find(
          (b: any) =>
            b.id === params.bookingId
        );

        setBooking(foundBooking);

      } catch (err) {
        console.error(err);
      }
    };

    fetchBooking();

  }, [params.bookingId]);



  const handlePayment = async () => {

    try {

      setLoading(true);

      // CREATE ORDER
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/create-order`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            bookingId: booking.id,
          }),
        }
      );

      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: orderData.amount,

        currency: "INR",

        name: "AI Travel Planner",

        description:
          "Advance Booking Payment",

        order_id: orderData.id,

        handler: async function (
          response: any
        ) {

          const verifyRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/payments/verify`,
            {
              method: "POST",

              credentials: "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,

                bookingId:
                  booking.id,
              }),
            }
          );

          const verifyData =
            await verifyRes.json();

          if (verifyData.success) {

            alert(
              "Payment successful 🎉"
            );

            router.push(
              "/my-requests"
            );

          } else {

            alert(
              "Payment verification failed"
            );

          }
        },

        theme: {
          color: "#000000",
        },
      };

      const razor = new window.Razorpay(
        options
      );

      razor.open();

    } catch (err) {

      console.error(err);

      alert("Payment failed");

    } finally {

      setLoading(false);

    }
  };



  if (!booking) {

    return (
      <div className="p-10">
        Loading booking...
      </div>
    );
  }



  return (
    <div className="max-w-2xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-6">
        Complete Your Payment
      </h1>

      <div className="border rounded-2xl p-6 space-y-4">

        <p>
          <strong>Tour:</strong>{" "}
          {booking.tour?.title ||
            "Custom Trip"}
        </p>

        <p>
          <strong>Travelers:</strong>{" "}
          {booking.travelers}
        </p>

        <p>
          <strong>Advance Amount:</strong>{" "}
          ₹{booking.advanceAmount}
        </p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-2xl"
        >
          {loading
            ? "Processing..."
            : "Pay Now"}
        </button>

      </div>
    </div>
  );
}