"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function MyRequestsPage() {
  const { loading } = useAuth();
  
  const [requests, setRequests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [savedItineraries, setSavedItineraries] = useState<any[]>([]);
  const [expandedTrips, setExpandedTrips] = useState<string[]>([]);
  const [travelDates, setTravelDates] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, any[]>>({});
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>({});
  const [isPaying, setIsPaying] = useState<string | null>(null);
  const [submittingRequestId, setSubmittingRequestId] = useState<string | null>(null);
  const [sendingMessageId, setSendingMessageId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<Record<string, number>>({});
  const [reviewComment, setReviewComment] = useState<Record<string, string>>({});
  const [submittedReviews, setSubmittedReviews] = useState<string[]>([]);
  const ADMIN_WHATSAPP = "917599921173";
  


  useEffect(() => {

    requests.forEach((req) => {

      if (!messages[req.id]) {
        fetchMessages(req.id);
      }

    });

  }, [requests]);

  const fetchData = async () => {
      try {
        // REQUESTS
        const reqRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/requests`,
          
          {
            credentials: "include",
          }
        );
        const reqData = await reqRes.json();
        setRequests(Array.isArray(reqData) ? reqData : []);

        // BOOKINGS
        const bookRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
          {
            credentials: "include",
          }
        );
        const bookData = await bookRes.json();
        setBookings(Array.isArray(bookData) ? bookData : []);

        // SAVED ITINERARIES
        const savedRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/itineraries/my`,
          {
            credentials: "include",
          }
        );
        const savedData = await savedRes.json();
        setSavedItineraries(Array.isArray(savedData) ? savedData : []);

      } catch (err) {
        console.error(err);
      }
    };

  useEffect(() => {
    

    fetchData();
  }, []);

  const handleAccept = async (requestId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requests/accept`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId }),
        }
      );

      if (!res.ok) throw new Error();

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "APPROVED" } : req
        )
      );
      setMessage("Revision accepted ✅");
    } catch (err) {
      setMessage("Something went wrong ❌");
    }
  };

  const handleRejectRevision = async (requestId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requests/reject-revision`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId }),
        }
      );

      if (!res.ok) throw new Error();

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "UNDER_REVIEW" } : req
        )
      );
      setMessage("Revision rejected ❌");
    } catch (err) {
      setMessage("Something went wrong ❌");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedTrips((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
  };

  const activeRequests = requests.filter((req) => req.status !== "APPROVED");

  const handlePayment = async (bookingId: string) => {
    // 1. Guard clause: Stop if ANY payment is already processing
    if (isPaying) return;

    // Find the current booking object being paid for
    const currentBooking = bookings.find((b) => b.id === bookingId);
    const selectedDate = travelDates[bookingId];

    // 2. Only enforce validation if the booking needs a date but doesn't have one yet
    const needsDateSelection =
      currentBooking &&
      !currentBooking.tourId &&
      !currentBooking.travelDate &&
      currentBooking.status === "PENDING_PAYMENT";

    if (needsDateSelection && !selectedDate) {
      alert("Please select your preferred travel date first.");
      return;
    }

    // 3. Set the current booking ID to true/active right after validation passes
    setIsPaying(bookingId);

    try {
      // Send the selected date to the backend so it gets saved!
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/travel-date`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            travelDate: selectedDate,
          }),
        }
      );
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/create-order`,
        {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            bookingId,
            travelDate: selectedDate || currentBooking?.travelDate // Passes the date if selected
          }),
        }
      );

      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "TourGen",
        description: "Advance Booking Payment",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/payments/verify`,
              {
                credentials: "include",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                  ...response, 
                  bookingId,
                  travelDate: selectedDate || currentBooking?.travelDate
                }),
              }
            );

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              await fetchBookings();
              alert("Payment Successful ✅");
            }
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
          } finally {
            // Reset the payment state after validation/verification sequence finishes
            setIsPaying(null);
          }
        },
        // If user closes Razorpay modal without paying, clear state
        modal: {
          ondismiss: function () {
            setIsPaying(null);
          },
        },
        theme: { color: "#2563eb" },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
      // Clear state if the initial order creation API fails
      setIsPaying(null);
    }
  };


  const handleRefundRequest = async (bookingId: string) => {

    const confirmed =
      window.confirm(
        `Request Cancellation?

    Your cancellation request will be reviewed according to TourGen's refund policy.

    Refund eligibility and refund amount will be determined based on your booking type, travel date, and booking status.

    Do you want to continue?`
      );

    if (!confirmed) return;

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/request-refund`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.message ||
            "Unable to submit request"
        );
        return;
      }

      alert(
        "Cancellation request submitted successfully."
      );

      await fetchBookings();

    } catch (err) {

      console.error(err);

      alert(
        "Something went wrong"
      );

    }

  };


  const handleAIReview = async (booking: any) => {

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({

            itineraryId: booking.itineraryId,

            rating:
              reviewRating[booking.id] || 5,

            comment:
              reviewComment[booking.id] || "",

          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        alert(
          data.message ||
          "Unable to submit review"
        );

        return;

      }

      await fetchBookings();

      alert(
        "Thank you for reviewing your AI travel experience! ❤️"
      );

      setReviewComment((prev) => ({
        ...prev,
        [booking.id]: "",
      }));

      setReviewRating((prev) => ({
        ...prev,
        [booking.id]: 5,
      }));

    } catch (err) {

      console.error(err);

      alert(
        "Something went wrong."
      );

    }

  };


  const fetchMessages = async (requestId: string) => {
    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requests/${requestId}/messages`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      setMessages((prev) => ({
        ...prev,
        [requestId]: data,
      }));

    } catch (err) {
      console.error(err);
    }
  };


  const handleSendMessage = async (requestId: string) => {

    if (sendingMessageId === requestId) return;

    const message =
      messageInputs[requestId];

    if (!message?.trim()) return;

    setSendingMessageId(requestId);

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requests/message`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            requestId,
            message,
          }),
        }
      );

      await res.json();

      await fetchMessages(requestId);

      setMessageInputs((prev) => ({
        ...prev,
        [requestId]: "",
      }));

    } catch (err) {
      console.error(err);
    } finally {
      setSendingMessageId(null);
    }
  };

  const fetchBookings = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
      {
        credentials: "include",
      }
    );

    const data = await res.json();

    setBookings(
      Array.isArray(data) ? data : []
    );
  };

  // delete saved itineraries
  const handleDeleteItinerary = async (id: string) => {
    if (!confirm("Are you sure you want to delete this itinerary?")) return;

    setDeletingId(id);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/itineraries/${id}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      // ✅ remove from UI instantly
      setSavedItineraries((prev) =>
        prev.filter((trip) => trip.id !== id)
      );

      alert("Itinerary deleted successfully 🗑️");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };


  const handleWhatsAppDiscussion = (trip: any) => {

    const text = `
  Hello Travel Team,

  I'd like to discuss this itinerary.

  City: ${trip.city}
  Days: ${trip.days}
  Budget: ${trip.budget}
  Group Size: ${trip.groupSize}

  My itinerary ID:
  ${trip.id}
  `;

    const url =
      `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank");
  };

  console.log(bookings)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-16 lg:py-20 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center border-b border-gray-200 pb-8">

          <h1 className="text-4xl sm:text-5xl font-black text-gray-900">
            Travel Dashboard
          </h1>

          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your bookings, saved itineraries and conversations with our travel experts—all in one place.
          </p>

        </div>

        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-center font-medium">
            {message}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="bg-white rounded-3xl border shadow-sm p-6 text-center">
            <p className="text-3xl font-black text-blue-600">
              {bookings.length}
            </p>

            <p className="text-gray-600 mt-2">
              Bookings
            </p>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-6 text-center">
            <p className="text-3xl font-black text-green-600">
              {savedItineraries.length}
            </p>

            <p className="text-gray-600 mt-2">
              Saved Plans
            </p>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-6 text-center">
            <p className="text-3xl font-black text-orange-500">
              {activeRequests.length}
            </p>

            <p className="text-gray-600 mt-2">
              Active Requests
            </p>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-6 text-center">
            <p className="text-3xl font-black text-purple-600">
              {
                bookings.filter(
                  (b) => b.status === "COMPLETED"
                ).length
              }
            </p>

            <p className="text-gray-600 mt-2">
              Trips Completed
            </p>
          </div>

        </div>

        {/* BOOKINGS SECTION */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div>

            <h2 className="text-3xl font-black text-gray-900">
              📅 My Bookings
            </h2>

            <p className="text-gray-500 mt-2">
              Track payments, booking status and travel progress.
            </p>

          </div> 
          {bookings.length === 0 ? (
            <div className="bg-white border rounded-3xl p-10 text-center shadow-sm">

              <div className="text-5xl mb-4">
                ✈️
              </div>

              <h3 className="text-xl font-bold text-gray-900">
                No Bookings Yet
              </h3>

              <p className="text-gray-500 mt-3">
                Once you book a tour or AI itinerary, it will appear here.
              </p>

              <a
                href="/tours"
                className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition"
              >
                Explore Tours
              </a>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => {

                const hoursUntilTravel =
                  b.travelDate
                    ? (
                        new Date(b.travelDate).getTime() -
                        Date.now()
                      ) /
                      (1000 * 60 * 60)
                    : 9999;

                const refundEligible =
                  (
                    b.tourId
                      ? hoursUntilTravel >= 24
                      : !b.supplierBookingStarted
                  ) &&
                  !b.refundRejectedAt;

                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-3xl border border-gray-200 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between space-y-5"
                  >
                  <div>

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                      <h3 className="text-xl font-bold text-gray-900 leading-snug">
                        {b.tour?.title || b.itinerary?.title}
                      </h3>

                      <span
                        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap ${
                          ["CONFIRMED", "COMPLETED"].includes(b.status)
                            ? "bg-green-100 text-green-700"
                            : b.status === "REFUND_PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : b.status === "REFUNDED"
                            ? "bg-blue-100 text-blue-700"
                            : b.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {b.status.replace("_", " ")}
                      </span>

                    </div>
                    {/* {!b.tour && b.request?.finalPrice && (
                      <div className="mt-2 text-sm">
                        <p>
                          <strong>Final Package Price:</strong>
                          ₹{b.request.finalPrice}
                        </p>
                      </div>
                    )} */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 text-sm">
                      
                      {/* INJECTED TARGET DATA METADATA SNIPPET */}
                      <div className="bg-gray-50 rounded-2xl p-3">
                        <p className="text-xs text-gray-500">
                          📅 Travel Date
                        </p>
                        <p className="font-semibold text-gray-900 mt-1">
                          {b.travelDate
                            ? new Date(b.travelDate).toLocaleDateString()
                            : "Select Below"}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-3">
                        <p className="text-xs text-gray-500">
                          🕒 Time
                        </p>
                        <p className="font-semibold text-gray-900 mt-1">
                          {b.timeSlot || "Flexible"}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-3">
                        <p className="text-xs text-gray-500">
                          👥 Travelers
                        </p>
                        <p className="font-semibold text-gray-900 mt-1">
                          {b.travelers}
                        </p>
                      </div>

                    </div>
                    <div>
                      {!b.tour && b.request?.finalPrice && (
                        <div className="mt-2 space-y-1 text-sm">

                          <p>
                            <strong>
                              Final Package Price:
                            </strong>

                            ₹{b.request.finalPrice}
                          </p>

                          <p>
                            <strong>
                              Remaining Balance:
                            </strong>

                            ₹{
                              b.request.finalPrice -
                              b.advanceAmount
                            }
                          </p>

                        </div>
                      )}
                      <div className="mt-4 bg-blue-50 rounded-2xl p-4">

                        <p className="text-sm text-gray-600">
                          {
                            b.paymentStatus === "PAID"
                              ? "Advance Paid"
                              : "Advance Due"
                          }
                        </p>

                        <p
                          className={`text-3xl font-black mt-1 ${
                            b.paymentStatus === "PAID"
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        >
                          ₹{b.advanceAmount}
                        </p>

                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 pt-2 border-t">
                    {!b.travelDate && b.status === "PENDING_PAYMENT" && (
                      <div className="space-y-2">

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Preferred Travel Date
                        </label>

                        <input
                          type="date"
                          min={
                            new Date(
                              Date.now() + 3 * 24 * 60 * 60 * 1000
                            )
                              .toISOString()
                              .split("T")[0]
                          }
                          value={travelDates[b.id] || ""}
                          onChange={(e) =>
                            setTravelDates({
                              ...travelDates,
                              [b.id]: e.target.value,
                            })
                          }
                          className="w-full rounded-2xl border border-gray-300 bg-white p-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                        />
                        <p className="text-xs text-gray-500">
                          Please select a travel date at least 3 days in advance.
                        </p>

                      </div>
                    )}
                    <span className={`text-xs font-semibold px-3 py-2 rounded-full w-fit ${
                      ["CONFIRMED", "COMPLETED"].includes(b.status)
                        ? "bg-green-100 text-green-800"
                        : b.status === "REFUND_PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : b.status === "REFUNDED"
                        ? "bg-blue-100 text-blue-800"
                        : b.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {
                        b.status === "PENDING_PAYMENT"
                          ? "Awaiting Advance Payment"
                          : b.status === "CONFIRMED"
                          ? "Booking Confirmed"
                          : b.status === "REFUND_PENDING"
                          ? "Refund Review In Progress"
                          : b.status === "REFUNDED"
                          ? "Refunded"
                          : b.status || "PENDING"
                      }
                    </span>

                    {b.status === "REFUND_PENDING" &&
                      b.cancelledByAdmin && (

                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm space-y-2">

                          <p className="font-bold text-red-700">
                            ❌ Booking Cancelled by TourGen
                          </p>

                          <p>
                            <strong>Reason:</strong>{" "}
                            {b.adminCancellationReason}
                          </p>

                          <p className="text-gray-600">
                            We sincerely apologize for the inconvenience.
                            Your full refund has been initiated and is being processed.
                          </p>

                        </div>

                      )}

                    {b.status === "REFUND_PENDING" && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm space-y-1">

                        <p className="font-semibold text-yellow-800">

                          {b.cancelledByAdmin
                            ? "Full Refund Initiated"
                            : "Refund Request Submitted"}

                        </p>

                        <p>
                          Eligible Refund:
                          ₹{b.refundAmount ?? 0}
                        </p>

                        <p>
                          Refund Percentage:
                          {b.refundPercentage ?? 0}%
                        </p>

                        <p className="text-gray-600">

                          {b.cancelledByAdmin
                            ? "We cancelled this booking due to operational reasons. Your refund is being processed."
                            : "Your cancellation request is currently under review by our team."}

                        </p>

                      </div>
                    )}

                    {b.status === "REFUNDED" && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm space-y-1">

                        <p className="font-semibold text-green-700">
                          Refund Processed ✅
                        </p>

                        <p>
                          Refunded Amount:
                          ₹{b.refundAmount ?? 0}
                        </p>

                        <p>
                          Refund Percentage:
                          {b.refundPercentage ?? 0}%
                        </p>

                        <p className="text-gray-600">
                          Refund has been approved and processed.
                        </p>

                      </div>
                    )}
                    {b.status === "PENDING_PAYMENT" && (
                      <button
                        onClick={() => handlePayment(b.id)}
                        // Disables the button if this specific booking or any other payment is running
                        disabled={isPaying !== null}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isPaying === b.id ? "Processing..." : "Pay Now"}
                      </button>
                    )}
                    {b.status === "PENDING_PAYMENT" && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-5 text-sm text-blue-900">
                        A small advance payment is required to reserve your personalized itinerary planning,
                        consultation, and travel coordination services.
                      </div>
                    )}


                    <div className="bg-gradient-to-br from-gray-50 to-white border rounded-3xl p-5 space-y-4">

                      <h4 className="text-lg font-bold text-gray-900">
                        📍 Booking Progress
                      </h4>

                      <div className="space-y-2 text-sm">

                        <div className="text-green-600 font-medium">
                          ✅ Booking Created
                        </div>

                        <div
                          className={
                            b.paymentStatus === "PAID"
                              ? "text-green-600 font-medium"
                              : "text-gray-400"
                          }
                        >
                          {b.paymentStatus === "PAID"
                            ? "✅"
                            : "⏳"}{" "}
                          Advance Payment Received
                        </div>

                        

                        <div
                          className={
                            [
                              "CONFIRMED",
                              "COMPLETED",
                              // "REFUND_PENDING",
                              // "REFUNDED",
                            ].includes(b.status)
                              ? "text-green-600 font-medium"
                              : "text-gray-400"
                          }
                        >
                          {[
                            "CONFIRMED",
                            "COMPLETED",
                          ].includes(b.status)
                            ? "✅"
                            : "⏳"}{" "}
                          Booking Confirmed
                        </div>

                        {!b.tourId && (
                          <div
                            className={
                              b.supplierBookingStarted
                                ? "text-green-600 font-medium"
                                : "text-gray-400"
                            }
                          >
                            {b.supplierBookingStarted
                              ? "✅"
                              : "⏳"}{" "}
                            Travel Arrangements Started
                          </div>
                        )}

                        {b.cancelledByAdmin && (

                          <div className="text-red-600 font-medium">
                            ❌ Booking Cancelled by TourGen
                          </div>

                        )}

                        {b.cancelledByAdmin &&
                        ["REFUND_PENDING", "REFUNDED"].includes(b.status) && (

                          <div
                            className={
                              b.status === "REFUNDED"
                                ? "text-green-600 font-medium"
                                : "text-yellow-600 font-medium"
                            }
                          >

                            {b.status === "REFUNDED"
                              ? "✅ Full Refund Completed"
                              : "💰 Full Refund In Progress"}

                          </div>

                        )}

                        {!b.cancelledByAdmin && (

                          <div
                            className={
                              b.status === "COMPLETED"
                                ? "text-green-600 font-medium"
                                : "text-gray-400"
                            }
                          >
                            {b.status === "COMPLETED"
                              ? "✅"
                              : "⏳"}{" "}
                            Trip Completed
                          </div>

                          )}

                        {/* AI TOUR REVIEW */}
                        {!b.tourId &&
                          b.status === "COMPLETED" &&
                          !b.hasReviewed && (

                            <div className="mt-4 border rounded-2xl p-5 bg-gray-50">

                              <h3 className="font-bold text-lg">
                                How was your AI Travel Planning?
                              </h3>

                              <p className="text-sm text-gray-600 mt-1">
                                Your feedback helps other travelers
                                trust AI-generated itineraries.
                              </p>

                              <div className="flex gap-2 mt-4">

                                {[1,2,3,4,5].map((star) => (

                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() =>
                                      setReviewRating({
                                        ...reviewRating,
                                        [b.id]: star,
                                      })
                                    }
                                    className="text-3xl"
                                  >
                                    {star <= (reviewRating[b.id] || 5)
                                      ? "⭐"
                                      : "☆"}
                                  </button>

                                ))}

                              </div>

                              <textarea
                                value={
                                  reviewComment[b.id] || ""
                                }
                                onChange={(e) =>
                                  setReviewComment({
                                    ...reviewComment,
                                    [b.id]:
                                      e.target.value,
                                  })
                                }
                                placeholder="Tell us about your AI itinerary..."
                                className="w-full border rounded-xl p-3 mt-4"
                                rows={4}
                              />

                              <button
                                onClick={() =>
                                  handleAIReview(b)
                                }
                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
                              >
                                Submit Review
                              </button>

                            </div>

                          )}


                        {/* already reviewd */}
                        {!b.tourId &&
                            b.status === "COMPLETED" &&
                            b.hasReviewed && (

                              <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-5">

                                <h3 className="font-bold text-green-700">
                                  Thank you for your feedback! ❤️
                                </h3>

                                <p className="text-sm text-green-700 mt-2">
                                  Your review helps future travelers
                                  trust AI-powered trip planning.
                                </p>

                              </div>

                            )}

                      </div>

                    </div>

                    {(
                      b.status === "PENDING_PAYMENT" ||
                      b.status === "CONFIRMED" ||
                      b.status === "COMPLETED"
                    ) && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">

                      {b.status === "PENDING_PAYMENT" &&
                        "Waiting for advance payment."}

                      {b.status === "CONFIRMED" &&
                        !b.supplierBookingStarted &&
                        !b.tourId &&
                        "Your trip is confirmed. Travel arrangements will begin shortly."}

                      {b.status === "CONFIRMED" &&
                        b.supplierBookingStarted &&
                        "Travel arrangements are currently being finalized."}

                      {b.status === "COMPLETED" &&
                        "Your trip has been completed. Thank you for choosing TourGen."}

                      </div>
                    )}



                    {b.status === "CONFIRMED" && refundEligible && (
                      <button
                        onClick={() =>
                          handleRefundRequest(
                            b.id
                          )
                        }
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold transition"
                      >
                        Request Cancellation
                      </button>
                    )}

                    {b.status === "CONFIRMED" && !refundEligible && (
                      <div className="bg-gray-100 text-gray-700 p-3 rounded-xl text-sm">
                        {b.tourId
                          ? "Refund window has closed for this booking."
                          : "Travel arrangements have already started. Your guide, transport and other services are currently being arranged. This booking is no longer eligible for cancellation or refund under our policy."}
                      </div>
                    )}
                  </div>
                  {b.itinerary?.contentJson && (
                    <details className="mt-4">
                      <summary className="cursor-pointer font-semibold text-blue-600">
                        View Full Itinerary
                      </summary>

                      <div className="mt-3 space-y-2">
                        {b.itinerary.contentJson
                          .replace(/\*/g, "")
                          .split("\n")
                          .filter((line: string) => line.trim() !== "")
                          .map((line: string, i: number) => (
                            <div
                              key={i}
                              className="bg-gray-50 border rounded-xl p-3 overflow-hidden"
                            >
                              <p className="text-sm whitespace-pre-wrap">
                                {line}
                              </p>
                            </div>
                          ))}
                      </div>
                    </details>
                  )}
                </div>
                )
              })}
            </div>
          )}
        </div>

        {/* SAVED ITINERARIES */}
        <div className="space-y-4 pt-4">
          <div>

            <h2 className="text-3xl font-black text-gray-900">
              ❤️ Saved Itineraries
            </h2>

            <p className="text-gray-500 mt-2">
              AI generated trips you've saved for later.
            </p>

          </div>

          {savedItineraries.length === 0 ? (

            <p className="text-center text-gray-500">
              No saved itineraries yet.
            </p>

          ) : (

            <div className="space-y-4">

              {savedItineraries.map((trip) => (

                <div
                  key={trip.id}
                  className="bg-white rounded-3xl border border-gray-200 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 p-6 space-y-5"
                >

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                    <h3 className="text-xl font-bold text-gray-900 break-words">
                      {trip.title || trip.city}
                    </h3>

                    <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full w-fit">
                      📅 {trip.days} Days
                    </span>

                  </div>

                  <div className="space-y-3">

                    {trip.contentJson
                      ?.replace(/\*/g, "")
                      .split("\n")
                      .filter((line: string) => line.trim() !== "")
                      .slice(
                        0,
                        expandedTrips.includes(trip.id)
                          ? undefined
                          : 4
                      )
                      .map((line: string, i: number) => (

                        <div
                          key={i}
                          className="bg-gradient-to-r from-gray-50 to-white border rounded-2xl p-4 overflow-hidden"
                        >

                          <p
                            className={`leading-relaxed whitespace-pre-wrap ${
                              line.includes("Day") ||
                              line.includes("Overview") ||
                              line.includes("Budget")
                                ? "font-bold text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            {line}
                          </p>

                        </div>

                      ))}

                  </div>

                  <button
                    onClick={() => toggleExpand(trip.id)}
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition"
                  >
                    {expandedTrips.includes(trip.id)
                      ? "Show Less"
                      : "View Full Plan →"}
                  </button>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      disabled={submittingRequestId === trip.id}
                      onClick={async () => {
                        if (submittingRequestId === trip.id) return;

                        setSubmittingRequestId(trip.id);

                        try {
                          const res = await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/requests`,
                            {
                              credentials: "include",
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                itineraryId: trip.id,
                              }),
                            }
                          );

                          const data = await res.json();

                          if (!res.ok) {
                            alert(data.message || "Failed to submit request");
                            return;
                          }

                          await fetchData();

                          alert(
                            "Request submitted ✅ You can track it in Active Requests"
                          );
                        } catch (err) {
                          console.error(err);
                          alert("Something went wrong");
                        } finally {
                          setSubmittingRequestId(null);
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-[1.02] transition-all text-white py-3 rounded-2xl font-semibold shadow-md disabled:bg-gray-400"
                    >
                      {submittingRequestId === trip.id
                        ? "Submitting..."
                        : "Request This Plan"}
                    </button>
                    <button
                      onClick={() => handleDeleteItinerary(trip.id)}
                      disabled={deletingId === trip.id}
                      className="flex-1 bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all py-3 rounded-2xl font-semibold disabled:bg-gray-100"
                    >
                      {deletingId === trip.id ? "Deleting..." : "Delete Itinerary"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACTIVE REQUESTS SECTION */}
        <div className="space-y-4 pt-4">
          <div>

            <h2 className="text-3xl font-black text-gray-900">
              💬 Active Requests
            </h2>

            <p className="text-gray-500 mt-2">
              Chat with our travel experts about your itinerary.
            </p>

          </div>
          {activeRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border shadow-sm p-10 text-center">

              <div className="text-5xl mb-4">
                💬
              </div>

              <h3 className="text-xl font-bold text-gray-900">
                No Active Requests
              </h3>

              <p className="text-gray-500 mt-3">
                Submit one of your saved itineraries to start working with our travel experts.
              </p>

            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-500 text-sm">
                Trips currently under review by our travel experts
              </p>
              {activeRequests.map((req, index) => {
                const hasConversation = (messages[req.id] || []).length > 0;
                
                return (
                  <div key={req.id} className="bg-white rounded-3xl border border-gray-200 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <p className="text-sm font-semibold">{req.itinerary?.title}</p>
                      <p className="font-semibold text-sm wrap-break-word">
                        Status:{" "}

                        <span className="text-blue-600 uppercase">
                          {
                            req.status === "UNDER_REVIEW"
                              ? "UNDER EXPERT REVIEW"
                              : req.status === "REVISION_SENT"
                              ? "DISCUSSION IN PROGRESS"
                              : req.status === "APPROVED"
                              ? "APPROVED"
                              : req.status
                          }

                        </span>
                      </p>
                    </div>

                    {req.finalPrice && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-5">

                        <p className="font-semibold text-green-700">
                          Personalized Package Ready
                        </p>

                        <p className="text-gray-600">
                          Final Package Price
                        </p>

                        <p className="text-3xl font-black text-green-600 mt-2">
                          ₹{req.finalPrice}
                        </p>

                      </div>
                    )}

                    {req.itinerary?.contentJson && (
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl mt-2">
                        <strong className="text-gray-800 block mb-2">Your Itinerary Summary:</strong>
                        <div className="space-y-3">
                          {req.itinerary.contentJson
                            .replace(/\*/g, "")
                            .split("\n")
                            .filter((line: string) => line.trim() !== "")
                            .slice(0, expandedTrips.includes(req.id) ? undefined : 4)
                            .map((line: string, i: number) => (
                              <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-xs">
                                <p className={`leading-relaxed text-sm wrap-break-word w-full overflow-hidden whitespace-pre-wrap ${
                                  line.includes("Day") || line.includes("Overview") || line.includes("Budget")
                                    ? "font-bold text-blue-700" : "text-gray-700"
                                }`}>
                                  {line}
                                </p>
                              </div>
                            ))}
                        </div>
                        
                        <button
                          onClick={() => toggleExpand(req.id)}
                          className="mt-3 text-sm text-blue-600 font-semibold hover:underline"
                        >
                          {expandedTrips.includes(req.id) ? "← Show Less" : "View Full Plan Details"}
                        </button>
                      </div>
                    )}

                    
                    {(req.status === "REVISION_SENT" || hasConversation) && (
                      <div className="space-y-4 pt-2">

                        {req.revisionMessage && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">

                            <strong className="block mb-1">
                              Revision Notes from Travel Team:
                            </strong>

                            <p>
                              {req.revisionMessage}
                            </p>

                          </div>
                        )}

                        <div className="space-y-3">

                          <h4 className="font-semibold">
                            Conversation
                          </h4>

                          <div className="bg-gray-50 border rounded-3xl p-5 space-y-3 max-h-96 overflow-y-auto">
                            {(messages[req.id] || []).map((msg: any) => {
                              const bubbleClassName =
                                msg.senderType === "ADMIN"
                                  ? "bg-blue-100"
                                  : "bg-green-100";

                              const senderLabel =
                                msg.senderType === "ADMIN"
                                  ? "Travel Team"
                                  : "You";

                              return (
                                <div
                                  key={msg.id}
                                  className={`p-4 rounded-2xl text-sm break-words max-w-[85%] ${msg.senderType === "ADMIN" ? "bg-blue-100 mr-auto" : "bg-green-100 ml-auto"}`}
                                >
                                  <span className="font-semibold">
                                    {senderLabel}
                                  </span>
                                  <p className="mt-1">
                                    {msg.message}
                                  </p>
                                </div>
                              );
                            })}
                          </div>

                          <textarea
                            value={
                              messageInputs[req.id] || ""
                            }

                            onChange={(e) =>
                              setMessageInputs({
                                ...messageInputs,

                                [req.id]:
                                  e.target.value,
                              })
                            }

                            placeholder="Reply to travel team..."

                            className="w-full rounded-2xl border border-gray-300 p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                          />

                          <button
                            disabled={sendingMessageId === req.id}
                            onClick={() =>
                              handleSendMessage(req.id)
                            }
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all disabled:bg-gray-400"
                          >
                            {sendingMessageId === req.id
                              ? "Sending..."
                              : "Send Message"}
                          </button>

                        </div>
                        {/* <div className="flex gap-2">

                          <button
                            onClick={() => handleAccept(req.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition"
                          >
                            Accept Revision
                          </button>

                          <button
                            onClick={() => handleRejectRevision(req.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition"
                          >
                            Request Further Changes
                          </button>

                        </div> */}

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
