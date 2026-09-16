import { describe, it, expect } from 'vitest';
import detailThreadReducer, {
  receiveDetailThread,
  clearDetailThread,
  addComment,
  upVoteComment,
  downVoteComment,
  neutralizeCommentVote,
} from '../../states/detailThread/slice';

describe('detailThread Reducer', () => {
  const initialState = null;

  it('should return initial state', () => {
    expect(detailThreadReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle receiveDetailThread', () => {
    const mockThread = {
      id: 'thread-1',
      title: 'Test Thread',
      body: 'Test content',
      category: 'General',
      ownerId: 'user-1',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 2,
      createdAt: '2023-01-01T00:00:00.000Z',
      owner: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        avatar: 'https://example.com/avatar.jpg',
      },
      comments: [
        {
          id: 'comment-1',
          content: 'First comment',
          createdAt: '2023-01-01T01:00:00.000Z',
          ownerId: 'user-2',
          upVotesBy: [],
          downVotesBy: [],
          owner: {
            id: 'user-2',
            name: 'Commenter',
            email: 'commenter@example.com',
          },
        },
      ],
    };

    const action = receiveDetailThread(mockThread);
    const newState = detailThreadReducer(initialState, action);

    expect(newState).toEqual(mockThread);
    expect(newState).toHaveProperty('id', 'thread-1');
    expect(newState.comments).toHaveLength(1);
  });

  it('should handle clearDetailThread', () => {
    const mockThread = {
      id: 'thread-1',
      title: 'Test Thread',
      body: 'Test content',
      category: 'General',
      ownerId: 'user-1',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 0,
      createdAt: '2023-01-01T00:00:00.000Z',
      owner: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
      comments: [],
    };

    const stateWithThread = detailThreadReducer(initialState, receiveDetailThread(mockThread));
    const action = clearDetailThread();
    const newState = detailThreadReducer(stateWithThread, action);

    expect(newState).toEqual(null);
  });

  it('should handle addComment', () => {
    const mockThread = {
      id: 'thread-1',
      title: 'Test Thread',
      body: 'Test content',
      category: 'General',
      ownerId: 'user-1',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 0,
      createdAt: '2023-01-01T00:00:00.000Z',
      owner: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
      comments: [],
    };

    const newComment = {
      id: 'comment-1',
      content: 'New comment',
      createdAt: '2023-01-01T01:00:00.000Z',
      ownerId: 'user-2',
      upVotesBy: [],
      downVotesBy: [],
      owner: {
        id: 'user-2',
        name: 'Commenter',
        email: 'commenter@example.com',
      },
    };

    const stateWithThread = detailThreadReducer(initialState, receiveDetailThread(mockThread));
    const action = addComment(newComment);
    const newState = detailThreadReducer(stateWithThread, action);

    expect(newState.comments).toHaveLength(1);
    expect(newState.comments[0]).toEqual(newComment);
  });

  it('should handle upVoteComment', () => {
    const mockThread = {
      id: 'thread-1',
      title: 'Test Thread',
      body: 'Test content',
      category: 'General',
      ownerId: 'user-1',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 1,
      createdAt: '2023-01-01T00:00:00.000Z',
      owner: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
      comments: [
        {
          id: 'comment-1',
          content: 'Test comment',
          createdAt: '2023-01-01T01:00:00.000Z',
          ownerId: 'user-2',
          upVotesBy: [],
          downVotesBy: [],
          owner: {
            id: 'user-2',
            name: 'Commenter',
            email: 'commenter@example.com',
          },
        },
      ],
    };

    const stateWithThread = detailThreadReducer(initialState, receiveDetailThread(mockThread));
    const action = upVoteComment({ commentId: 'comment-1', userId: 'user-3' });
    const newState = detailThreadReducer(stateWithThread, action);

    expect(newState.comments[0].upVotesBy).toContain('user-3');
    expect(newState.comments[0].downVotesBy).not.toContain('user-3');
  });

  it('should handle downVoteComment', () => {
    const mockThread = {
      id: 'thread-1',
      title: 'Test Thread',
      body: 'Test content',
      category: 'General',
      ownerId: 'user-1',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 1,
      createdAt: '2023-01-01T00:00:00.000Z',
      owner: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
      comments: [
        {
          id: 'comment-1',
          content: 'Test comment',
          createdAt: '2023-01-01T01:00:00.000Z',
          ownerId: 'user-2',
          upVotesBy: [],
          downVotesBy: [],
          owner: {
            id: 'user-2',
            name: 'Commenter',
            email: 'commenter@example.com',
          },
        },
      ],
    };

    const stateWithThread = detailThreadReducer(initialState, receiveDetailThread(mockThread));
    const action = downVoteComment({ commentId: 'comment-1', userId: 'user-3' });
    const newState = detailThreadReducer(stateWithThread, action);

    expect(newState.comments[0].downVotesBy).toContain('user-3');
    expect(newState.comments[0].upVotesBy).not.toContain('user-3');
  });

  it('should handle neutralizeCommentVote', () => {
    const mockThread = {
      id: 'thread-1',
      title: 'Test Thread',
      body: 'Test content',
      category: 'General',
      ownerId: 'user-1',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 1,
      createdAt: '2023-01-01T00:00:00.000Z',
      owner: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
      comments: [
        {
          id: 'comment-1',
          content: 'Test comment',
          createdAt: '2023-01-01T01:00:00.000Z',
          ownerId: 'user-2',
          upVotesBy: ['user-3'],
          downVotesBy: [],
          owner: {
            id: 'user-2',
            name: 'Commenter',
            email: 'commenter@example.com',
          },
        },
      ],
    };

    const stateWithThread = detailThreadReducer(initialState, receiveDetailThread(mockThread));
    const action = neutralizeCommentVote({ commentId: 'comment-1', userId: 'user-3' });
    const newState = detailThreadReducer(stateWithThread, action);

    expect(newState.comments[0].upVotesBy).not.toContain('user-3');
    expect(newState.comments[0].downVotesBy).not.toContain('user-3');
  });
});
