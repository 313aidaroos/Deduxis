import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 border-b border-gray-200 dark:border-gray-800 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">Deduxis</Link>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#what-we-do" className="hover:text-gray-600 dark:hover:text-gray-400 transition">What we do</a>
              <a href="#how-it-works" className="hover:text-gray-600 dark:hover:text-gray-400 transition">How it works</a>
              <a href="#vision" className="hover:text-gray-600 dark:hover:text-gray-400 transition">Our vision</a>
              <a href="#faq" className="hover:text-gray-600 dark:hover:text-gray-400 transition">FAQs</a>
              <Link href="/pricing" className="hover:text-gray-600 dark:hover:text-gray-400 transition">Pricing</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/chat" className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition">Ask Cixy</Link>
            <Link href="/login" className="px-4 py-2 text-sm bg-black dark:bg-white text-white dark:text-black rounded hover:opacity-90 transition">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
            Receipt Intelligence
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-400 mb-10">
            Capture. Extract. Categorize. Export.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg text-lg hover:opacity-90 transition">
              Start free trial
            </Link>
            <a href="#how-it-works" className="px-8 py-4 border border-gray-300 dark:border-gray-700 rounded-lg text-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition">
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section id="what-we-do" className="border-t border-gray-200 dark:border-gray-800 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm uppercase tracking-[3px] text-gray-500 mb-3">Product</div>
            <h2 className="text-4xl font-bold">What we do</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="text-3xl mb-4">📸</div>
              <h3 className="font-bold text-xl mb-2">Capture</h3>
              <p className="text-gray-600 dark:text-gray-400">Upload receipts from your phone or computer. Photos, scans, PDFs — we handle them all.</p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="font-bold text-xl mb-2">Extract</h3>
              <p className="text-gray-600 dark:text-gray-400">AI vision reads merchant, date, total, tax, line items, and payment method (only last 4 digits).</p>
            </div>
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="font-bold text-xl mb-2">Categorize & Export</h3>
              <p className="text-gray-600 dark:text-gray-400">Smart Schedule C suggestions + one-click CSV or QuickBooks export for tax time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-gray-200 dark:border-gray-800 py-20 px-6 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm uppercase tracking-[3px] text-gray-500 mb-3">Simple</div>
            <h2 className="text-4xl font-bold">How it works</h2>
          </div>

          <div className="space-y-8">
            {[
              { step: "1", title: "Upload a receipt", desc: "Take a photo or upload an image. We support JPG, PNG, HEIC." },
              { step: "2", title: "AI extracts the data", desc: "Claude Vision reads every line item, total, tax, date, and merchant in seconds." },
              { step: "3", title: "Review & categorize", desc: "We suggest the right Schedule C category. You can override — we remember your preference." },
              { step: "4", title: "Export for tax time", desc: "Download CSV or QuickBooks-ready files. All receipts stay private and audit-ready." },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our vision */}
      <section id="vision" className="border-t border-gray-200 dark:border-gray-800 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-sm uppercase tracking-[3px] text-gray-500 mb-3">Why we exist</div>
          <h2 className="text-4xl font-bold mb-6">Our vision</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Tax time should not be painful. We believe every business owner deserves clean, accurate, 
            and audit-ready records without hiring an army of accountants. Deduxis turns messy receipts 
            into structured, exportable intelligence — so you can focus on building, not bookkeeping.
          </p>
          <p className="mt-6 text-sm text-gray-500">Halal-conscious by design. Never a CPA.</p>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="border-t border-gray-200 dark:border-gray-800 py-20 px-6 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm uppercase tracking-[3px] text-gray-500 mb-3">Answers</div>
            <h2 className="text-4xl font-bold">Frequently asked questions</h2>
          </div>

          <div className="space-y-6">
            {[
              ["Is my receipt data private?", "Yes. All receipts are stored in a private Supabase bucket with Row Level Security. Only you can access your data."],
              ["Do you store full card numbers?", "No. We only extract and store the last 4 digits when visible. Full card numbers are never captured."],
              ["What categories do you support?", "We default to common US Schedule C business categories (Office Supplies, Meals, Travel, Auto, Advertising, etc.). You can override and we remember."],
              ["Can I export to QuickBooks?", "Yes. We provide both standard CSV and QuickBooks-compatible CSV exports."],
              ["How many receipts are included?", "The Receipt Intelligence seat includes 200 receipts per month. Extra receipts are metered through Apixis Wallet."],
              ["Are you a CPA?", "No. Deduxis and Cixy are not tax advisors. We help organize and categorize — final filing decisions belong to your CPA."],
            ].map(([q, a], i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <h4 className="font-bold mb-2">{q}</h4>
                <p className="text-gray-600 dark:text-gray-400">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-200 dark:border-gray-800 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to clean up your receipts?</h2>
        <Link href="/login" className="inline-block px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg text-lg hover:opacity-90 transition">
          Get started with Deduxis
        </Link>
      </section>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-6 text-center text-sm text-gray-500">
        <p>Part of the Apixis family · Powered by Ixis · Not a CPA</p>
      </footer>
    </div>
  );
}
