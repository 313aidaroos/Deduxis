"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Receipt, sampleReceipts } from "@/lib/receipts";
import { ReceiptForm } from "./receipt-form";
export function ReceiptUpload({
  demo,
  onClose,
  onSaved,
}: {
  demo: boolean;
  onClose: () => void;
  onSaved: (r: Receipt) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Receipt | null>(null);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  async function choose(file: File | undefined) {
    if (!file) return;
    setError("");
    setDraft(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError(
        "Choose a JPG, PNG, or WebP image. Convert PDF or HEIC files first.",
      );
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError(
        "This image is larger than 3 MB. Please choose a smaller image.",
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(String(reader.result));
      setName(file.name);
    };
    reader.onerror = () =>
      setError("Could not read this image. Please choose it again.");
    reader.readAsDataURL(file);
  }
  async function extract() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Could not extract this receipt.");
      const amount = (v: unknown) =>
        Number(String(v ?? 0).replace(/[$,]/g, "")) || 0;
      setDraft({
        id: "new",
        merchant: data.merchant || "",
        receipt_date: /^\d{4}-\d{2}-\d{2}$/.test(data.date)
          ? data.date
          : new Date().toLocaleDateString("en-CA"),
        total_amount: amount(data.total),
        tax_amount: data.tax ? amount(data.tax) : null,
        category: data.category || "Other business expenses",
        notes: "",
        payment_method: data.payment_method || null,
        image_url: image,
        extracted_data: { ...data, reviewed: false },
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Extraction unavailable. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function save(r: Receipt) {
    if (demo) {
      onSaved({ ...r, id: `sample-${crypto.randomUUID()}` });
      onClose();
      return;
    }
    const res = await fetch("/api/receipts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant: r.merchant,
        date: r.receipt_date,
        total: String(r.total_amount),
        tax: r.tax_amount === null ? null : String(r.tax_amount),
        category: r.category,
        notes: r.notes,
        payment_method: r.payment_method,
        image_data: image,
        extracted_data: r.extracted_data,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not save your receipt.");
    onSaved({ ...data.receipt, image_url: image });
    onClose();
  }
  return (
    <dialog
      ref={dialog}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(e) => {
        if (e.target === dialog.current && !busy) onClose();
      }}
    >
      <div className="section-heading">
        <h2>Upload a receipt</h2>
        <button
          disabled={busy}
          className="close-button"
          aria-label="Close upload"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <p className="form-help">
        A small step toward a more organized business.
      </p>
      {demo ? (
        <>
          <div className="notice" style={{ marginTop: 20 }}>
            This is a demo. Try the sample receipt below.{" "}
            <Link href="/login">Sign in to scan your own.</Link>
          </div>
          {!draft && (
            <button
              className="button primary full"
              onClick={() =>
                setDraft({
                  ...sampleReceipts()[0],
                  id: "new",
                  extracted_data: { reviewed: false },
                })
              }
            >
              Try a sample receipt →
            </button>
          )}
        </>
      ) : (
        !draft && (
          <>
            <label
              className="upload-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                void choose(e.dataTransfer.files[0]);
              }}
            >
              <input
                aria-label="Choose a receipt image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={busy}
                onChange={(e) => void choose(e.target.files?.[0])}
              />
              {image ? (
                <Image
                  className="upload-preview"
                  src={image}
                  alt="Selected receipt preview"
                  width={400}
                  height={300}
                  unoptimized
                />
              ) : (
                <span className="step-symbol" aria-hidden>
                  ↥
                </span>
              )}
              <strong>{name || "Drop your receipt here"}</strong>
              <p>or click to choose · JPG, PNG, WebP · up to 3 MB</p>
            </label>
            <button
              disabled={!image || busy}
              className="button primary full"
              onClick={extract}
            >
              {busy ? "Reading your receipt…" : "Extract receipt details →"}
            </button>
          </>
        )
      )}
      {error && (
        <p className="notice error" role="alert" style={{ marginTop: 16 }}>
          {error} <Link href="/pricing">View plan</Link>
        </p>
      )}
      {draft && (
        <div style={{ marginTop: 20 }}>
          <ReceiptForm key={draft.id} receipt={draft} onSave={save} />
        </div>
      )}
    </dialog>
  );
}
