import mongoose from 'mongoose'

let cachedConnection = null

export const connectDB = async () => {
  if (cachedConnection) return cachedConnection
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/knowledgepulse'
  console.log(uri)
  cachedConnection = await mongoose.connect(uri)
  console.log('MongoDB connected')
  return cachedConnection
}
