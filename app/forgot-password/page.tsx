"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      setMessage(data.message);

    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">

        <h1 className="text-2xl font-bold mb-2">
          Forgot Password
        </h1>

        <p className="text-gray-500 mb-6">
          Enter your email address and we'll send you a password reset link.
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded p-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white rounded p-2"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && (
          <p className="mt-4 text-green-600 text-sm">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}