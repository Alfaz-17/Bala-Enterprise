import mongoose from 'mongoose';

/**
 * Cached connection across hot reloads in development.
 * Global variable holds the connection promise and the cached connection.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Connect to MongoDB, reusing the cached connection when possible.
 */
export async function connectToDatabase() {
  if (global.mongooseConnection?.conn) {
    // Use the existing connection.
    return global.mongooseConnection.conn;
  }

  if (!global.mongooseConnection) {
    global.mongooseConnection = { conn: null, promise: null };
  }

  if (!global.mongooseConnection.promise) {
    global.mongooseConnection.promise = mongoose.connect(MONGODB_URI as string, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 15000,
    }).then((mongooseConn) => {
      global.mongooseConnection!.conn = mongooseConn;
      return mongooseConn;
    });
  }

  const mongooseConn = await global.mongooseConnection.promise;
  return mongooseConn;
}
