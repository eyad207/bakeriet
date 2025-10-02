import mongoose from 'mongoose'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null }

/**
 * Optimized MongoDB connection with connection pooling
 *
 * Improvements:
 * 1. Connection pooling to handle concurrent requests
 * 2. Reasonable timeouts to prevent hanging
 * 3. Connection caching to reuse existing connections
 * 4. Lean queries support for better performance
 */
export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI
) => {
  if (cached.conn) {
    return { db: cached.conn.connection.db, connection: cached.conn.connection }
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing')
  }

  try {
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        maxPoolSize: 10, // Allow up to 10 concurrent connections
        serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB is slow
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4, skip IPv6 resolution
      }

      cached.promise = mongoose.connect(MONGODB_URI, opts)
    }

    cached.conn = await cached.promise
    return { db: cached.conn.connection.db, connection: cached.conn.connection }
  } catch (error) {
    cached.promise = null // Reset promise on error
    console.error('MongoDB connection error:', error)
    throw new Error('Failed to connect to MongoDB')
  }
}

// Export the function for use with '@/lib/mongodb'
export default connectToDatabase
