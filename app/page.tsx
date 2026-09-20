export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Deduxis</h1>
          <a 
            href="/login" 
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition"
          >
            Sign In
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold">
            Receipt Intelligence
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400">
            Capture receipts. Extract line items. Categorize deductions. Export for tax time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <a 
              href="/login"
              className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded text-lg hover:opacity-90 transition"
            >
              Get Started
            </a>
            <a 
              href="/chat"
              className="px-8 py-4 border border-gray-300 dark:border-gray-700 rounded text-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition"
            >
              Ask Cixy
            </a>
          </div>

          <div className="pt-12 border-t border-gray-200 dark:border-gray-800 mt-12">
            <h3 className="text-2xl font-bold mb-6">Pricing</h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="text-4xl font-bold mb-2">15,000 Ixis · $150</div>
              <div className="text-gray-600 dark:text-gray-400 mb-4">per month</div>
              <div className="text-lg mb-6">Receipt Intelligence seat + 200 receipts/month</div>
              <p className="text-sm text-gray-500">Extra receipts metered through Apixis Wallet</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500">
        <p>Part of the Apixis family · Powered by Ixis</p>
      </footer>
    </div>
  );
}
