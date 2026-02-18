# Build script for Render deployment

echo "🚀 Starting build process..."

# Install all dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client (Forzando v6.2.1)
echo "🔧 Generating Prisma Client..."
./node_modules/.bin/prisma generate

# Run database migrations (optional, if it fails the build continues)
echo "🗄️ Running database migrations..."
./node_modules/.bin/prisma migrate deploy || echo "⚠️ Migration failed, but continuing build..."

# Build the application
echo "🏗️ Building NestJS application..."
./node_modules/.bin/nest build

echo "✅ Build completed successfully!"
