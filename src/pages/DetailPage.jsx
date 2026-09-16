import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { asyncReceiveDetailThread } from '../states/detailThread/action';
import { clearDetailThread } from '../states/detailThread/slice';
import {
  asyncUpVoteThread,
  asyncDownVoteThread,
  asyncNeutralizeThreadVote,
} from '../states/threads/action';
import {
  asyncAddComment,
  asyncUpVoteComment,
  asyncDownVoteComment,
  asyncNeutralizeCommentVote,
} from '../states/detailThread/action';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const detailThread = useSelector((state) => state.detailThread);
  const authUser = useSelector((state) => state.authUser);
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(asyncReceiveDetailThread(id));

    return () => {
      dispatch(clearDetailThread());
    };
  }, [id, dispatch]);

  const handleVote = (voteType) => {
    if (!authUser) {
      alert('Please login to vote');
      return;
    }

    const hasUpVoted = detailThread.upVotesBy.includes(authUser.id);
    const hasDownVoted = detailThread.downVotesBy.includes(authUser.id);

    if (voteType === 'up') {
      if (hasUpVoted) {
        dispatch(asyncNeutralizeThreadVote(id));
      } else {
        dispatch(asyncUpVoteThread(id));
      }
    } else if (voteType === 'down') {
      if (hasDownVoted) {
        dispatch(asyncNeutralizeThreadVote(id));
      } else {
        dispatch(asyncDownVoteThread(id));
      }
    }
  };

  const handleCommentVote = (commentId, voteType) => {
    if (!authUser) {
      alert('Please login to vote');
      return;
    }

    const comment = detailThread.comments.find((c) => c.id === commentId);
    const hasUpVoted = comment.upVotesBy.includes(authUser.id);
    const hasDownVoted = comment.downVotesBy.includes(authUser.id);

    if (voteType === 'up') {
      if (hasUpVoted) {
        dispatch(asyncNeutralizeCommentVote(id, commentId));
      } else {
        dispatch(asyncUpVoteComment(id, commentId));
      }
    } else if (voteType === 'down') {
      if (hasDownVoted) {
        dispatch(asyncNeutralizeCommentVote(id, commentId));
      } else {
        dispatch(asyncDownVoteComment(id, commentId));
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!authUser) {
      alert('Please login to comment');
      return;
    }

    try {
      await dispatch(asyncAddComment(id, comment));
      setComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (!detailThread) {
    return <div className="loading">Loading...</div>;
  }

  const threadOwner = detailThread.owner;
  const hasUpVoted = detailThread.upVotesBy.includes(authUser?.id);
  const hasDownVoted = detailThread.downVotesBy.includes(authUser?.id);

  return (
    <div className="detail-container">
      <Link to="/" className="back-button">
        ← Back to Threads
      </Link>

      <div className="thread-detail">
        <div className="thread-header">
          <div className="thread-category">{detailThread.category}</div>
          <div className="thread-author-info">
            <div className="thread-author-avatar">
              {threadOwner?.avatar ? (
                <img src={threadOwner.avatar} alt={threadOwner.name} />
              ) : (
                <div className="avatar-placeholder">
                  {threadOwner?.name?.charAt(0) || '?'}
                </div>
              )}
            </div>
            <div className="thread-author-details">
              <div className="thread-author">
                Posted by {threadOwner?.name || 'Unknown'}
              </div>
              <div className="thread-date">
                {new Date(detailThread.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <h1 className="thread-title">{detailThread.title}</h1>
        <p className="thread-body">{detailThread.body}</p>

        <div className="thread-footer">
          <div className="thread-votes">
            <button
              onClick={() => handleVote('up')}
              className={`vote-button ${hasUpVoted ? 'active' : ''}`}
              aria-label="Upvote"
            >
              ▲
            </button>
            <span className="vote-count">
              {detailThread.upVotesBy.length - detailThread.downVotesBy.length}
            </span>
            <button
              onClick={() => handleVote('down')}
              className={`vote-button ${hasDownVoted ? 'active' : ''}`}
              aria-label="Downvote"
            >
              ▼
            </button>
          </div>
        </div>
      </div>

      <div className="comments-section">
        <h2>Comments ({detailThread.comments.length})</h2>

        {authUser && (
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              required
              rows={3}
            />
            <button type="submit" className="submit-comment-button">
              Submit Comment
            </button>
          </form>
        )}

        <div className="comments-list">
          {detailThread.comments.map((comment) => {
            const commentOwner = comment.owner;
            const hasUpVoted = comment.upVotesBy.includes(authUser?.id);
            const hasDownVoted = comment.downVotesBy.includes(authUser?.id);

            return (
              <div key={comment.id} className="comment-card">
                <div className="comment-header">
                  <div className="comment-author-avatar">
                    {commentOwner?.avatar ? (
                      <img src={commentOwner.avatar} alt={commentOwner.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {commentOwner?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="comment-author-details">
                    <div className="comment-author">
                      {commentOwner?.name || 'Unknown'}
                    </div>
                    <div className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <p className="comment-content">{comment.content}</p>
                <div className="comment-votes">
                  <button
                    onClick={() => handleCommentVote(comment.id, 'up')}
                    className={`vote-button ${hasUpVoted ? 'active' : ''}`}
                    aria-label="Upvote comment"
                  >
                    ▲
                  </button>
                  <span className="vote-count">
                    {comment.upVotesBy.length - comment.downVotesBy.length}
                  </span>
                  <button
                    onClick={() => handleCommentVote(comment.id, 'down')}
                    className={`vote-button ${hasDownVoted ? 'active' : ''}`}
                    aria-label="Downvote comment"
                  >
                    ▼
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
