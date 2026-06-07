import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    time: { type: String, default: 'Just now', trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
)

notificationSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model('Notification', notificationSchema)
