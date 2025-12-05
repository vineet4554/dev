import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true, index: true },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'on-hold', 'resolved', 'closed'],
      required: true,
    },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model('IssueStatusHistory', historySchema);

