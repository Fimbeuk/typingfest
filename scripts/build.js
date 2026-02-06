const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Vérifier si DATABASE_URL est définie, sinon utiliser une valeur par défaut pour le build
if (!process.env.DATABASE_URL) {
  console.log('⚠️  DATABASE_URL not found, using dummy URL for Prisma generate...');
  process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';
}

try {
  console.log('📦 Generating Prisma Client...');
  execSync('prisma generate', { stdio: 'inherit', env: process.env });
  
  console.log('🏗️  Building Next.js application...');
  execSync('next build', { stdio: 'inherit', env: process.env });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
