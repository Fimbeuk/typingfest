import Link from 'next/link'
import { getLeaderboard } from '@/app/actions/leaderboard'

export default async function Home() {
  const leaderboard = await getLeaderboard()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">TypingFest</h1>
          <p className="text-xl text-gray-600 mb-8">
            Testez votre vitesse de frappe sur des extraits de littérature française
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Commencer
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🏆 Top 3 Mondial</h2>
          {leaderboard.global.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.global.slice(0, 3).map((entry, index) => (
                <div
                  key={entry.user.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-blue-600 w-8">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {entry.user.username || entry.user.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {entry.wpm} WPM moyen
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucun score encore. Soyez le premier !
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
