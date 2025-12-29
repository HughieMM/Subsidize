export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Subsidize</h1>
          <p className="text-xl text-gray-600">
            Compare grocery prices across Bermuda stores and save money
          </p>
        </header>

        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Search Products</h2>
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </section>

        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
          <div className="text-center py-12 text-gray-500">
            <p>No products available yet</p>
            <p className="text-sm mt-2">Products will appear here once stores are scraped</p>
          </div>
        </section>
      </div>
    </main>
  );
}
