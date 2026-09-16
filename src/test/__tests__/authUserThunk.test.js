import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { asyncSetAuthUser, asyncUnsetAuthUser, asyncRestoreAuthUser } from '../../states/authUser/action';
import authUserReducer from '../../states/authUser/slice';

// Mock the API module
vi.mock('../../utils/api/api', () => ({
  default: {
    login: vi.fn(),
    getAllUsers: vi.fn(),
    setToken: vi.fn(),
    getToken: vi.fn(),
    removeToken: vi.fn(),
    getOwnProfile: vi.fn(),
  },
}));

import api from '../../utils/api/api';

describe('authUser Thunk Actions', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        authUser: authUserReducer,
      },
    });
    vi.clearAllMocks();
  });

  describe('asyncSetAuthUser', () => {
    it('should set authUser when login is successful', async () => {
      const mockCredentials = { email: 'test@example.com', password: 'password123' };
      const mockToken = 'mock-token-123';
      const mockUsers = [
        {
          id: 'user-1',
          name: 'Test User',
          email: 'test@example.com',
          avatar: 'https://example.com/avatar.jpg',
        },
      ];

      api.login.mockResolvedValue({
        data: { token: mockToken },
      });
      api.getAllUsers.mockResolvedValue({
        data: { users: mockUsers },
      });

      await store.dispatch(asyncSetAuthUser(mockCredentials));

      const state = store.getState();
      expect(state.authUser).toEqual(mockUsers[0]);
      expect(api.setToken).toHaveBeenCalledWith(mockToken);
      expect(api.login).toHaveBeenCalledWith(mockCredentials);
    });

    it('should handle login failure', async () => {
      const mockCredentials = { email: 'test@example.com', password: 'wrongpassword' };
      const errorMessage = 'Invalid credentials';

      api.login.mockRejectedValue(new Error(errorMessage));
      global.alert = vi.fn();

      await expect(store.dispatch(asyncSetAuthUser(mockCredentials))).rejects.toThrow(errorMessage);
      expect(global.alert).toHaveBeenCalledWith(errorMessage);
    });

    it('should throw error when user not found in users list', async () => {
      const mockCredentials = { email: 'notfound@example.com', password: 'password123' };
      const mockToken = 'mock-token-123';
      const mockUsers = [
        {
          id: 'user-1',
          name: 'Different User',
          email: 'different@example.com',
        },
      ];

      api.login.mockResolvedValue({
        data: { token: mockToken },
      });
      api.getAllUsers.mockResolvedValue({
        data: { users: mockUsers },
      });
      global.alert = vi.fn();

      await expect(store.dispatch(asyncSetAuthUser(mockCredentials))).rejects.toThrow('User not found');
    });

    it('should handle empty users list response', async () => {
      const mockCredentials = { email: 'test@example.com', password: 'password123' };
      const mockToken = 'mock-token-123';

      api.login.mockResolvedValue({
        data: { token: mockToken },
      });
      api.getAllUsers.mockResolvedValue({
        data: { users: [] },
      });
      global.alert = vi.fn();

      await expect(store.dispatch(asyncSetAuthUser(mockCredentials))).rejects.toThrow('User not found');
    });
  });

  describe('asyncUnsetAuthUser', () => {
    it('should unset authUser and remove token', () => {
      const mockUser = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      };

      store.dispatch({ type: 'authUser/setAuthUser', payload: mockUser });
      expect(store.getState().authUser).toEqual(mockUser);

      store.dispatch(asyncUnsetAuthUser());

      expect(store.getState().authUser).toBeNull();
      expect(api.removeToken).toHaveBeenCalled();
    });

    it('should handle unsetting when no user is logged in', () => {
      expect(store.getState().authUser).toBeNull();

      store.dispatch(asyncUnsetAuthUser());

      expect(store.getState().authUser).toBeNull();
      expect(api.removeToken).toHaveBeenCalled();
    });
  });

  describe('asyncRestoreAuthUser', () => {
    it('should restore authUser when token exists and API call succeeds', async () => {
      const mockToken = 'existing-token-123';
      const mockUser = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        avatar: 'https://example.com/avatar.jpg',
      };

      api.getToken.mockReturnValue(mockToken);
      api.getOwnProfile.mockResolvedValue({
        data: { user: mockUser },
      });

      await store.dispatch(asyncRestoreAuthUser());

      const state = store.getState();
      expect(state.authUser).toEqual(mockUser);
      expect(api.getToken).toHaveBeenCalled();
      expect(api.getOwnProfile).toHaveBeenCalled();
    });

    it('should unset authUser when token does not exist', async () => {
      api.getToken.mockReturnValue(null);

      await store.dispatch(asyncRestoreAuthUser());

      const state = store.getState();
      expect(state.authUser).toBeNull();
      expect(api.getOwnProfile).not.toHaveBeenCalled();
    });

    it('should unset authUser and remove token when API call fails', async () => {
      const mockToken = 'invalid-token-123';
      const errorMessage = 'Invalid token';

      api.getToken.mockReturnValue(mockToken);
      api.getOwnProfile.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(asyncRestoreAuthUser());

      const state = store.getState();
      expect(state.authUser).toBeNull();
      expect(api.removeToken).toHaveBeenCalled();
    });

    it('should handle network errors during restore', async () => {
      const mockToken = 'existing-token-123';

      api.getToken.mockReturnValue(mockToken);
      api.getOwnProfile.mockRejectedValue(new Error('Network error'));

      await store.dispatch(asyncRestoreAuthUser());

      const state = store.getState();
      expect(state.authUser).toBeNull();
      expect(api.removeToken).toHaveBeenCalled();
    });
  });
});
