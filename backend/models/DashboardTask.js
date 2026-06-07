import mongoose from 'mongoose'

const dashboardTaskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    date: { type: String, default: '', trim: true },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
)

dashboardTaskSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model('DashboardTask', dashboardTaskSchema)
