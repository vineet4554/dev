import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssues } from '../context/IssueContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUpload, FiX } from 'react-icons/fi';

const CreateIssue = () => {
  const { createIssue } = useIssues();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    facility: 'Command Center Alpha',
  });

  const [attachments, setAttachments] = useState([]);

  const categories = [
    'Teleport Pad',
    'Sensor',
    'Zord Engine',
    'Communication System',
    'Security System',
    'Power Grid',
    'Other',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Backend will set createdBy from JWT token automatically
      const newIssue = await createIssue({
        ...formData,
        // Don't send createdBy - backend uses req.user.sub from JWT
      });

      if (newIssue && newIssue.id) {
        navigate(`/issues/${newIssue.id}`);
      }
    } catch (error) {
      // Error is already handled in createIssue function
      console.error('Failed to create issue:', error);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files.map((f) => ({ name: f.name, file: f }))]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Report New Issue</h1>
        <p className="text-gray-400 mt-1">Submit a new issue to the command center</p>
      </div>

      <form onSubmit={handleSubmit} className="ranger-card p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title <span className="text-ranger-red">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="ranger-input"
            placeholder="e.g., Teleport Pad Alpha Malfunction"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category <span className="text-ranger-red">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="ranger-input"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Priority <span className="text-ranger-red">*</span>
          </label>
          <div className="grid grid-cols-4 gap-4">
            {['critical', 'high', 'medium', 'low'].map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => setFormData({ ...formData, priority })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.priority === priority
                    ? `priority-${priority} border-current`
                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                <span className="font-semibold capitalize">{priority}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Facility
          </label>
          <select
            value={formData.facility}
            onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
            className="ranger-input"
          >
            <option value="Command Center Alpha">Command Center Alpha</option>
            <option value="Command Center Beta">Command Center Beta</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description <span className="text-ranger-red">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="ranger-input min-h-32 resize-y"
            placeholder="Describe the issue in detail..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Attachments (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <FiUpload className="text-3xl text-gray-400" />
              <span className="text-gray-400">Click to upload files</span>
              <span className="text-xs text-gray-500">or drag and drop</span>
            </label>
          </div>
          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <span className="text-sm text-white">{attachment.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <FiX className="text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/issues')}
            className="ranger-button bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ranger-button bg-morphin-time hover:bg-purple-600 text-white morphin-glow"
          >
            Submit Issue
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateIssue;
