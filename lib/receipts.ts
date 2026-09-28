export const CATEGORIES = [
  "Office supplies",
  "Meals",
  "Travel",
  "Utilities",
  "Auto expenses",
  "Advertising",
  "Professional services",
  "Other business expenses",
  "Personal",
];
export type Receipt = {
  id: string;
  merchant: string;
  receipt_date: string;
  total_amount: number;
  tax_amount: number | null;
  category: string;
  notes: string | null;
  payment_method: string | null;
  image_url?: string | null;
  extracted_data?: {
    reviewed?: boolean;
    line_items?: { description: string; amount: string }[];
    [key: string]: unknown;
  };
};
export const money = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  );
export const dateLabel = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export const categoryColor = (category: string) =>
  /meal/i.test(category)
    ? "peach"
    : /travel|auto/i.test(category)
      ? "mint"
      : /util/i.test(category)
        ? "yellow"
        : "lavender";
export function sampleReceipts(): Receipt[] {
  const now = new Date();
  return [
    ["Paper & Co.", 48.6, "Office supplies"],
    ["Corner Cafe", 23.4, "Meals"],
    ["City Parking", 16, "Travel"],
    ["Studio Supply", 112.8, "Office supplies"],
    ["Northline Internet", 79, "Utilities"],
    ["Greenhouse Market", 34.25, "Meals"],
  ].map(([merchant, total, category], i) => ({
    id: `sample-${i}`,
    merchant: String(merchant),
    total_amount: Number(total),
    category: String(category),
    receipt_date: new Date(
      now.getFullYear(),
      now.getMonth(),
      Math.max(1, now.getDate() - i),
    ).toLocaleDateString("en-CA"),
    tax_amount: i === 0 ? 4.1 : null,
    notes: "Sample receipt for exploring the workspace.",
    payment_method: "Card ending 1234",
    image_url: "/images/receipt.webp",
    extracted_data: { reviewed: i !== 1 && i !== 5 },
  }));
}
export function csvFor(receipts: Receipt[], format: string) {
  const cell = (v: unknown) => {
    const s = String(v ?? "");
    return (
      '"' + (/^[=+\-@\t\r]/.test(s) ? "'" : "") + s.replaceAll('"', '""') + '"'
    );
  };
  const rows =
    format === "quickbooks"
      ? [
          ["Date", "Vendor", "Account", "Amount", "Memo"],
          ...receipts.map((r) => [
            r.receipt_date,
            r.merchant,
            r.category,
            r.total_amount.toFixed(2),
            r.notes,
          ]),
        ]
      : [
          [
            "Date",
            "Merchant",
            "Category",
            "Total",
            "Tax",
            "Payment Method",
            "Notes",
          ],
          ...receipts.map((r) => [
            r.receipt_date,
            r.merchant,
            r.category,
            r.total_amount.toFixed(2),
            r.tax_amount?.toFixed(2) ?? "",
            r.payment_method,
            r.notes,
          ]),
        ];
  return rows.map((r) => r.map(cell).join(",")).join("\r\n");
}
export function downloadCSV(text: string, name: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
