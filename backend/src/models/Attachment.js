import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema(
  {
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true, index: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    mimeType: { type: String },
    sizeBytes: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model('Attachment', attachmentSchema);

