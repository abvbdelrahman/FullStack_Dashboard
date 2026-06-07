import mongoose from 'mongoose'

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    currentLesson: { type: Number, default: 1 },
    totalLessons: { type: Number, default: 20 },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completedLessons: [{ type: String }],
  },
  { timestamps: true }
)

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true })

export default mongoose.model('Enrollment', enrollmentSchema)
