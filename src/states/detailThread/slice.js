import { createSlice } from '@reduxjs/toolkit';

const detailThreadSlice = createSlice({
  name: 'detailThread',
  initialState: null,
  reducers: {
    receiveDetailThread: (state, action) => action.payload,
    clearDetailThread: () => null,
    addComment: (state, action) => {
      if (state) {
        state.comments.push(action.payload);
      }
    },
    upVoteComment: (state, action) => {
      const { commentId, userId } = action.payload;
      if (state) {
        const comment = state.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.upVotesBy.push(userId);
          comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
        }
      }
    },
    downVoteComment: (state, action) => {
      const { commentId, userId } = action.payload;
      if (state) {
        const comment = state.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.downVotesBy.push(userId);
          comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
        }
      }
    },
    neutralizeCommentVote: (state, action) => {
      const { commentId, userId } = action.payload;
      if (state) {
        const comment = state.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
          comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
        }
      }
    },
  },
});

export const {
  receiveDetailThread,
  clearDetailThread,
  addComment,
  upVoteComment,
  downVoteComment,
  neutralizeCommentVote,
} = detailThreadSlice.actions;
export default detailThreadSlice.reducer;
