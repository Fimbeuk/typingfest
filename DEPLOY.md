# Guide de déploiement - TypingFest

Ce guide vous explique comment déployer TypingFest en ligne pour que d'autres personnes puissent y participer.

## Prérequis

- Un compte GitHub
- Un compte Vercel (gratuit)
- Un compte pour une base de données PostgreSQL (Neon, Railway, ou Supabase - tous gratuits)

## Option 1 : Déploiement sur Vercel (Recommandé)

### Étape 1 : Préparer votre code

1. Assurez-vous que votre code est sur GitHub :
   ```bash
   git add .
   git commit -m "Préparation pour le déploiement"
   git push origin main
   ```

### Étape 2 : Créer une base de données PostgreSQL

Choisissez l'un de ces services gratuits :

#### Option A : Neon (Recommandé - gratuit)
1. Allez sur [neon.tech](https://neon.tech)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Copiez la `DATABASE_URL` (format: `postgresql://user:password@host/database?sslmode=require`)

#### Option B : Railway
1. Allez sur [railway.app](https://railway.app)
2. Créez un compte gratuit
3. Créez un nouveau projet → "Add PostgreSQL"
4. Copiez la `DATABASE_URL` depuis les variables d'environnement

#### Option C : Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Allez dans Settings → Database → Connection string
5. Copiez la `DATABASE_URL`

### Étape 3 : Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre compte GitHub
3. Cliquez sur "Add New Project"
4. Importez votre repository TypingFest
5. Configurez les variables d'environnement :
   - `DATABASE_URL` : La URL de votre base de données PostgreSQL
   - `JWT_SECRET` : Générez une clé secrète aléatoire (vous pouvez utiliser : `openssl rand -base64 32`)
6. Cliquez sur "Deploy"

### Étape 4 : Initialiser la base de données

Une fois le déploiement terminé :

1. Allez dans les paramètres de votre projet Vercel
2. Ouvrez la console (ou utilisez Vercel CLI)
3. Exécutez les migrations :
   ```bash
   npx prisma migrate deploy
   ```
4. Exécutez le seed pour créer les épreuves :
   ```bash
   npm run db:seed
   ```

**Note** : Vous pouvez aussi créer un script de build personnalisé dans Vercel pour automatiser cela.

## Option 2 : Déploiement sur Railway (Tout-en-un)

Railway peut héberger à la fois votre application et votre base de données :

1. Allez sur [railway.app](https://railway.app)
2. Créez un nouveau projet
3. Ajoutez PostgreSQL
4. Ajoutez un service GitHub et connectez votre repo
5. Configurez les variables d'environnement :
   - `DATABASE_URL` : Utilisez la variable de référence de Railway
   - `JWT_SECRET` : Générez une clé secrète
6. Railway déploiera automatiquement votre application

## Variables d'environnement requises

- `DATABASE_URL` : URL de connexion PostgreSQL
- `JWT_SECRET` : Clé secrète pour signer les tokens JWT (générez-en une aléatoire)

## Commandes utiles

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Initialiser les données (épreuves)
npm run db:seed

# Build local
npm run build
```

## Migration depuis SQLite vers PostgreSQL

Si vous aviez des données en local avec SQLite, vous devrez les migrer manuellement ou utiliser un outil de migration.

## Support

En cas de problème :
- Vérifiez les logs dans Vercel/Railway
- Assurez-vous que `DATABASE_URL` est correctement configuré
- Vérifiez que les migrations ont été appliquées
