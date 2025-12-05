import express from 'express';
import Joi from 'joi';
import Comment from '../models/Comment.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const createSchema = Joi.object({
  body: Joi.string().min(1).required(),
});

router.get('/issue/:issueId', requireAuth, async (req, res) => {
  const comments = await Comment.find({ issueId: req.params.issueId })
    .populate('authorId', 'name email')
    .sort({ createdAt: -1 });
  res.json(comments);
});

router.post('/issue/:issueId', requireAuth, validate(createSchema), async (req, res) => {
  const comment = await Comment.create({
    issueId: req.params.issueId,
    body: req.body.body,
    authorId: req.user.sub,
  });
  await comment.populate('authorId', 'name email');
  res.status(201).json(comment);
});

const updateSchema = Joi.object({
  body: Joi.string().min(1).required(),
});

router.patch('/:id', requireAuth, validate(updateSchema), async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Not found' });
  const isOwner = comment.authorId.toString() === req.user.sub;
  if (!(isOwner || ['admin', 'super_admin'].includes(req.user.role))) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  comment.body = req.body.body;
  await comment.save();
  res.json(comment);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Not found' });
  const isOwner = comment.authorId.toString() === req.user.sub;
  if (!(isOwner || ['admin', 'super_admin'].includes(req.user.role))) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await comment.deleteOne();
  res.json({ message: 'Deleted' });
});

export default router;

