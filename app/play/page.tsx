import Link from 'next/link'
import { getAllChallenges } from '@/app/actions/challenge'

export default async function PlayPage() {
  const challenges = await getAllChallenges()

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
            return (
              <Link
                key={card.slug}
                href={`/play/${challenge.id}`}
                className="group"
              >
                <div className={`bg-gradient-to-br ${card.color} rounded-lg shadow-lg p-8 text-white transform transition-transform hover:scale-105`}>
                  <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
                  <p className="text-white/80 mb-4">{card.author}</p>
                  <div className="mt-6 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Cliquez pour commencer →
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
