"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const checkAuth = async () => {

      try {

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const data = await res.json();

        setUser(data);

      } catch (err) {

        console.error(err);

        router.replace("/login");

      } finally {

        setLoading(false);

      }

    };

    checkAuth();

  }, [router]);

  return {
    user,
    loading,
  };
}