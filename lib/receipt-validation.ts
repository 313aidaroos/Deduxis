export function validatedReceipt(body: Record<string, unknown>) {
  const merchant =
    typeof body.merchant === "string" ? body.merchant.trim() : "";
  const category =
    typeof body.category === "string" ? body.category.trim() : "";
  const date = String(body.receipt_date ?? body.date ?? "");
  const total = Number(
    String(body.total_amount ?? body.total ?? "").replace(/[$,]/g, ""),
  );
  const rawTax = body.tax_amount ?? body.tax;
  const tax =
    rawTax == null || rawTax === ""
      ? null
      : Number(String(rawTax).replace(/[$,]/g, ""));
  if (
    !merchant ||
    merchant.length > 200 ||
    !category ||
    category.length > 100 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date ||
    !Number.isFinite(total) ||
    total < 0 ||
    total > 99999999.99 ||
    (tax !== null && (!Number.isFinite(tax) || tax < 0))
  )
    throw new Error(
      "Check the merchant, date, category, and amounts before saving.",
    );
  return {
    merchant,
    receipt_date: date,
    total_amount: total,
    tax_amount: tax,
    category,
    notes: typeof body.notes === "string" ? body.notes.slice(0, 2000) : null,
  };
}
export function receiptImage(value: unknown) {
  if (typeof value !== "string") throw new Error("Choose a receipt image.");
  const match = value.match(
    /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\r\n]+)$/,
  );
  if (!match) throw new Error("Choose a JPG, PNG, or WebP receipt image.");
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length === 0 || bytes.length > 3 * 1024 * 1024)
    throw new Error("Choose an image under 3 MB.");
  const valid =
    match[1] === "image/jpeg"
      ? bytes[0] === 255 && bytes[1] === 216
      : match[1] === "image/png"
        ? bytes
            .subarray(0, 8)
            .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : bytes.toString("ascii", 0, 4) === "RIFF" &&
          bytes.toString("ascii", 8, 12) === "WEBP";
  if (!valid)
    throw new Error(
      "This file does not match a supported receipt image format.",
    );
  return { bytes, type: match[1], extension: match[1].split("/")[1] };
}
