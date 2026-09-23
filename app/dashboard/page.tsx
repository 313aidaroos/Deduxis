"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

interface ExtractedData {
  merchant: string;
  date: string;
  total: string;
  tax?: string;
  payment_method?: string;
  line_items?: Array<{
    description: string;
    amount: string;
  }>;
  category?: string;
}

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setExtracted(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleExtract = async () => {
    if (!file || !preview) return;

    setExtracting(true);
    setError(null);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: preview,
        }),
      });

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error("Receipt extraction is not available right now. Please check back later.");
        }
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to extract receipt data");
      }

      const data = await response.json();
      setExtracted(data);
    } catch (err) {
      setError((err instanceof Error ? err.message : String(err)) || "An error occurred during extraction");
    } finally {
      setExtracting(false);
    }
  };

  const handleSave = async () => {
    if (!extracted || !preview) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant: extracted.merchant,
          date: extracted.date,
          total: extracted.total,
          tax: extracted.tax,
          payment_method: extracted.payment_method,
          line_items: extracted.line_items,
          category: extracted.category,
          image_data: preview,
          extracted_data: extracted,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save receipt");
      }

      // Reset form after successful save
      setFile(null);
      setPreview(null);
      setExtracted(null);
      alert("Receipt saved successfully!");
    } catch (err) {
      setError((err instanceof Error ? err.message : String(err)) || "An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format: string = "csv") => {
    setExporting(true);
    try {
      const response = await fetch(`/api/export?format=${format}`);
      
      if (!response.ok) {
        throw new Error("Failed to export receipts");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `deduxis-${format}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError((err instanceof Error ? err.message : String(err)) || "An error occurred during export");
    } finally {
      setExporting(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <a
              href="/chat"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition"
            >
              Ask Cixy
            </a>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Upload Receipt</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Upload a receipt image to extract merchant, date, total, and line items
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
              id="receipt-upload"
            />
            <label
              htmlFor="receipt-upload"
              className="block text-center py-8 cursor-pointer"
            >
              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Receipt preview"
                    className="max-h-96 mx-auto border border-gray-200 dark:border-gray-800 rounded"
                  />
                  <p className="text-sm text-gray-500">{file?.name}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, HEIC up to 10MB</p>
                </div>
              )}
            </label>
          </div>

          {preview && !extracted && (
            <button
              onClick={handleExtract}
              disabled={extracting}
              className="w-full px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded text-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {extracting ? "Extracting..." : "Extract Receipt Data"}
            </button>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded">
              {error}
            </div>
          )}

          {extracted && (
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold">Extracted Data</h3>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setExtracted(null);
                  }}
                  className="text-sm px-4 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                >
                  New Receipt
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Merchant
                  </label>
                  <p className="text-lg">{extracted.merchant}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Date
                  </label>
                  <p className="text-lg">{extracted.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Total
                  </label>
                  <p className="text-lg font-bold">{extracted.total}</p>
                </div>
                {extracted.tax && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Tax
                    </label>
                    <p className="text-lg">{extracted.tax}</p>
                  </div>
                )}
                {extracted.payment_method && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Payment Method
                    </label>
                    <p className="text-lg">{extracted.payment_method}</p>
                  </div>
                )}
                {extracted.category && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Suggested Category
                    </label>
                    <p className="text-lg">{extracted.category}</p>
                  </div>
                )}
              </div>

              {extracted.line_items && extracted.line_items.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Line Items
                  </label>
                  <div className="border border-gray-200 dark:border-gray-800 rounded divide-y divide-gray-200 dark:divide-gray-800">
                    {extracted.line_items.map((item, idx) => (
                      <div key={idx} className="p-3 flex justify-between">
                        <span>{item.description}</span>
                        <span className="font-medium">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded hover:opacity-90 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Receipt"}
                </button>
                <button 
                  onClick={() => handleExport("csv")}
                  disabled={exporting}
                  className="flex-1 px-8 py-3 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {exporting ? "Exporting..." : "Export CSV"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
