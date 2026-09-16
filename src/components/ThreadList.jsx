import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  asyncUpVoteThread,
  asyncDownVoteThread,
  asyncNeutralizeThreadVote,
} from '../states/threads/action';

const ThreadList = ({ threads, authUser, getUserById, onThreadClick }) => {
  const dispatch = useDispatch();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const handleVote = (threadId, voteType) => {
    if (!authUser) {
      alert('Please login to vote');
      return;
    }

    const thread = threads.find((t) => t.id === threadId);
    const hasUpVoted = thread.upVotesBy.includes(authUser.id);
    const hasDownVoted = thread.downVotesBy.includes(authUser.id);

    if (voteType === 'up') {
      if (hasUpVoted) {
        dispatch(asyncNeutralizeThreadVote(threadId));
      } else {
        dispatch(asyncUpVoteThread(threadId));
      }
    } else if (voteType === 'down') {
      if (hasDownVoted) {
        dispatch(asyncNeutralizeThreadVote(threadId));
      } else {
        dispatch(asyncDownVoteThread(threadId));
      }
    }
  };

  return (
    <motion.div
      className="thread-list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {threads.length === 0 ? (
        <p className="no-threads">No threads found</p>
      ) : (
        threads.map((thread) => {
          const user = getUserById(thread.ownerId);
          const hasUpVoted = thread.upVotesBy.includes(authUser?.id);
          const hasDownVoted = thread.downVotesBy.includes(authUser?.id);

          return (
            <motion.div
              key={thread.id}
              className="thread-card"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="thread-header">
                <div className="thread-category">{thread.category}</div>
                <div className="thread-author">
                  Posted by {user?.name || 'Unknown'}
                </div>
                <div className="thread-date">
                  {new Date(thread.createdAt).toLocaleDateString()}
                </div>
              </div>
              <h3
                className="thread-title"
                onClick={() => onThreadClick(thread.id)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onThreadClick(thread.id);
                  }
                }}
              >
                {thread.title}
              </h3>
              <p className="thread-body">{thread.body}</p>
              <div className="thread-footer">
                <div className="thread-votes">
                  <motion.button
                    onClick={() => handleVote(thread.id, 'up')}
                    className={`vote-button ${hasUpVoted ? 'active' : ''}`}
                    aria-label="Upvote"
                    whileTap={{ scale: 0.9 }}
                  >
                    ▲
                  </motion.button>
                  <span className="vote-count">
                    {thread.upVotesBy.length - thread.downVotesBy.length}
                  </span>
                  <motion.button
                    onClick={() => handleVote(thread.id, 'down')}
                    className={`vote-button ${hasDownVoted ? 'active' : ''}`}
                    aria-label="Downvote"
                    whileTap={{ scale: 0.9 }}
                  >
                    ▼
                  </motion.button>
                </div>
                <div className="thread-comments">
                  💬 {thread.totalComments} comments
                </div>
              </div>
            </motion.div>
          );
        })
      )}
    </motion.div>
  );
};

export default ThreadList;
