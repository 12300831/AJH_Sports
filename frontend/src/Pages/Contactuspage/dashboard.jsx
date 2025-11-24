export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto p-4">

      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Player Overview</h1>

      {/* Player Card */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="h-16 w-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
            JS
          </div>

          {/* Info */}
          <div>
            <h2 className="text-xl font-semibold">John Smith</h2>
            <p className="text-gray-600">Player</p>
            <p className="text-gray-600 text-sm">Central Coast, NSW</p>
          </div>
        </div>

        <p className="mt-4 text-gray-700">
          Passionate tennis player with 5+ years of experience. Always looking
          to improve my game.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-600 text-sm">Total Bookings</p>
          <p className="text-3xl font-bold">47</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-600 text-sm">Hours Played</p>
          <p className="text-3xl font-bold">156</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-600 text-sm">Win Rate</p>
          <p className="text-3xl font-bold">68%</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Achievements</h3>

        <ul className="list-disc pl-5 text-gray-700">
          <li>First Win</li>
          <li>10 Hours Played</li>
          <li>Perfect Week</li>
        </ul>
      </div>
    </div>
  );
}
