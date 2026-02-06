import { getAllChallenges } from '@/app/actions/challenge'
import { getLeaderboard } from '@/app/actions/leaderboard'
import ChallengeCard from '@/app/components/ChallengeCard'

// Forcer le rendu dynamique pour éviter les erreurs Prisma pendant le build
export const dynamic = 'force-dynamic'

export default async function PlayPage() {
  let challenges
  let leaderboard
  
  try {
    challenges = await getAllChallenges()
    leaderboard = await getLeaderboard()
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    // En cas d'erreur, retourner une page d'erreur
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-900 mb-2">Erreur de connexion à la base de données</h1>
            <p className="text-red-700 mb-4">
              La base de données n'est pas encore initialisée. Veuillez exécuter les migrations.
            </p>
            <p className="text-sm text-red-600">
              Consultez les logs Vercel pour plus de détails.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const challengeCards = [
    {
      slug: 'proust-swann',
      title: 'Du côté de chez Swann',
      author: 'Marcel Proust',
      color: 'from-purple-500 to-pink-500',
    },
    {
      slug: 'hugo-miserables',
      title: 'Les Misérables',
      author: 'Victor Hugo',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      slug: 'baudelaire-fleurs',
      title: 'Les Fleurs du mal',
      author: 'Charles Baudelaire',
      color: 'from-orange-500 to-red-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Choisissez une épreuve
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challengeCards.map((card) => {
            const challenge = challenges.find((c) => c.slug === card.slug)
            if (!challenge) return null
            const challengeLeaderboard = leaderboard.byChallenge[challenge.id] || []
            return (
              <ChallengeCard
                key={card.slug}
                challenge={challenge}
                card={card}
                leaderboard={challengeLeaderboard}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
