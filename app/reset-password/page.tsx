"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const token =
      new URLSearchParams(window.location.search).get("token");

    if (!token) {
      alert("Invalid reset link.");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Password updated successfully.");

      router.push("/login");

    } catch (err) {

      console.error(err);

      alert("Something went wrong.");

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">

        <h1 className="text-2xl font-bold mb-2">
          Reset Password
        </h1>

        <p className="text-gray-500 mb-6">
          Enter your new password.
        </p>

        <input
          type="password"
          placeholder="New Password"
          className="w-full border rounded p-2 mb-4"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border rounded p-2 mb-6"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        <button
          disabled={loading}
          onClick={handleReset}
          className="w-full bg-black text-white rounded p-2"
        >
          {loading
            ? "Updating..."
            : "Update Password"}
        </button>

      </div>

    </div>
  );
}