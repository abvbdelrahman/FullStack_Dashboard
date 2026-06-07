import mongoose from 'mongoose'

const userSettingsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    weeklyDigest: { type: Boolean, default: true },
    classReminders: { type: Boolean, default: true },
    compactMode: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('UserSettings', userSettingsSchema)
