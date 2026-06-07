import mongoose from 'mongoose'

const classSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    course: { type: String, default: 'General', trim: true },
    instructor: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true, trim: true },
    duration: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['Upcoming', 'Live', 'Completed'],
      default: 'Upcoming',
    },
    recordingUrl: { type: String, default: '', trim: true },
  },
  { timestamps: true }
)

classSessionSchema.index({ user: 1, date: 1 })

export default mongoose.model('ClassSession', classSessionSchema)
