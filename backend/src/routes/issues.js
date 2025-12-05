import express from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import Issue from '../models/Issue.js';
import IssueStatusHistory from '../models/IssueStatusHistory.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const issueSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  priority: Joi.string().valid('critical', 'high', 'medium', 'low').default('medium'),
  facility: Joi.string().allow(''),
  slaDeadline: Joi.date().optional(),
});

router.get('/', requireAuth, async (req, res) => {
  const { status, priority, category, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { category: new RegExp(search, 'i') },
    ];
  }
  const issues = await Issue.find(filter)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });
  res.json(issues);
});

router.post('/', requireAuth, validate(issueSchema), async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB not connected. State:', mongoose.connection.readyState);
      return res.status(503).json({ message: 'Database not connected' });
    }
    
    const body = req.body;
    console.log('Creating issue with data:', { ...body, createdBy: req.user.sub });
    
    // Create and save issue to database
    const issue = new Issue({
      ...body,
      createdBy: req.user.sub,
    });
    
    // Explicitly save to database
    const savedIssue = await issue.save();
    console.log('Issue saved to database with ID:', savedIssue._id);
    console.log('Issue document:', JSON.stringify(savedIssue.toObject(), null, 2));
    
    // Verify it was saved by fetching from database
    const verifiedIssue = await Issue.findById(savedIssue._id);
    if (!verifiedIssue) {
      throw new Error('Issue was not found in database after save');
    }
    console.log('Verified issue exists in database:', verifiedIssue._id);
    
    // Create status history
    await IssueStatusHistory.create({
      issueId: savedIssue._id,
      status: savedIssue.status,
      changedBy: req.user.sub,
    });
    console.log('Status history created');
    
    // Populate the issue before sending response
    await savedIssue.populate('createdBy', 'name email');
    if (savedIssue.assignedTo) {
      await savedIssue.populate('assignedTo', 'name email');
    }
    
    console.log('Issue created and saved successfully:', savedIssue._id);
    res.status(201).json(savedIssue);
  } catch (error) {
    console.error('Error creating issue:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    res.status(500).json({ 
      message: error.message || 'Failed to create issue',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  const issue = await Issue.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');
  if (!issue) return res.status(404).json({ message: 'Not found' });
  res.json(issue);
});

const updateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  category: Joi.string(),
  priority: Joi.string().valid('critical', 'high', 'medium', 'low'),
  facility: Joi.string(),
  slaDeadline: Joi.date().allow(null),
});

router.patch('/:id', requireAuth, validate(updateSchema), async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Not found' });
  const isOwner = issue.createdBy.toString() === req.user.sub;
  if (!(isOwner || ['admin', 'super_admin'].includes(req.user.role))) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  Object.assign(issue, req.body);
  await issue.save();
  await issue.populate('createdBy', 'name email');
  if (issue.assignedTo) {
    await issue.populate('assignedTo', 'name email');
  }
  res.json(issue);
});

const statusSchema = Joi.object({
  status: Joi.string().valid('open', 'in-progress', 'on-hold', 'resolved', 'closed').required(),
});

router.post('/:id/status', requireAuth, validate(statusSchema), async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Not found' });
  if (!['engineer', 'admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const newStatus = req.body.status;
  issue.status = newStatus;
  if (newStatus === 'resolved') issue.resolvedAt = new Date();
  if (newStatus === 'closed') issue.closedAt = new Date();
  await issue.save();
  await IssueStatusHistory.create({
    issueId: issue._id,
    status: newStatus,
    changedBy: req.user.sub,
  });
  await issue.populate('createdBy', 'name email');
  if (issue.assignedTo) {
    await issue.populate('assignedTo', 'name email');
  }
  res.json(issue);
});

const assignSchema = Joi.object({
  assignedTo: Joi.string().allow(null).required(),
});

router.post('/:id/assign', requireAuth, requireRole('admin', 'super_admin'), validate(assignSchema), async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Not found' });
  issue.assignedTo = req.body.assignedTo || null;
  await issue.save();
  await IssueStatusHistory.create({
    issueId: issue._id,
    status: 'open',
    changedBy: req.user.sub,
  });
  await issue.populate('createdBy', 'name email');
  if (issue.assignedTo) {
    await issue.populate('assignedTo', 'name email');
  }
  res.json(issue);
});

router.post('/:id/unassign', requireAuth, requireRole('admin', 'super_admin'), async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Not found' });
  issue.assignedTo = null;
  await issue.save();
  await issue.populate('createdBy', 'name email');
  res.json(issue);
});

router.get('/:id/status-history', requireAuth, async (req, res) => {
  const history = await IssueStatusHistory.find({ issueId: req.params.id })
    .populate('changedBy', 'name email')
    .sort({ createdAt: -1 });
  res.json(history);
});

const bulkUpdateSchema = Joi.object({
  issueIds: Joi.array().items(Joi.string()).min(1).required(),
  updates: Joi.object().required(),
});

router.post('/bulk', requireAuth, requireRole('admin', 'super_admin'), validate(bulkUpdateSchema), async (req, res) => {
  const { issueIds, updates } = req.body;
  await Issue.updateMany({ _id: { $in: issueIds } }, { $set: updates });
  const updatedIssues = await Issue.find({ _id: { $in: issueIds } });
  res.json(updatedIssues);
});

router.delete('/:id', requireAuth, requireRole('admin', 'super_admin'), async (req, res) => {
  await Issue.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;

