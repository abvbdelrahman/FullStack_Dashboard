import mongoose from 'mongoose'

const replySchema = new mongoose.Schema(
  {
    author: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

const discussionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    course: { type: String, default: 'General', trim: true },
    author: { type: String, required: true, trim: true },
    tags: [String],
    excerpt: { type: String, required: true, trim: true },
    replies: [replySchema],
  },
  { timestamps: true }
)

discussionSchema.index({ user: 1, updatedAt: -1 })

export default mongoose.model('Discussion', discussionSchema)
