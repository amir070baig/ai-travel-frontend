"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {Plane, Heart, MessageCircle, Trophy,} from "lucide-react";

export default function MyRequestsPage() {
  const { loading } = useAuth();
  
  const [requests, setRequests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [savedItineraries, setSavedItineraries] = useState<any[]>([]);
  const [expandedTrips, setExpandedTrips] = useState<string[]>([]);
  const [travelDates, setTravelDates] = useState<Record<string, string>>({});
  const [fullNames, setFullNames] = useState<Record<string, string>>({});
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [countries, setCountries] = useState<Record<string, string>>({});
  const [whatsapps, setWhatsapps] = useState<Record<string, string>>({});
  const [hotelPickups, setHotelPickups] = useState<Record<string, string>>({});
  const [specialRequests, setSpecialRequests] = useState<Record<string, string>>({});
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
      if (!fullNames[bookingId]?.trim()) {
        alert("Please enter the primary traveler's full name.");
        return;
      }

      if (!emails[bookingId]?.trim()) {
        alert("Please enter the primary traveler's email address.");
        return;
      }

      if (!countries[bookingId]?.trim()) {
        alert("Please enter the traveler's country.");
        return;
      }
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

            fullName: fullNames[bookingId],
            email: emails[bookingId],
            country: countries[bookingId],
            whatsapp: whatsapps[bookingId],
            hotelPickup: hotelPickups[bookingId],
            specialRequests: specialRequests[bookingId],
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 lg:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 p-6 sm:p-8 text-white shadow-xl">

          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">

            <p className="text-xs sm:text-sm uppercase tracking-widest text-blue-100 font-semibold">
              Welcome Back 👋
            </p>

            <h1 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight break-words">
              Travel Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-blue-100 text-base sm:text-lg leading-relaxed">
              Manage your bookings, payments, saved itineraries and conversations with our travel experts from one place.
            </p>

          </div>

        </div>

        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-center font-medium text-sm sm:text-base break-words">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="bg-white rounded-3xl border shadow-sm p-6 text-center flex flex-col justify-center items-center min-w-0">
            <div className="flex justify-center mb-4">
              <div className="rounded-2xl bg-blue-100 p-3">
                <Plane className="h-7 w-7 text-blue-600" />
              </div>
            </div>

            <p className="text-3xl sm:text-4xl font-black text-gray-900 truncate w-full px-2">
              {bookings.length}
            </p>

            <p className="mt-2 text-xs font-bold text-gray-500 uppercase tracking-wide truncate w-full px-2">
              Bookings
            </p>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-6 text-center flex flex-col justify-center items-center min-w-0">
            <p className="text-3xl font-black text-green-600 truncate w-full px-2">
              {savedItineraries.length}
            </p>

            <p className="text-gray-600 mt-2 text-sm font-medium uppercase tracking-wide truncate w-full px-2">
              Saved Plans
            </p>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-6 text-center flex flex-col justify-center items-center min-w-0">
            <p className="text-3xl font-black text-orange-500 truncate w-full px-2">
              {activeRequests.length}
            </p>

            <p className="text-gray-600 mt-2 text-sm font-medium uppercase tracking-wide truncate w-full px-2">
              Active Requests
            </p>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-6 text-center flex flex-col justify-center items-center min-w-0">
            <p className="text-3xl font-black text-purple-600 truncate w-full px-2">
              {
                bookings.filter(
                  (b) => b.status === "COMPLETED"
                ).length
              }
            </p>

            <p className="text-gray-600 mt-2 text-sm font-medium uppercase tracking-wide truncate w-full px-2">
              Trips Completed
            </p>
          </div>

        </div>

        {/* BOOKINGS SECTION */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-5 gap-4">

            <div className="min-w-0">

              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 break-words">
                My Bookings
              </h2>

              <p className="mt-2 text-sm sm:text-base text-gray-500 break-words">
                Track payments, booking status and travel progress.
              </p>

            </div>

            <div className="hidden md:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100">
              <Plane className="h-6 w-6 text-blue-600" />
            </div>

          </div>
          {bookings.length === 0 ? (
            <div className="bg-white border rounded-3xl p-6 sm:p-10 text-center shadow-sm">

              <div className="text-4xl sm:text-5xl mb-4">
                ✈️
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                No Bookings Yet
              </h3>

              <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-md mx-auto">
                Once you book a tour or AI itinerary, it will appear here.
              </p>

              <a
                href="/tours"
                className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-all text-sm sm:text-base"
              >
                Explore Tours
              </a>

            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    className="bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-6 flex flex-col justify-between space-y-6 min-w-0"
                  >
                  <div className="space-y-6">

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-gray-100 pb-4">

                      <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight break-words hyphens-auto max-w-full sm:max-w-[70%]">
                        {b.tour?.title || b.itinerary?.title}
                      </h3>

                      <span
                        className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide w-fit h-fit ${
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

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                      
                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 transition-all hover:border-blue-200 hover:bg-blue-50 min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400 truncate">
                          📅 Travel Date
                        </p>
                        <p className="font-bold text-gray-800 mt-1 text-sm truncate">
                          {b.travelDate
                            ? new Date(b.travelDate).toLocaleDateString()
                            : "Select Below"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 transition-all hover:border-blue-200 hover:bg-blue-50 min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400 truncate">
                          🕒 Time
                        </p>
                        <p className="font-bold text-gray-800 mt-1 text-sm truncate">
                          {b.timeSlot || "Flexible"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 transition-all hover:border-blue-200 hover:bg-blue-50 min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400 truncate">
                          👥 Travelers
                        </p>
                        <p className="font-bold text-gray-800 mt-1 text-sm truncate">
                          {b.travelers}
                        </p>
                      </div>
                      
                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 transition-all hover:border-blue-200 hover:bg-blue-50 min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400 truncate">
                          💳 Payment
                        </p>
                        <p className="font-bold text-gray-800 mt-1 text-sm truncate">
                          {b.paymentStatus === "PAID" ? "Paid" : "Pending"}
                        </p>
                      </div>

                    </div>

                    <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-5 space-y-4">
                      {!b.tour && b.request?.finalPrice && (
                        <div className="space-y-1.5 text-xs sm:text-sm border-b border-blue-100 pb-3">

                          <p className="flex justify-between gap-2 break-words">
                            <span className="text-gray-600">Final Package Price:</span>
                            <strong className="text-gray-900">₹{b.request.finalPrice}</strong>
                          </p>

                          <p className="flex justify-between gap-2 break-words">
                            <span className="text-gray-600">Remaining Balance:</span>
                            <strong className="text-blue-700">₹{b.request.finalPrice - b.advanceAmount}</strong>
                          </p>

                          <p className="pt-1 text-[11px] sm:text-xs text-blue-800 leading-relaxed italic">
                            💳 The remaining balance can be paid when your trip begins or anytime during your tour.
                          </p>

                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3 pt-1">

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide truncate">
                            {b.paymentStatus === "PAID" ? "Advance Paid" : "Advance Due"}
                          </p>
                          <p className={`mt-1 text-2xl sm:text-3xl font-black truncate ${
                              b.paymentStatus === "PAID" ? "text-green-600" : "text-blue-600"
                            }`}
                          >
                            ₹{b.advanceAmount}
                          </p>
                        </div>

                        <div className={`rounded-full px-3 py-1 text-xs font-bold shrink-0 ${
                            b.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {b.paymentStatus}
                        </div>

                      </div>

                      <div className="border-t border-blue-200/60 pt-4">

                        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-900">
                          Payment Schedule
                        </h4>

                        <div className="space-y-2.5">

                          <div className="flex items-start gap-3 rounded-xl bg-white/80 p-3 shadow-xs">
                            <div className="text-green-600 text-sm font-bold shrink-0 mt-0.5">✓</div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate">Pay 30% Today</p>
                              <p className="text-[11px] text-gray-500 break-words">Secure your booking instantly.</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 rounded-xl bg-white/80 p-3 shadow-xs">
                            <div className="text-blue-600 text-sm font-bold shrink-0 mt-0.5">₹</div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate">Remaining 70%</p>
                              <p className="text-[11px] text-gray-500 break-words">Pay at arrival or during the tour.</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 rounded-xl bg-white/80 p-3 shadow-xs">
                            <div className="text-orange-500 text-sm font-bold shrink-0 mt-0.5">🛡️</div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate">Flexible Payment</p>
                              <p className="text-[11px] text-gray-500 break-words">No full upfront commitment needed.</p>
                            </div>
                          </div>

                        </div>

                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                    {!b.travelDate && b.status === "PENDING_PAYMENT" && (
                      
                      <div className="space-y-2">

                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                          className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition shadow-xs"
                        />
                        <p className="text-[11px] text-gray-400">
                          Please select a travel date at least 3 days in advance.
                        </p>

                      </div>
                    )}
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full w-fit ${
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

                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs sm:text-sm space-y-2 break-words">

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
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs sm:text-sm space-y-1 break-words">

                        <p className="font-bold text-yellow-800">

                          {b.cancelledByAdmin
                            ? "Full Refund Initiated"
                            : "Refund Request Submitted"}

                        </p>

                        <p>
                          <strong>Eligible Refund:</strong> ₹{b.refundAmount ?? 0}
                        </p>

                        <p>
                          <strong>Refund Percentage:</strong> {b.refundPercentage ?? 0}%
                        </p>

                        <p className="text-gray-600 pt-1 text-xs">

                          {b.cancelledByAdmin
                            ? "We cancelled this booking due to operational reasons. Your refund is being processed."
                            : "Your cancellation request is currently under review by our team."}

                        </p>

                      </div>
                    )}

                    {b.status === "REFUNDED" && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-xs sm:text-sm space-y-1 break-words">

                        <p className="font-bold text-green-700">
                          Refund Processed ✅
                        </p>

                        <p>
                          <strong>Refunded Amount:</strong> ₹{b.refundAmount ?? 0}
                        </p>

                        <p>
                          <strong>Refund Percentage:</strong> {b.refundPercentage ?? 0}%
                        </p>

                        <p className="text-gray-600 pt-1 text-xs">
                          Refund has been approved and processed.
                        </p>

                      </div>
                    )}
                    {b.status === "PENDING_PAYMENT" && (
                      <details className="rounded-2xl border border-gray-200 bg-white overflow-hidden group">
                        <summary className="cursor-pointer list-none px-4 py-3.5 text-sm sm:text-base font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition-all select-none">
                          <span>👤 Primary Traveler Details</span>
                          <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                        </summary>

                        <div className="border-t border-gray-200 p-4 sm:p-5 space-y-4">
                          <p className="text-xs text-gray-500 leading-relaxed">
                            We'll use these details to confirm your booking and coordinate your trip.
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                value={fullNames[b.id] || ""}
                                onChange={(e) =>
                                  setFullNames({
                                    ...fullNames,
                                    [b.id]: e.target.value,
                                  })
                                }
                                placeholder="John Smith"
                                className="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                Email Address *
                              </label>
                              <input
                                type="email"
                                value={emails[b.id] || ""}
                                onChange={(e) =>
                                  setEmails({
                                    ...emails,
                                    [b.id]: e.target.value,
                                  })
                                }
                                placeholder="john@example.com"
                                className="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                Country *
                              </label>
                              <input
                                type="text"
                                value={countries[b.id] || ""}
                                onChange={(e) =>
                                  setCountries({
                                    ...countries,
                                    [b.id]: e.target.value,
                                  })
                                }
                                placeholder="India"
                                className="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                WhatsApp Number (Optional)
                              </label>
                              <input
                                type="text"
                                value={whatsapps[b.id] || ""}
                                onChange={(e) =>
                                  setWhatsapps({
                                    ...whatsapps,
                                    [b.id]: e.target.value,
                                  })
                                }
                                placeholder="+91 9876543210"
                                className="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                              Hotel / Pickup Location (Optional)
                            </label>
                            <input
                              type="text"
                              value={hotelPickups[b.id] || ""}
                              onChange={(e) =>
                                setHotelPickups({
                                  ...hotelPickups,
                                  [b.id]: e.target.value,
                                })
                              }
                              placeholder="The Oberoi Amarvilas"
                              className="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                              Special Requests (Optional)
                            </label>
                            <textarea
                              rows={3}
                              value={specialRequests[b.id] || ""}
                              onChange={(e) =>
                                setSpecialRequests({
                                  ...specialRequests,
                                  [b.id]: e.target.value,
                                })
                              }
                              placeholder="Vegetarian meals, wheelchair assistance, celebration, etc."
                              className="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition resize-none"
                            />
                          </div>
                        </div>
                      </details>
                    )}
                    
                    {b.status === "PENDING_PAYMENT" && (
                      <button
                        onClick={() => handlePayment(b.id)}
                        disabled={isPaying !== null}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isPaying === b.id ? "Processing..." : "Pay Now"}
                      </button>
                    )}
                    {b.status === "PENDING_PAYMENT" && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 leading-relaxed break-words">
                        A small advance payment is required to reserve your personalized itinerary planning,
                        consultation, and travel coordination services.
                      </div>
                    )}


                    <details className="rounded-2xl border border-gray-200 bg-white overflow-hidden group">
                      <summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition-all select-none">
                        <span>📍 Booking Progress</span>
                        <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                      </summary>

                      <div className="border-t border-gray-200 p-4 space-y-3 text-xs sm:text-sm">

                        <div className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-2.5">
                          <span className="font-medium text-gray-950 truncate">Booking Created</span>
                          <span className="text-green-600 font-bold shrink-0">✓</span>
                        </div>

                        <div className={`flex items-center justify-between rounded-xl px-4 py-2.5 ${b.paymentStatus === "PAID" ? "bg-green-50" : "bg-gray-50"}`}>
                          <span className="font-medium text-gray-950 truncate">Advance Payment</span>
                          <span className={b.paymentStatus === "PAID" ? "text-green-600 font-bold shrink-0" : "text-gray-400 font-bold shrink-0"}>
                            {b.paymentStatus === "PAID" ? "✓" : "○"}
                          </span>
                        </div>

                        <div className={`flex items-center px-4 py-1.5 ${["CONFIRMED", "COMPLETED"].includes(b.status) ? "text-green-600 font-bold" : "text-gray-400 font-medium"}`}>
                          <span className="mr-2 shrink-0">{["CONFIRMED", "COMPLETED"].includes(b.status) ? "✅" : "⏳"}</span>
                          <span className="truncate">Booking Confirmed</span>
                        </div>

                        {!b.tourId && (
                          <div className={`flex items-center px-4 py-1.5 ${b.supplierBookingStarted ? "text-green-600 font-bold" : "text-gray-400 font-medium"}`}>
                            <span className="mr-2 shrink-0">{b.supplierBookingStarted ? "✅" : "⏳"}</span>
                            <span className="truncate">Travel Arrangements Started</span>
                          </div>
                        )}

                        {b.cancelledByAdmin && (
                          <div className="flex items-center px-4 py-1.5 text-red-600 font-bold break-words">
                            <span className="mr-2 shrink-0">❌</span>
                            <span>Booking Cancelled by TourGen</span>
                          </div>
                        )}

                        {b.cancelledByAdmin && ["REFUND_PENDING", "REFUNDED"].includes(b.status) && (
                          <div className={`flex items-center px-4 py-1.5 ${b.status === "REFUNDED" ? "text-green-600 font-bold" : "text-yellow-600 font-bold"}`}>
                            <span className="mr-2 shrink-0">{b.status === "REFUNDED" ? "✅" : "💰"}</span>
                            <span className="truncate">{b.status === "REFUNDED" ? "Full Refund Completed" : "Full Refund In Progress"}</span>
                          </div>
                        )}

                        {!b.cancelledByAdmin && (
                          <div className={`flex items-center px-4 py-1.5 ${b.status === "COMPLETED" ? "text-green-600 font-bold" : "text-gray-400 font-medium"}`}>
                            <span className="mr-2 shrink-0">{b.status === "COMPLETED" ? "✅" : "⏳"}</span>
                            <span className="truncate">Trip Completed</span>
                          </div>
                        )}

                        {/* AI TOUR REVIEW */}
                        {!b.tourId && b.status === "COMPLETED" && !b.hasReviewed && (
                            <div className="mt-4 border rounded-xl p-4 bg-gray-50 space-y-4 text-gray-900 break-words">
                              <div>
                                <h4 className="font-bold text-sm sm:text-base text-gray-900">How was your AI Travel Planning?</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Your feedback helps other travelers trust AI itineraries.</p>
                              </div>

                              <div className="flex gap-1.5">
                                {[1,2,3,4,5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewRating({ ...reviewRating, [b.id]: star })}
                                    className="text-2xl hover:scale-110 transition-transform"
                                  >
                                    {star <= (reviewRating[b.id] || 5) ? "⭐" : "☆"}
                                  </button>
                                ))}
                              </div>

                              <textarea
                                value={reviewComment[b.id] || ""}
                                onChange={(e) => setReviewComment({ ...reviewComment, [b.id]: e.target.value })}
                                placeholder="Tell us about your AI itinerary..."
                                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-100 transition resize-none"
                                rows={3}
                              />

                              <button
                                onClick={() => handleAIReview(b)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all text-xs"
                              >
                                Submit Review
                              </button>
                            </div>
                          )}

                        {/* already reviewed */}
                        {!b.tourId && b.status === "COMPLETED" && b.hasReviewed && (
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 break-words">
                              <h4 className="font-bold text-green-800 text-sm">Thank you for your feedback! ❤️</h4>
                              <p className="text-xs text-green-700 mt-1">Your review helps future travelers trust AI-powered trip planning.</p>
                            </div>
                          )}

                      </div>
                    </details>

                    {(
                      b.status === "PENDING_PAYMENT" ||
                      (b.status === "CONFIRMED" && !b.supplierBookingStarted) ||
                      b.status === "COMPLETED"
                    ) && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs sm:text-sm text-blue-900 break-words leading-relaxed">
                        {b.status === "PENDING_PAYMENT" && "Waiting for advance payment."}
                        {b.status === "CONFIRMED" && !b.supplierBookingStarted && !b.tourId && "Your trip is confirmed. Travel arrangements will begin shortly."}
                        {b.status === "CONFIRMED" && b.supplierBookingStarted && "Travel arrangements have already started. Our operations team is currently coordinating your guide, transport and other travel services."}
                        {b.status === "COMPLETED" && "Your trip has been completed. Thank you for choosing TourGen."}
                      </div>
                    )}

                    {b.status === "CONFIRMED" && refundEligible && (
                      <button
                        onClick={() => handleRefundRequest(b.id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all text-xs sm:text-sm shadow-xs"
                      >
                        Request Cancellation
                      </button>
                    )}

                    {b.status === "CONFIRMED" && !refundEligible && (
                      <div className="bg-gray-50 text-gray-600 border border-gray-200 p-3 rounded-xl text-xs sm:text-sm break-words leading-relaxed">
                        {b.tourId
                          ? "Refund window has closed for this booking."
                          : "Travel arrangements have already started. Your guide, transport and other services are currently being arranged. This booking is no longer eligible for cancellation or refund under our policy."}
                      </div>
                    )}
                  </div>

                  {b.itinerary?.contentJson && (
                    <details className="mt-4 border-t border-gray-100 pt-4 group">
                      <summary className="cursor-pointer font-bold text-sm text-blue-600 hover:text-blue-700 select-none flex justify-between items-center">
                        <span>View Full Itinerary</span>
                        <span className="text-xs group-open:rotate-180 transition-transform">▼</span>
                      </summary>

                      <div className="mt-3 space-y-2 max-h-96 overflow-y-auto pr-1">
                        {b.itinerary.contentJson
                          .replace(/\*/g, "")
                          .split("\n")
                          .filter((line: string) => line.trim() !== "")
                          .map((line: string, i: number) => (
                            <div
                              key={i}
                              className="bg-gray-50 border border-gray-100 rounded-xl p-3 min-w-0 overflow-hidden break-words"
                            >
                              <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
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

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 break-words">
              ❤️ Saved Itineraries
            </h2>

            <p className="text-sm sm:text-base text-gray-500 mt-2 break-words">
              AI generated trips you've saved for later.
            </p>

          </div>

          {savedItineraries.length === 0 ? (

            <p className="text-center text-gray-500 text-sm sm:text-base bg-white border rounded-2xl p-8 shadow-xs">
              No saved itineraries yet.
            </p>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {savedItineraries.map((trip) => (

                <div
                  key={trip.id}
                  className="bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 flex flex-col justify-between space-y-5 min-w-0"
                >
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-gray-100 pb-3">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 break-words max-w-full sm:max-w-[75%] leading-tight">
                        {trip.title || trip.city}
                      </h3>
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full w-fit shrink-0 h-fit">
                        📅 {trip.days} Days
                      </span>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {trip.contentJson
                        ?.replace(/\*/g, "")
                        .split("\n")
                        .filter((line: string) => line.trim() !== "")
                        .slice(0, expandedTrips.includes(trip.id) ? undefined : 4)
                        .map((line: string, i: number) => (
                          <div
                            key={i}
                            className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3 overflow-hidden break-words"
                          >
                            <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                                line.includes("Day") || line.includes("Overview") || line.includes("Budget")
                                  ? "font-bold text-blue-700" : "text-gray-700"
                              }`}
                            >
                              {line}
                            </p>
                          </div>
                        ))}
                    </div>

                    <button
                      onClick={() => toggleExpand(trip.id)}
                      className="inline-flex items-center text-xs sm:text-sm text-blue-600 font-bold hover:text-blue-700 transition-all select-none"
                    >
                      {expandedTrips.includes(trip.id) ? "▲ Show Less" : "▼ View Full Plan →"}
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-[1.01] active:scale-[0.99] transition-all text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed"
                    >
                      {submittingRequestId === trip.id ? "Submitting..." : "Request This Plan"}
                    </button>
                    <button
                      onClick={() => handleDeleteItinerary(trip.id)}
                      disabled={deletingId === trip.id}
                      className="flex-1 bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all py-2.5 rounded-xl font-bold text-xs sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      {deletingId === trip.id ? "Deleting..." : "Delete Plan"}
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

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 break-words">
              💬 Active Requests
            </h2>

            <p className="text-sm sm:text-base text-gray-500 mt-2 break-words">
              Chat with our travel experts about your itinerary.
            </p>

          </div>
          {activeRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border shadow-sm p-6 sm:p-10 text-center">

              <div className="text-4xl sm:text-5xl mb-4">
                💬
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                No Active Requests
              </h3>

              <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-md mx-auto">
                Submit one of your saved itineraries to start working with our travel experts.
              </p>

            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-center text-gray-400 text-xs sm:text-sm italic">
                Trips currently under review by our travel experts
              </p>
              {activeRequests.map((req, index) => {
                const hasConversation = (messages[req.id] || []).length > 0;
                
                return (
                  <div key={req.id} className="bg-white rounded-3xl border border-gray-200 shadow-lg p-4 sm:p-6 space-y-5 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
                      <p className="text-sm font-bold text-gray-800 break-words max-w-full sm:max-w-[70%]">{req.itinerary?.title}</p>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 break-words">
                        Status:{" "}
                        <span className="text-blue-600">
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
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 sm:p-5 break-words">

                        <p className="text-xs font-bold text-green-800 uppercase tracking-wider">
                          Personalized Package Ready
                        </p>

                        <p className="text-xs text-gray-500 mt-0.5">
                          Final Package Price
                        </p>

                        <p className="text-2xl sm:text-3xl font-black text-green-600 mt-1">
                          ₹{req.finalPrice}
                        </p>

                      </div>
                    )}

                    {req.itinerary?.contentJson && (
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl mt-2 space-y-3">
                        <strong className="text-xs font-bold uppercase tracking-wider text-gray-700 block">Your Itinerary Summary:</strong>
                        
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {req.itinerary.contentJson
                            .replace(/\*/g, "")
                            .split("\n")
                            .filter((line: string) => line.trim() !== "")
                            .slice(0, expandedTrips.includes(req.id) ? undefined : 4)
                            .map((line: string, i: number) => (
                              <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-xs break-words">
                                <p className={`leading-relaxed text-xs sm:text-sm whitespace-pre-wrap ${
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
                          className="text-xs text-blue-600 font-bold hover:underline inline-flex select-none"
                        >
                          {expandedTrips.includes(req.id) ? "▲ Show Less" : "▼ View Full Plan Details"}
                        </button>
                      </div>
                    )}

                    
                    {(req.status === "REVISION_SENT" || hasConversation) && (
                      <div className="space-y-4 pt-2 border-t border-gray-100">

                        {req.revisionMessage && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs sm:text-sm text-yellow-900 break-words leading-relaxed">
                            <strong className="block font-bold mb-1 uppercase tracking-wide text-xs text-yellow-800">
                              Revision Notes from Travel Team:
                            </strong>
                            <p>{req.revisionMessage}</p>
                          </div>
                        )}

                        <div className="space-y-3">

                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                            Conversation History
                          </h4>

                          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 sm:p-4 space-y-3 max-h-80 overflow-y-auto flex flex-col">
                            {(messages[req.id] || []).map((msg: any) => {
                              const isAdmin = msg.senderType === "ADMIN";
                              return (
                                <div
                                  key={msg.id}
                                  className={`p-3.5 rounded-2xl text-xs sm:text-sm break-words max-w-[85%] shadow-xs ${
                                    isAdmin ? "bg-blue-100 text-blue-950 mr-auto rounded-tl-none" : "bg-green-100 text-green-950 ml-auto rounded-tr-none"
                                  }`}
                                >
                                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-0.5">
                                    {isAdmin ? "Travel Team" : "You"}
                                  </span>
                                  <p className="leading-relaxed whitespace-pre-wrap">
                                    {msg.message}
                                  </p>
                                </div>
                              );
                            })}
                          </div>

                          <textarea
                            value={messageInputs[req.id] || ""}
                            onChange={(e) =>
                              setMessageInputs({
                                ...messageInputs,
                                [req.id]: e.target.value,
                              })
                            }
                            placeholder="Reply or share customization preferences with our team..."
                            className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition resize-none shadow-xs"
                            rows={3}
                          />

                          <button
                            disabled={sendingMessageId === req.id}
                            onClick={() => handleSendMessage(req.id)}
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-2.5 text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-400"
                          >
                            {sendingMessageId === req.id ? "Sending..." : "Send Message"}
                          </button>

                        </div>
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