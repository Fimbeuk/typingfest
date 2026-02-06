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

**Étape 1 : Accéder au site Neon**
- Ouvrez votre navigateur et allez sur [https://neon.tech](https://neon.tech)
- Vous verrez la page d'accueil de Neon

**Étape 2 : Créer un compte**
- Cliquez sur le bouton **"Sign Up"** ou **"Get Started"** (en haut à droite)
- Vous avez plusieurs options pour créer un compte :
  - **Option A** : Cliquez sur **"Sign up with GitHub"** (recommandé si vous avez GitHub)
    - Vous serez redirigé vers GitHub pour autoriser Neon
    - Cliquez sur **"Authorize neon"**
  - **Option B** : Utilisez votre email
    - Entrez votre adresse email
    - Cliquez sur **"Continue"**
    - Vérifiez votre email et cliquez sur le lien de confirmation
- Une fois connecté, vous arriverez sur le dashboard Neon

**Étape 3 : Créer un nouveau projet**
- Sur le dashboard, cliquez sur le bouton **"Create Project"** ou **"New Project"**
- Remplissez le formulaire :
  - **Project name** : Donnez un nom à votre projet (ex: "typingfest" ou "typingfest-db")
  - **Region** : Choisissez la région la plus proche de vous (ex: "Europe (Frankfurt)" pour la France)
  - **PostgreSQL version** : Laissez la version par défaut (généralement 15 ou 16)
- Cliquez sur **"Create Project"**
- Attendez quelques secondes que Neon crée votre base de données (cela prend généralement 10-30 secondes)

**Étape 4 : Récupérer la DATABASE_URL**
- Une fois le projet créé, vous serez sur la page de votre projet
- Vous verrez une section **"Connection Details"** ou **"Connection string"**
- Il y aura plusieurs formats disponibles, cherchez celui qui commence par `postgresql://`
- Cliquez sur le bouton **"Copy"** à côté de la connection string
- La `DATABASE_URL` ressemblera à ceci :
  ```
  postgresql://username:password@ep-xxxx-xxxx.region.aws.neon.tech/dbname?sslmode=require
  ```
- **⚠️ IMPORTANT** : Gardez cette URL en sécurité ! Vous en aurez besoin pour Vercel

**Étape 5 : Tester la connexion (optionnel mais recommandé)**
- Vous pouvez tester que votre base de données fonctionne en cliquant sur **"Open SQL Editor"** dans le dashboard
- Essayez une requête simple comme : `SELECT 1;`
- Si cela fonctionne, votre base de données est prête !

**💡 Conseils importants :**
- **Sauvegardez votre DATABASE_URL** : Copiez-la dans un fichier texte temporaire, vous en aurez besoin pour Vercel
- **Ne partagez jamais votre DATABASE_URL** : Elle contient vos identifiants de connexion
- **Plan gratuit** : Neon offre un plan gratuit généreux (0.5 GB de stockage, suffisant pour commencer)
- **Mot de passe** : Neon génère automatiquement un mot de passe sécurisé, vous n'avez pas besoin de le créer vous-même

**🔍 Où trouver la DATABASE_URL si vous l'avez perdue :**
1. Retournez sur [neon.tech](https://neon.tech) et connectez-vous
2. Cliquez sur votre projet dans la liste
3. Allez dans l'onglet **"Connection Details"** ou **"Settings"**
4. La connection string sera affichée là-bas

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

**Étape 3.1 : Préparer votre code sur GitHub**
1. Assurez-vous que votre code est sur GitHub :
   ```bash
   git add .
   git commit -m "Préparation pour le déploiement"
   git push origin main
   ```

**Étape 3.2 : Créer un compte Vercel**
1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"** ou **"Log In"**
3. Choisissez **"Continue with GitHub"** (recommandé)
4. Autorisez Vercel à accéder à vos repositories GitHub

**Étape 3.3 : Importer votre projet**
1. Sur le dashboard Vercel, cliquez sur **"Add New Project"** ou **"New Project"**
2. Vous verrez la liste de vos repositories GitHub
3. Trouvez **"typingfest"** (ou le nom de votre repo) et cliquez sur **"Import"**

**Étape 3.4 : Configurer le projet**
1. Vercel détectera automatiquement que c'est un projet Next.js
2. **Ne changez rien** dans les paramètres de build (Framework Preset, Build Command, etc.)
3. **IMPORTANT** : Avant de cliquer sur "Deploy", cliquez sur **"Environment Variables"** ou **"Add Environment Variable"**

**Étape 3.5 : Ajouter les variables d'environnement**
1. Cliquez sur **"Add New"** pour ajouter une variable
2. Ajoutez la première variable :
   - **Name** : `DATABASE_URL`
   - **Value** : Collez votre `DATABASE_URL` copiée depuis Neon
   - **Environment** : ⚠️ **IMPORTANT** : Cochez **TOUTES** les cases :
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - Cliquez sur **"Save"**
3. ⚠️ **Vérification importante** : Assurez-vous que `DATABASE_URL` est bien visible dans la liste des variables d'environnement avant de déployer
3. Ajoutez la deuxième variable :
   - **Name** : `JWT_SECRET`
   - **Value** : Générez une clé secrète aléatoire
     - Sur Windows (PowerShell) : `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))`
     - Sur Mac/Linux : `openssl rand -base64 32`
     - Ou utilisez un générateur en ligne : [randomkeygen.com](https://randomkeygen.com)
   - **Environment** : Cochez toutes les cases
   - Cliquez sur **"Save"**
4. Vous devriez maintenant voir 2 variables d'environnement configurées

**Étape 3.6 : Déployer**
1. Cliquez sur le bouton **"Deploy"** en bas de la page
2. Vercel va maintenant :
   - Cloner votre repository
   - Installer les dépendances (`npm install`)
   - Générer le client Prisma (`prisma generate`)
   - Builder votre application Next.js
   - Déployer votre application
3. Cela prend généralement 2-5 minutes
4. Une fois terminé, vous verrez **"Congratulations!"** et un lien vers votre application (ex: `typingfest.vercel.app`)

🎉 **Félicitations !** Votre application est maintenant en ligne !

### Étape 4 : Initialiser la base de données ⚠️ CRUCIAL

**Cette étape est OBLIGATOIRE !** Sans elle, votre application affichera une erreur serveur.

#### Méthode la plus simple : Initialisation en 2 étapes

**Étape A : Créer les tables (migrations)**

Vous devez d'abord créer les tables. Utilisez Vercel CLI :

1. Installez Vercel CLI :
   ```bash
   npm i -g vercel
   ```

2. Connectez-vous et liez votre projet :
   ```bash
   vercel login
   vercel link
   ```

3. Téléchargez les variables d'environnement :
   ```bash
   vercel env pull .env.local
   ```

4. Exécutez les migrations :
   ```bash
   npx prisma migrate deploy
   ```

**Étape B : Ajouter les épreuves (seed)**

Une fois les tables créées, accédez à :
```
https://votre-app.vercel.app/api/init-db
```

Cette route va créer les 3 épreuves initiales.

**⚠️ IMPORTANT** : Après avoir initialisé, **supprimez la route** `app/api/init-db/route.ts` pour des raisons de sécurité.

Votre application devrait maintenant fonctionner !

#### Méthode alternative : Via Vercel CLI

1. Installez Vercel CLI sur votre machine :
   ```bash
   npm i -g vercel
   ```

2. Connectez-vous :
   ```bash
   vercel login
   ```

3. Liez votre projet local au projet Vercel :
   ```bash
   cd votre-projet
   vercel link
   ```
   Suivez les instructions pour sélectionner votre projet.

4. Téléchargez les variables d'environnement :
   ```bash
   vercel env pull .env.local
   ```

5. Exécutez les migrations (crée les tables) :
   ```bash
   npx prisma migrate deploy
   ```

6. Initialisez les données (crée les 3 épreuves) :
   ```bash
   npm run db:seed:prod
   ```

#### Méthode 2 : Via un script de post-deploy

Créez un fichier `vercel-build.sh` à la racine :

```bash
#!/bin/bash
npx prisma migrate deploy
npm run db:seed:prod
```

Puis modifiez `vercel.json` :
```json
{
  "buildCommand": "node scripts/build.js && bash vercel-build.sh"
}
```

#### Méthode 3 : Manuellement via une route API temporaire

Créez une route API `/api/init-db` (à supprimer après) pour initialiser la base de données.

**⚠️ IMPORTANT** : Après avoir initialisé la base de données, votre application devrait fonctionner. Si vous voyez toujours une erreur, consultez le fichier `TROUBLESHOOTING.md` pour plus d'aide.

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
