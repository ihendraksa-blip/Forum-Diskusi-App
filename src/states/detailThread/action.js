import api from '../../utils/api/api';
import {
  receiveDetailThread,
  addComment,
  upVoteComment,
  downVoteComment,
  neutralizeCommentVote,
} from './slice';

const asyncReceiveDetailThread = (threadId) => {
  return async (dispatch) => {
    try {
      const thread = await api.getThreadDetail(threadId);
      dispatch(receiveDetailThread(thread.data.detailThread));
    } catch (error) {
      alert(error.message);
    }
  };
};

const asyncAddComment = (threadId, content) => {
  return async (dispatch) => {
    try {
      const comment = await api.createComment(threadId, content);
      dispatch(addComment(comment.data.comment));
    } catch (error) {
      alert(error.message);
      throw error;
    }
  };
};

const asyncUpVoteComment = (threadId, commentId) => {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    if (!authUser) return;

    try {
      dispatch(upVoteComment({ commentId, userId: authUser.id }));
      await api.upVoteComment(threadId, commentId);
    } catch (error) {
      alert(error.message);
      dispatch(neutralizeCommentVote({ commentId, userId: authUser.id }));
    }
  };
};

const asyncDownVoteComment = (threadId, commentId) => {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    if (!authUser) return;

    try {
      dispatch(downVoteComment({ commentId, userId: authUser.id }));
      await api.downVoteComment(threadId, commentId);
    } catch (error) {
      alert(error.message);
      dispatch(neutralizeCommentVote({ commentId, userId: authUser.id }));
    }
  };
};

const asyncNeutralizeCommentVote = (threadId, commentId) => {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    if (!authUser) return;

    try {
      dispatch(neutralizeCommentVote({ commentId, userId: authUser.id }));
      await api.neutralizeCommentVote(threadId, commentId);
    } catch (error) {
      alert(error.message);
    }
  };
};

export {
  asyncReceiveDetailThread,
  asyncAddComment,
  asyncUpVoteComment,
  asyncDownVoteComment,
  asyncNeutralizeCommentVote,
};
