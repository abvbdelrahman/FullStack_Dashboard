import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    course: { type: String, default: 'General', trim: true },
    body: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

noteSchema.index({ user: 1, updatedAt: -1 })

export default mongoose.model('Note', noteSchema)
