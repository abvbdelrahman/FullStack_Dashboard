import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    course: { type: String, default: 'General', trim: true },
    kind: {
      type: String,
      enum: ['PDF', 'Image', 'Design', 'Video', 'Link'],
      default: 'Link',
    },
    size: { type: String, default: '', trim: true },
    url: { type: String, required: true, trim: true },
    saved: { type: Boolean, default: false },
  },
  { timestamps: true }
)

resourceSchema.index({ user: 1, updatedAt: -1 })

export default mongoose.model('Resource', resourceSchema)
