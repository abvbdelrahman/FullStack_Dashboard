import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema(
  {
    legacyId: { type: Number },
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    category: { type: String, default: 'General' },
    image: { type: String, default: '' },
    date: { type: String, default: '' },
    summary: { type: String, default: '' },
    content: [String],
  },
  { timestamps: true }
)

export default mongoose.model('Blog', blogSchema)
