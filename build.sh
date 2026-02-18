# Build script for Render deployment

echo "🚀 Starting build process..."

# Install all dependencies (including devDependencies for the build step)
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Build the application
echo "🏗️ Building NestJS application..."
npx nest build

echo "✅ Build completed successfully!"
