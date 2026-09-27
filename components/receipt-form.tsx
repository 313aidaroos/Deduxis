"use client";
import { useState } from "react";
import Image from "next/image";
import { CATEGORIES, Receipt } from "@/lib/receipts";
export function ReceiptForm({
  receipt,
  onSave,
  onClose,
  busy = false,
}: {
  receipt: Receipt;
  onSave: (r: Receipt) => Promise<void>;
  onClose?: () => void;
  busy?: boolean;
}) {
  const [draft, setDraft] = useState(receipt);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const categories = Array.from(new Set([...CATEGORIES, draft.category]));
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      await onSave({
        ...draft,
        extracted_data: { ...draft.extracted_data, reviewed: true },
      });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not save. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <form onSubmit={submit} className="review-panel">
      <div className="section-heading">
        <h2>Review receipt</h2>
        {onClose && (
          <button
            type="button"
            className="close-button"
            aria-label="Close receipt details"
            onClick={onClose}
          >
            ×
          </button>
        )}
      </div>
      {receipt.image_url ? (
        <Image
          className="receipt-image"
          src={receipt.image_url}
          alt={`Receipt from ${receipt.merchant}`}
          width={500}
          height={600}
          unoptimized
        />
      ) : (
        <div className="image-missing">Receipt image unavailable</div>
      )}
      <div className="field">
        <label htmlFor={`merchant-${receipt.id}`}>Merchant</label>
        <input
          id={`merchant-${receipt.id}`}
          required
          maxLength={200}
          value={draft.merchant}
          onChange={(e) => setDraft({ ...draft, merchant: e.target.value })}
        />
      </div>
      <div className="field-pair">
        <div className="field">
          <label htmlFor={`date-${receipt.id}`}>Date</label>
          <input
            id={`date-${receipt.id}`}
            type="date"
            required
            value={draft.receipt_date}
            onChange={(e) =>
              setDraft({ ...draft, receipt_date: e.target.value })
            }
          />
        </div>
        <div className="field">
          <label htmlFor={`total-${receipt.id}`}>Total (USD)</label>
          <input
            id={`total-${receipt.id}`}
            type="number"
            min="0"
            step="0.01"
            required
            value={draft.total_amount}
            onChange={(e) =>
              setDraft({ ...draft, total_amount: Number(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`category-${receipt.id}`}>Category</label>
        <select
          id={`category-${receipt.id}`}
          value={draft.category}
          onChange={(e) => setDraft({ ...draft, category: e.target.value })}
        >
          {categories.filter(Boolean).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`notes-${receipt.id}`}>
          Notes <span className="muted">(optional)</span>
        </label>
        <textarea
          id={`notes-${receipt.id}`}
          maxLength={2000}
          value={draft.notes ?? ""}
          placeholder="What was this expense for?"
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
        />
      </div>
      {draft.extracted_data?.line_items && (
        <details className="form-help">
          <summary>View extracted line items</summary>
          {draft.extracted_data.line_items.map((item, i) => (
            <p key={i}>
              {item.description} · {item.amount}
            </p>
          ))}
        </details>
      )}
      {error && (
        <p className="notice error" role="alert">
          {error}
        </p>
      )}
      <button className="button primary full" disabled={pending || busy}>
        {pending ? "Saving…" : "Save changes"}
      </button>
      <p className="form-help">
        Check the original before saving. Categories are suggestions.
      </p>
    </form>
  );
}
