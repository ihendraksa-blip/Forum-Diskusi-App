import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
  asyncReceiveThreads,
  asyncAddThread,
  asyncUpVoteThread,
  asyncDownVoteThread,
} from '../../states/threads/action';
import threadsReducer from '../../states/threads/slice';
import authUserReducer from '../../states/authUser/slice';

// Mock the API module
vi.mock('../../utils/api/api', () => ({
  default: {
    getAllThreads: vi.fn(),
    createThread: vi.fn(),
    upVoteThread: vi.fn(),
    downVoteThread: vi.fn(),
    neutralizeThreadVote: vi.fn(),
  },
}));

import api from '../../utils/api/api';

describe('threads Thunk Actions', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        threads: threadsReducer,
        authUser: authUserReducer,
      },
    });
    vi.clearAllMocks();
  });

  describe('asyncReceiveThreads', () => {
    it('should receive threads when API call is successful', async () => {
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

      api.getAllThreads.mockResolvedValue({
        data: { threads: mockThreads },
      });

      await store.dispatch(asyncReceiveThreads());

      const state = store.getState();
      expect(state.threads).toEqual(mockThreads);
      expect(state.threads).toHaveLength(2);
      expect(api.getAllThreads).toHaveBeenCalled();
    });

    it('should handle API failure gracefully', async () => {
      const errorMessage = 'Failed to fetch threads';
      api.getAllThreads.mockRejectedValue(new Error(errorMessage));
      global.alert = vi.fn();

      await store.dispatch(asyncReceiveThreads());

      expect(global.alert).toHaveBeenCalledWith(errorMessage);
      expect(store.getState().threads).toEqual([]);
    });
  });

  describe('asyncAddThread', () => {
    it('should add thread when API call is successful', async () => {
      const mockThreadData = {
        title: 'New Thread',
        body: 'New content',
        category: 'News',
      };

      const mockCreatedThread = {
        id: 'thread-3',
        title: 'New Thread',
        body: 'New content',
        category: 'News',
        ownerId: 'user-1',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
        createdAt: '2023-01-03T00:00:00.000Z',
      };

      api.createThread.mockResolvedValue({
        data: { thread: mockCreatedThread },
      });

      await store.dispatch(asyncAddThread(mockThreadData));

      const state = store.getState();
      expect(state.threads).toHaveLength(1);
      expect(state.threads[0]).toEqual(mockCreatedThread);
      expect(api.createThread).toHaveBeenCalledWith(mockThreadData);
    });

    it('should handle API failure when adding thread', async () => {
      const mockThreadData = {
        title: 'New Thread',
        body: 'New content',
        category: 'News',
      };

      const errorMessage = 'Failed to create thread';
      api.createThread.mockRejectedValue(new Error(errorMessage));
      global.alert = vi.fn();

      await expect(store.dispatch(asyncAddThread(mockThreadData))).rejects.toThrow(errorMessage);
      expect(global.alert).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('asyncUpVoteThread', () => {
    it('should upvote thread when user is authenticated', async () => {
      const mockUser = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      };

      const mockThread = {
        id: 'thread-1',
        title: 'Test Thread',
        body: 'Test content',
        category: 'General',
        ownerId: 'user-2',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
        createdAt: '2023-01-01T00:00:00.000Z',
      };

      store.dispatch({ type: 'authUser/setAuthUser', payload: mockUser });
      store.dispatch({ type: 'threads/receiveThreads', payload: [mockThread] });

      api.upVoteThread.mockResolvedValue({});

      await store.dispatch(asyncUpVoteThread('thread-1'));

      const state = store.getState();
      expect(state.threads[0].upVotesBy).toContain('user-1');
      expect(api.upVoteThread).toHaveBeenCalledWith('thread-1');
    });

    it('should not upvote when user is not authenticated', async () => {
      const mockThread = {
        id: 'thread-1',
        title: 'Test Thread',
        body: 'Test content',
        category: 'General',
        ownerId: 'user-2',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
        createdAt: '2023-01-01T00:00:00.000Z',
      };

      store.dispatch({ type: 'threads/receiveThreads', payload: [mockThread] });

      await store.dispatch(asyncUpVoteThread('thread-1'));

      const state = store.getState();
      expect(state.threads[0].upVotesBy).not.toContain('user-1');
      expect(api.upVoteThread).not.toHaveBeenCalled();
    });
  });

  describe('asyncDownVoteThread', () => {
    it('should downvote thread when user is authenticated', async () => {
      const mockUser = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      };

      const mockThread = {
        id: 'thread-1',
        title: 'Test Thread',
        body: 'Test content',
        category: 'General',
        ownerId: 'user-2',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
        createdAt: '2023-01-01T00:00:00.000Z',
      };

      store.dispatch({ type: 'authUser/setAuthUser', payload: mockUser });
      store.dispatch({ type: 'threads/receiveThreads', payload: [mockThread] });

      api.downVoteThread.mockResolvedValue({});

      await store.dispatch(asyncDownVoteThread('thread-1'));

      const state = store.getState();
      expect(state.threads[0].downVotesBy).toContain('user-1');
      expect(api.downVoteThread).toHaveBeenCalledWith('thread-1');
    });

    it('should handle API failure and neutralize vote', async () => {
      const mockUser = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      };

      const mockThread = {
        id: 'thread-1',
        title: 'Test Thread',
        body: 'Test content',
        category: 'General',
        ownerId: 'user-2',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
        createdAt: '2023-01-01T00:00:00.000Z',
      };

      store.dispatch({ type: 'authUser/setAuthUser', payload: mockUser });
      store.dispatch({ type: 'threads/receiveThreads', payload: [mockThread] });

      const errorMessage = 'Failed to downvote';
      api.downVoteThread.mockRejectedValue(new Error(errorMessage));
      global.alert = vi.fn();

      await store.dispatch(asyncDownVoteThread('thread-1'));

      expect(global.alert).toHaveBeenCalledWith(errorMessage);
      const state = store.getState();
      expect(state.threads[0].downVotesBy).not.toContain('user-1');
    });
  });
});
