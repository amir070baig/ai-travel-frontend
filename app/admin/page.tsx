"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  useAuth();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [tourForm, setTourForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    duration: "",
    pickupPoint: "",
    highlights: "",
    inclusions: "",
    exclusions: "",
  });

  const [editingTourId, setEditingTourId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role === "ADMIN") {
      setIsAdmin(true);
    } else {
      router.push("/generate");
    }
  }, [router]);

  const fetchTours = async () => {
    try {
      const tourRes = await fetch(
        "https://ai-travel-backend-production.up.railway.app/tours"
      );
      const tourData = await tourRes.json();
      setTours(Array.isArray(tourData) ? tourData : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // FETCH REQUESTS
        const reqRes = await fetch(
          "https://ai-travel-backend-production.up.railway.app/admin/requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const reqData = await reqRes.json();
        setRequests(Array.isArray(reqData) ? reqData : []);

        // FETCH BOOKINGS
        const bookingRes = await fetch(
          "https://ai-travel-backend-production.up.railway.app/admin/bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const bookingData = await bookingRes.json();
        setBookings(Array.isArray(bookingData) ? bookingData : []);

        // FETCH TOURS
        await fetchTours();
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [isAdmin]);

  const handleApprove = async (requestId: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        "https://ai-travel-backend-production.up.railway.app/admin/approve",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ requestId }),
        }
      );

      const res = await fetch(
        "https://ai-travel-backend-production.up.railway.app/admin/requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        "https://ai-travel-backend-production.up.railway.app/admin/reject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ requestId }),
        }
      );

      const res = await fetch(
        "https://ai-travel-backend-production.up.railway.app/admin/requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
      alert("Rejected ❌");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevision = async (requestId: string) => {
    const token = localStorage.getItem("token");
    const message = prompt("Enter revision message:");
    if (!message) return;

    try {
      await fetch(
        "https://ai-travel-backend-production.up.railway.app/admin/revision",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ requestId, message }),
        }
      );

      const res = await fetch(
        "https://ai-travel-backend-production.up.railway.app/admin/requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
      alert("Revision Sent ✏️");
    } catch (err) {
      console.error(err);
    }
  };

  const handleTourSubmit = async () => {
    const token = localStorage.getItem("token");
    const bodyData = {
      ...tourForm,
      price: Number(tourForm.price),
      highlights: tourForm.highlights.split(",").map((s) => s.trim()),
      inclusions: tourForm.inclusions.split(",").map((s) => s.trim()),
      exclusions: tourForm.exclusions.split(",").map((s) => s.trim()),
    };

    const url = editingTourId
      ? `railway.app{editingTourId}`
      : "railway.app";

    const method = editingTourId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        alert(editingTourId ? "Tour Updated! ✨" : "Tour Created! ✨");
        setEditingTourId("");
        setTourForm({
          title: "",
          description: "",
          price: "",
          imageUrl: "",
          duration: "",
          pickupPoint: "",
          highlights: "",
          inclusions: "",
          exclusions: "",
        });
        await fetchTours();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSelect = (tour: any) => {
    setEditingTourId(tour.id);
    setTourForm({
      title: tour.title || "",
      description: tour.description || "",
      price: String(tour.price || ""),
      imageUrl: tour.imageUrl || "",
      duration: tour.duration || "",
      pickupPoint: tour.pickupPoint || "",
      highlights: Array.isArray(tour.highlights) ? tour.highlights.join(", ") : "",
      inclusions: Array.isArray(tour.inclusions) ? tour.inclusions.join(", ") : "",
      exclusions: Array.isArray(tour.exclusions) ? tour.exclusions.join(", ") : "",
    });
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>

        {/* TOUR FORM */}
        <div className="bg-white rounded-3xl shadow border p-6 space-y-4">
          <h2 className="text-3xl font-black">
            {editingTourId ? "Edit Tour" : "Tour Management"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Tour Title"
              value={tourForm.title}
              onChange={(e) => setTourForm({ ...tourForm, title: e.target.value })}
              className="border p-3 rounded-2xl"
            />
            <input
              placeholder="Price"
              value={tourForm.price}
              onChange={(e) => setTourForm({ ...tourForm, price: e.target.value })}
              className="border p-3 rounded-2xl"
            />
          </div>

          <textarea
            placeholder="Description"
            value={tourForm.description}
            onChange={(e) => setTourForm({ ...tourForm, description: e.target.value })}
            className="border p-3 rounded-2xl w-full h-32"
          />

          <div className="space-y-3">
            <label className="font-medium">Upload Tour Image</label>
            <input
              type="file"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append("image", file);

                try {
                  const res = await fetch(
                    "https://ai-travel-backend-production.up.railway.app/upload",
                    { method: "POST", body: formData }
                  );
                  const data = await res.json();
                  setTourForm({ ...tourForm, imageUrl: data.imageUrl });
                } catch (err) {
                  console.error(err);
                  alert("Image upload failed");
                }
              }}
              className="border p-3 rounded-2xl w-full"
            />
            {tourForm.imageUrl && (
              <img src={tourForm.imageUrl} alt="Preview" className="w-full h-64 object-cover rounded-2xl" />
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Duration (e.g., 3 Days)"
              value={tourForm.duration}
              onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })}
              className="border p-3 rounded-2xl"
            />
            <input
              placeholder="Pickup Point"
              value={tourForm.pickupPoint}
              onChange={(e) => setTourForm({ ...tourForm, pickupPoint: e.target.value })}
              className="border p-3 rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <input
              placeholder="Highlights (comma separated)"
              value={tourForm.highlights}
              onChange={(e) => setTourForm({ ...tourForm, highlights: e.target.value })}
              className="border p-3 rounded-2xl w-full"
            />
            <input
              placeholder="Inclusions (comma separated)"
              value={tourForm.inclusions}
              onChange={(e) => setTourForm({ ...tourForm, inclusions: e.target.value })}
              className="border p-3 rounded-2xl w-full"
            />
            <input
              placeholder="Exclusions (comma separated)"
              value={tourForm.exclusions}
              onChange={(e) => setTourForm({ ...tourForm, exclusions: e.target.value })}
              className="border p-3 rounded-2xl w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleTourSubmit}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition"
            >
              {editingTourId ? "Update Tour Info" : "Save & Create Tour"}
            </button>
            {editingTourId && (
              <button
                onClick={() => {
                  setEditingTourId("");
                  setTourForm({
                    title: "", description: "", price: "", imageUrl: "",
                    duration: "", pickupPoint: "", highlights: "", inclusions: "", exclusions: ""
                  });
                }}
                className="bg-gray-400 text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* BOOKINGS LIST */}
        <div className="bg-white rounded-3xl shadow border p-6 space-y-4">
          <h2 className="text-2xl font-bold">Active Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-gray-500">No active reservations.</p>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="border p-4 rounded-2xl bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{b.tour?.title}</h3>
                    <p className="text-sm text-gray-600">User: {b.user?.email}</p>
                    <p className="text-sm"><strong>Date:</strong> {new Date(b.travelDate).toLocaleDateString()}</p>
                    <p className="text-sm"><strong>Time Slot:</strong> {b.timeSlot} | <strong>Travelers:</strong> {b.travelers}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EXISTENT TOURS ROW LIST */}
        <div className="bg-white rounded-3xl shadow border p-6 space-y-4">
          <h2 className="text-2xl font-bold">Existing Live Tours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tours.map((t) => (
              <div key={t.id} className="border p-4 rounded-2xl flex gap-4 items-center bg-gray-50">
                <img src={t.imageUrl} alt="" className="w-16 h-16 object-cover rounded-xl" />
                <div className="flex-1">
                  <h4 className="font-bold">{t.title}</h4>
                  <p className="text-sm text-gray-500">₹{t.price} / person</p>
                </div>
                <button
                  onClick={() => handleEditSelect(t)}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-xl text-sm hover:bg-gray-300"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* REQUESTS LIST */}
        <div className="bg-white rounded-3xl shadow border p-6 space-y-4">
          <h2 className="text-2xl font-bold">Pending Approval Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-500">No pending requests found.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <div key={r.id} className="border p-4 rounded-2xl bg-gray-50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700">Request ID: {r.id}</span>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Pending Review</span>
                  </div>
                  <p className="text-sm text-gray-600">{r.details || "Custom system generated request"}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRevision(r.id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Ask Revision
                    </button>
                    <button
                      onClick={() => handleReject(r.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
