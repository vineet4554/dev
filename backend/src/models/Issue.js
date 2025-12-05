import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    priority: { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'medium' },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'on-hold', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
    facility: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    slaDeadline: { type: Date, index: true },
    resolvedAt: { type: Date },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Issue', issueSchema);

