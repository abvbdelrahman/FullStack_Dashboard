import mongoose from 'mongoose'

const calendarEventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    category: { type: String, default: '', trim: true },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
)

calendarEventSchema.index({ user: 1, date: 1 })

export default mongoose.model('CalendarEvent', calendarEventSchema)
