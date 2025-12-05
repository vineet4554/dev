import React, { useState, useEffect } from 'react';
import { useIssues } from '../context/IssueContext';
import { useAuth } from '../context/AuthContext';
import { commentsAPI } from '../services/api';
import { FiSend, FiUser } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const CommentSystem = ({ issue }) => {
  const { addComment } = useIssues();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const response = await commentsAPI.getByIssue(issue.id);
        const commentsData = response.data.map(comment => ({
          ...comment,
          id: comment._id,
          author: comment.authorId?.name || comment.authorId || 'Unknown',
          text: comment.body,
          timestamp: new Date(comment.createdAt),
        }));
        setComments(commentsData);
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [issue.id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await addComment(issue.id, newComment);
      setNewComment('');
      // Reload comments
      const response = await commentsAPI.getByIssue(issue.id);
      const commentsData = response.data.map(comment => ({
        ...comment,
        id: comment._id,
        author: comment.authorId?.name || comment.authorId || 'Unknown',
        text: comment.body,
        timestamp: new Date(comment.createdAt),
      }));
      setComments(commentsData);
    } catch (error) {
      // Error already handled in addComment
    }
  };

  const handleSubmitReply = async (parentId, e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      // Replies are just regular comments for now
      await addComment(issue.id, replyText);
      setReplyText('');
      setReplyingTo(null);
      // Reload comments
      const response = await commentsAPI.getByIssue(issue.id);
      const commentsData = response.data.map(comment => ({
        ...comment,
        id: comment._id,
        author: comment.authorId?.name || comment.authorId || 'Unknown',
        text: comment.body,
        timestamp: new Date(comment.createdAt),
      }));
      setComments(commentsData);
    } catch (error) {
      // Error already handled in addComment
    }
  };

  const rootComments = comments.filter((c) => !c.parentId);
  const getReplies = (commentId) => comments.filter((c) => c.parentId === commentId);

  return (
    <div className="ranger-card p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-ranger-blue/20 rounded-full">
            <FiUser className="text-ranger-blue" />
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="ranger-input min-h-24 resize-y"
              placeholder="Add a comment..."
            />
            <div className="flex items-center justify-end mt-2">
              <button
                type="submit"
                className="ranger-button bg-morphin-time hover:bg-purple-600 text-white flex items-center space-x-2"
              >
                <FiSend />
                <span>Post Comment</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading comments...</p>
        ) : rootComments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          rootComments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              replies={getReplies(comment.id)}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmitReply={handleSubmitReply}
            />
          ))
        )}
      </div>
    </div>
  );
};

const CommentThread = ({
  comment,
  replies,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  onSubmitReply,
}) => {
  const { user } = useAuth();

  return (
    <div className="border-l-2 border-gray-700 pl-4">
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-ranger-blue/20 rounded-full">
              <FiUser className="text-ranger-blue text-sm" />
            </div>
            <div>
              <p className="font-semibold text-white">{comment.author}</p>
              <p className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
        <p className="text-gray-300 whitespace-pre-wrap">{comment.text}</p>
        <button
          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
          className="mt-3 text-sm text-ranger-blue hover:underline"
        >
          {replyingTo === comment.id ? 'Cancel' : 'Reply'}
        </button>
      </div>

      {/* Reply Form */}
      {replyingTo === comment.id && (
        <form
          onSubmit={(e) => onSubmitReply(comment.id, e)}
          className="mt-3 ml-4 flex items-start space-x-3"
        >
          <div className="p-1.5 bg-ranger-green/20 rounded-full">
            <FiUser className="text-ranger-green text-sm" />
          </div>
          <div className="flex-1">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="ranger-input min-h-20 resize-y"
              placeholder="Write a reply..."
            />
            <div className="flex items-center justify-end mt-2 space-x-2">
              <button
                type="button"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText('');
                }}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ranger-button bg-ranger-green hover:bg-green-600 text-white text-sm px-4 py-2"
              >
                Reply
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="mt-3 ml-4 space-y-3">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-gray-800/30 rounded-lg p-3 border-l-2 border-ranger-green/50">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1 bg-ranger-green/20 rounded-full">
                  <FiUser className="text-ranger-green text-xs" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{reply.author}</p>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{reply.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSystem;
