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
  const [leads, setLeads] = useState<any[]>([]);

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
        `${process.env.NEXT_PUBLIC_API_URL}/tours`,
        {
          credentials: "include",
        }
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

        // FETCH REQUESTS
        const reqRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/requests`,
          {
            credentials: "include",
          }
        );
        const reqData = await reqRes.json();
        setRequests(Array.isArray(reqData) ? reqData : []);

        // FETCH BOOKINGS
        const bookingRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/bookings`,
          {
            credentials: "include",
          }
        );
        const bookingData = await bookingRes.json();
        setBookings(Array.isArray(bookingData) ? bookingData : []);

        // FETCH LEADS
        const leadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/leads`,
          {
            credentials: "include",
          }
        );
        const leadData = await leadRes.json();
        setLeads(Array.isArray(leadData) ? leadData : []);

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
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/approve`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId }),
        }
      );

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/requests`,
        { 
          credentials: "include",
        }
      );
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/reject`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId }),
        }
      );

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/requests`,
        { 
          credentials: "include",
        }
      );
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
      alert("Rejected ❌");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevision = async (requestId: string) => {
    const message = prompt("Enter revision message:");
    if (!message) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/revision`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId, message }),
        }
      );

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/requests`,
        { 
          credentials: "include",
        }
      );
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
      alert("Revision Sent ✏️");
    } catch (err) {
      console.error(err);
    }
  };

  const handleTourSubmit = async () => {
    const bodyData = {
      ...tourForm,
      price: Number(tourForm.price),
      highlights: tourForm.highlights.split(",").map((s) => s.trim()),
      inclusions: tourForm.inclusions.split(",").map((s) => s.trim()),
      exclusions: tourForm.exclusions.split(",").map((s) => s.trim()),
    };

    // FIXED: Corrected full Railway API endpoints
    const url = editingTourId
      ? `${process.env.NEXT_PUBLIC_API_URL}/tours/${editingTourId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/tours`;

    const method = editingTourId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        credentials: "include",
        method,
        headers: {
          "Content-Type": "application/json",
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
              placeholder="Image URL"
              value={tourForm.imageUrl}
              onChange={(e) => setTourForm({ ...tourForm, imageUrl: e.target.value })}
              className="border p-3 rounded-2xl w-full"
            />
          </div>

          <button
            onClick={handleTourSubmit}
            className="w-full bg-black text-white p-4 rounded-2xl font-bold"
          >
            {editingTourId ? "Update Tour" : "Create Tour"}
          </button>
        </div>

        {/* CRM LEADS SECTION */}
        <h2 className="text-2xl font-semibold mt-10 border-b pb-2">
          CRM Leads
        </h2>

        <div className="space-y-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-3xl border shadow p-6 space-y-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">{lead.name}</h3>
                  <p className="text-gray-500">{lead.email}</p>
                  <p className="text-gray-500">{lead.phone}</p>
                </div>
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {lead.status}
                </span>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-gray-700 leading-relaxed">{lead.message}</p>
              </div>

              <textarea
                placeholder="Internal notes..."
                defaultValue={lead.notes}
                id={`notes-${lead.id}`}
                className="border p-3 rounded-2xl w-full h-28"
              />

              <div className="flex flex-wrap gap-3">
                {[
                  "CONTACTED",
                  "INTERESTED",
                  "BOOKED",
                  "COMPLETED",
                  "LOST",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={async () => {
                      const notes = (
                        document.getElementById(
                          `notes-${lead.id}`
                        ) as HTMLTextAreaElement
                      )?.value;

                      await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/leads`,
                        {
                          credentials: "include",
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            leadId: lead.id,
                            status,
                            notes,
                          }),
                        }
                      );
                      window.location.reload();
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
 