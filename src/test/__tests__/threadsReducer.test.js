import { describe, it, expect } from 'vitest';
import threadsReducer, {
  receiveThreads,
  addThread,
  upVoteThread,
  downVoteThread,
  neutralizeThreadVote,
} from '../../states/threads/slice';

describe('threads Reducer', () => {
  const initialState = [];

  it('should return initial state', () => {
    expect(threadsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle receiveThreads', () => {
    const mockThreads = [
      {
        id: 'thread-1',
        title: 'First Thread',
        body: 'Thread content',
        category: 'General',
        ownerId: 'user-1',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
        createdAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: 'thread-2',
        title: 'Second Thread',
        body: 'Another content',
        category: 'Tech',
        ownerId: 'user-2',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 5,
        createdAt: '2023-01-02T00:00:00.000Z',
      },
    ];

    const action = receiveThreads(mockThreads);
    const newState = threadsReducer(initialState, action);

    expect(newState).toEqual(mockThreads);
    expect(newState).toHaveLength(2);
  });

  it('should handle addThread', () => {
    const newThread = {
      id: 'thread-3',
      title: 'New Thread',
      body: 'New content',
      category: 'News',
      ownerId: 'user-3',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 0,
      createdAt: '2023-01-03T00:00:00.000Z',
    };

    const action = addThread(newThread);
    const newState = threadsReducer(initialState, action);

    expect(newState).toHaveLength(1);
    expect(newState[0]).toEqual(newThread);
  });

  it('should handle upVoteThread', () => {
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
    };

    const stateWithThread = threadsReducer(initialState, receiveThreads([mockThread]));
    const action = upVoteThread({ threadId: 'thread-1', userId: 'user-2' });
    const newState = threadsReducer(stateWithThread, action);

    expect(newState[0].upVotesBy).toContain('user-2');
    expect(newState[0].downVotesBy).not.toContain('user-2');
  });

  it('should handle downVoteThread', () => {
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
    };

    const stateWithThread = threadsReducer(initialState, receiveThreads([mockThread]));
    const action = downVoteThread({ threadId: 'thread-1', userId: 'user-2' });
    const newState = threadsReducer(stateWithThread, action);

    expect(newState[0].downVotesBy).toContain('user-2');
    expect(newState[0].upVotesBy).not.toContain('user-2');
  });

  it('should handle neutralizeThreadVote', () => {
    const mockThread = {
      id: 'thread-1',
      title: 'Test Thread',
      body: 'Test content',
      category: 'General',
      ownerId: 'user-1',
      upVotesBy: ['user-2'],
      downVotesBy: [],
      totalComments: 0,
      createdAt: '2023-01-01T00:00:00.000Z',
    };

    const stateWithThread = threadsReducer(initialState, receiveThreads([mockThread]));
    const action = neutralizeThreadVote({ threadId: 'thread-1', userId: 'user-2' });
    const newState = threadsReducer(stateWithThread, action);

    expect(newState[0].upVotesBy).not.toContain('user-2');
    expect(newState[0].downVotesBy).not.toContain('user-2');
  });

  it('should handle multiple votes on same thread', () => {
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
    };

    const stateWithThread = threadsReducer(initialState, receiveThreads([mockThread]));

    // Multiple users upvote - chain the state updates
    const stateWithUser2 = threadsReducer(stateWithThread, upVoteThread({ threadId: 'thread-1', userId: 'user-2' }));
    const stateWithUser3 = threadsReducer(stateWithUser2, upVoteThread({ threadId: 'thread-1', userId: 'user-3' }));
    const stateWithUser4 = threadsReducer(stateWithUser3, upVoteThread({ threadId: 'thread-1', userId: 'user-4' }));
    const finalState = threadsReducer(stateWithUser4, upVoteThread({ threadId: 'thread-1', userId: 'user-5' }));

    expect(finalState[0].upVotesBy).toHaveLength(4);
    expect(finalState[0].upVotesBy).toContain('user-2');
    expect(finalState[0].upVotesBy).toContain('user-3');
    expect(finalState[0].upVotesBy).toContain('user-4');
    expect(finalState[0].upVotesBy).toContain('user-5');
  });

  it('should handle switching vote from up to down', () => {
    const mockThread = {
      id: 'thread-1',
      title: 'Test Thread',
      body: 'Test content',
      category: 'General',
      ownerId: 'user-1',
      upVotesBy: ['user-2'],
      downVotesBy: [],
      totalComments: 0,
      createdAt: '2023-01-01T00:00:00.000Z',
    };

    const stateWithThread = threadsReducer(initialState, receiveThreads([mockThread]));
    const stateWithUpVote = threadsReducer(stateWithThread, upVoteThread({ threadId: 'thread-1', userId: 'user-2' }));
    const stateWithDownVote = threadsReducer(stateWithUpVote, downVoteThread({ threadId: 'thread-1', userId: 'user-2' }));

    expect(stateWithDownVote[0].upVotesBy).not.toContain('user-2');
    expect(stateWithDownVote[0].downVotesBy).toContain('user-2');
  });
});
