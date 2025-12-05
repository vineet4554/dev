import mongoose from 'mongoose';

const connectDb = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }
  
  try {
    await mongoose.connect(uri, { 
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Mongo connected to:', uri.replace(/\/\/.*@/, '//***@'));
    
    // Verify connection
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    throw error;
  }
};

export default connectDb;

