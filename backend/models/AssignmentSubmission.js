import mongoose from 'mongoose'

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    submissionFile: { type: String, required: true },
    cloudinaryPublicId: { type: String, default: '' },
    submitStatus: {
      type: String,
      enum: ['Submitted'],
      default: 'Submitted',
    },
    points: { type: Number, default: 0 },
    feedback: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

assignmentSubmissionSchema.index({ assignment: 1, user: 1 }, { unique: true })

export default mongoose.model('AssignmentSubmission', assignmentSubmissionSchema)
