import { createSlice } from '@reduxjs/toolkit';

const threadsSlice = createSlice({
  name: 'threads',
  initialState: [],
  reducers: {
    receiveThreads: (state, action) => action.payload,
    addThread: (state, action) => {
      state.push(action.payload);
    },
    upVoteThread: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.find((t) => t.id === threadId);
      if (thread) {
        if (!thread.upVotesBy.includes(userId)) {
          thread.upVotesBy.push(userId);
        }
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
      }
    },
    downVoteThread: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.find((t) => t.id === threadId);
      if (thread) {
        thread.downVotesBy.push(userId);
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
      }
    },
    neutralizeThreadVote: (state, action) => {
      const { threadId, userId } = action.payload;
      const thread = state.find((t) => t.id === threadId);
      if (thread) {
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
      }
    },
  },
});

export const {
  receiveThreads,
  addThread,
  upVoteThread,
  downVoteThread,
  neutralizeThreadVote,
} = threadsSlice.actions;
export default threadsSlice.reducer;
