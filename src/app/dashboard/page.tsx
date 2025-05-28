import Link from "next/link";

export default function HomePage() {
  return (
    <div className=" bg-gray-900 text-white flex flex-col items-center justify-center space-y-6">
      <h1 className="text-4xl font-bold">Welcome to CoinVerse</h1>
      <p className="text-gray-400">Access your dashboard sections below:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/calls">
          <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 text-center">
            <h2 className="text-xl font-semibold">Calls</h2>
            <p className="text-gray-400">Manage your calls</p>
          </div>
        </Link>
        <Link href="/dashboard/groups">
          <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 text-center">
            <h2 className="text-xl font-semibold">Groups</h2>
            <p className="text-gray-400">View your groups</p>
          </div>
        </Link>
        <Link href="/dashboard/analytics">
          <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 text-center">
            <h2 className="text-xl font-semibold">Analytics</h2>
            <p className="text-gray-400">Analyze your data</p>
          </div>
        </Link>
        <Link href="/dashboard/messages">
          <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 text-center">
            <h2 className="text-xl font-semibold">Messages</h2>
            <p className="text-gray-400">Check your messages</p>
          </div>
        </Link>
        <Link href="/dashboard/settings">
          <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 text-center">
            <h2 className="text-xl font-semibold">Settings</h2>
            <p className="text-gray-400">Adjust your settings</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
