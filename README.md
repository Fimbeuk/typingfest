# TypingFest

TypingFest est une application web pour tester votre vitesse de frappe sur des extraits de littérature française.

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ 
- PostgreSQL (pour la production) ou SQLite (pour le développement local)

### Installation

1. Clonez le repository :
```bash
git clone <votre-repo>
cd typingfest
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env
```

Éditez `.env` et ajoutez :
- `DATABASE_URL` : URL de votre base de données PostgreSQL
- `JWT_SECRET` : Une clé secrète aléatoire pour les tokens JWT

4. Initialisez la base de données :
```bash
# Créer les tables
npx prisma migrate dev

# Ajouter les épreuves initiales
npm run db:seed
```

5. Lancez le serveur de développement :
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📦 Déploiement

Consultez le fichier [DEPLOY.md](./DEPLOY.md) pour un guide complet de déploiement sur Vercel, Railway ou d'autres plateformes.

## 🛠️ Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build la production
- `npm run start` - Lance le serveur de production
- `npm run db:push` - Pousse le schema vers la base de données
- `npm run db:migrate` - Crée une nouvelle migration
- `npm run db:seed` - Initialise les données (épreuves)

## 📝 Technologies utilisées

- **Next.js 16** - Framework React
- **Prisma** - ORM pour la base de données
- **PostgreSQL** - Base de données
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles
- **react-hot-toast** - Notifications

## 📄 Licence

MIT
