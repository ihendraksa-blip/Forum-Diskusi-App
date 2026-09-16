import api from '../../utils/api/api';
import {
  receiveThreads,
  addThread,
  upVoteThread,
  downVoteThread,
  neutralizeThreadVote,
} from './slice';

const asyncReceiveThreads = () => {
  return async (dispatch) => {
    try {
      const threads = await api.getAllThreads();
      dispatch(receiveThreads(threads.data.threads));
    } catch (error) {
      alert(error.message);
    }
  };
};

const asyncAddThread = ({ title, body, category }) => {
  return async (dispatch) => {
    try {
      const thread = await api.createThread({ title, body, category });
      dispatch(addThread(thread.data.thread));
    } catch (error) {
      alert(error.message);
      throw error;
    }
  };
};

const asyncUpVoteThread = (threadId) => {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    if (!authUser) return;

    try {
      dispatch(upVoteThread({ threadId, userId: authUser.id }));
      await api.upVoteThread(threadId);
    } catch (error) {
      alert(error.message);
      dispatch(neutralizeThreadVote({ threadId, userId: authUser.id }));
    }
  };
};

const asyncDownVoteThread = (threadId) => {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    if (!authUser) return;

    try {
      dispatch(downVoteThread({ threadId, userId: authUser.id }));
      await api.downVoteThread(threadId);
    } catch (error) {
      alert(error.message);
      dispatch(neutralizeThreadVote({ threadId, userId: authUser.id }));
    }
  };
};

const asyncNeutralizeThreadVote = (threadId) => {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    if (!authUser) return;

    try {
      dispatch(neutralizeThreadVote({ threadId, userId: authUser.id }));
      await api.neutralizeThreadVote(threadId);
    } catch (error) {
      alert(error.message);
    }
  };
};

export {
  asyncReceiveThreads,
  asyncAddThread,
  asyncUpVoteThread,
  asyncDownVoteThread,
  asyncNeutralizeThreadVote,
};
