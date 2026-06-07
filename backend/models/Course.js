import mongoose from 'mongoose'

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, default: '', trim: true },
    label: { type: String, trim: true },
    description: { type: String, default: '' },
    duration: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    cloudinaryPublicId: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    type: {
      type: String,
      enum: ['video', 'article', 'quiz', 'assignment'],
      default: 'video',
    },
    isPreview: { type: Boolean, default: false },
    resources: [{ title: String, url: String }],
  },
  { _id: false }
)

const sectionSchema = new mongoose.Schema(
  {
    title: String,
    items: [lessonSchema],
  },
  { _id: false }
)

const instructorSchema = new mongoose.Schema(
  {
    name: String,
    avatar: String,
    role: String,
  },
  { _id: false }
)

const courseSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    legacyId: { type: Number },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    instructor: instructorSchema,
    duration: { type: String, default: '' },
    modules: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    whatYouLearn: [String],
    materialIncludes: [String],
    requirements: [String],
    tags: [String],
    audience: { type: String, default: '' },
    sections: [sectionSchema],
    totalLessons: { type: Number, default: 20 },
  },
  { timestamps: true }
)

courseSchema.index({ title: 'text', description: 'text', tags: 'text' })

export default mongoose.model('Course', courseSchema)
