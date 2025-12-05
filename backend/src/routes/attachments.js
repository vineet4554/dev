import express from 'express';
import multer from 'multer';
import Attachment from '../models/Attachment.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/issue/:issueId', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File required' });
  const record = await Attachment.create({
    issueId: req.params.issueId,
    fileName: req.file.originalname,
    fileUrl: `/uploads/${req.file.filename}`,
    mimeType: req.file.mimetype,
    sizeBytes: req.file.size,
  });
  res.status(201).json(record);
});

router.get('/issue/:issueId', requireAuth, async (req, res) => {
  const files = await Attachment.find({ issueId: req.params.issueId }).sort({ createdAt: -1 });
  res.json(files);
});

router.delete('/:id', requireAuth, requireRole('admin', 'super_admin'), async (req, res) => {
  await Attachment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;

