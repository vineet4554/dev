import express from 'express';
import User from '../models/User.js';
import Issue from '../models/Issue.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();

// Get all users (admin/super_admin only)
router.get('/', requireAuth, requireRole('admin', 'super_admin'), async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter).select('-passwordHash');
  res.json(users);
});

// Get engineers with workload
router.get('/engineers', requireAuth, async (req, res) => {
  const engineers = await User.find({ role: 'engineer' }).select('-passwordHash');
  const engineersWithWorkload = await Promise.all(
    engineers.map(async (engineer) => {
      const workload = await Issue.countDocuments({
        assignedTo: engineer._id,
        status: { $in: ['open', 'in-progress'] },
      });
      return {
        ...engineer.toObject(),
        workload,
      };
    })
  );
  res.json(engineersWithWorkload);
});

export default router;

