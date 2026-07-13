"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleBuyNow = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Payment system configuring... Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Ai Fitness Planner</h1>
      <p className="text-xl mb-8">AI-powered SaaS tool to boost your productivity</p>
      <button
        onClick={{handleBuyNow}}
        disabled={{loading}}
        className="rounded-full bg-blue-600 px-8 py-4 text-white font-semibold hover:bg-blue-700"
      >
        {{loading ? "Processing..." : "Buy Now - $9.90"}}
      </button>
    </main>
  );
}
