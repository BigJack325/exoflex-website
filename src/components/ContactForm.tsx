"use client";

import { useState } from "react";
import clsx from "clsx";

type Status = "idle" | "sending" | "ok" | "error";

export default function ContactForm() {
  const [status, setStatus]   = useState<Status>("idle");
  const [errorMsg, setError]  = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const formEl  = e.currentTarget;
    const payload = Object.fromEntries(new FormData(formEl).entries());

    try {
      const res = await fetch("/api/hubspot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setStatus("ok");
      formEl.reset();

      setTimeout(() => setStatus("idle"), 4000);
    } catch (err: unknown) {
      setStatus("error");
      if (err instanceof Error) {
        setError(err.message || "Failed to submit");
      } else {
        setError("An unknown error occurred");
      }
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-6 text-white">
      {/* email */}
      <div>
        <label htmlFor="email" className="block">Email *</label>
        <input id="email" name="email" type="email" required
          className="mt-1 w-full rounded bg-white/15 p-2" />
      </div>

      {/* first & last name */}
      <div>
        <label htmlFor="firstname" className="block">First name</label>
        <input id="firstname" name="firstname" type="text"
          className="mt-1 w-full rounded bg-white/15 p-2" />
      </div>
      <div>
        <label htmlFor="lastname" className="block">Last name</label>
        <input id="lastname" name="lastname" type="text"
          className="mt-1 w-full rounded bg-white/15 p-2" />
      </div>

      {/* message */}
      <div>
        <label htmlFor="message" className="block">Message *</label>
        <textarea id="message" name="message" rows={4} required
          className="mt-1 w-full rounded bg-white/15 p-2" />
      </div>

      {/* submit */}
      <button
        type="submit"
        disabled={status === "sending" || status === "ok"}
        className={clsx(
          "mx-auto block",
          "rounded-xl border border-white font-bold tracking-wide text-white text-center",
          "px-4 py-2 text-base",
          "transition-colors duration-150 hover:bg-blue-600",
          "lg:text-xl",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {status === "sending" ? "Sending…" : status === "ok" ? "Thank you!" : "Send"}
      </button>

      {/* feedback en cas d’erreur */}
      {status === "error" && (
        <p className="text-red-400">
          Error – {errorMsg || "something went wrong, try again"}
        </p>
      )}
    </form>
  );
}