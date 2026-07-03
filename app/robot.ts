import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/payment",
        "/my-requests",
      ],
    },

    sitemap: "https://tourgen.in/sitemap.xml",
  };
}