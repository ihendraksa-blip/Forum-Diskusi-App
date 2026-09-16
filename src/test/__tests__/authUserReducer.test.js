import { describe, it, expect } from 'vitest';
import authUserReducer, { setAuthUser, unsetAuthUser } from '../../states/authUser/slice';

describe('authUser Reducer', () => {
  const initialState = null;

  it('should return initial state', () => {
    expect(authUserReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setAuthUser', () => {
    const mockUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
    };

    const action = setAuthUser(mockUser);
    const newState = authUserReducer(initialState, action);

    expect(newState).toEqual(mockUser);
  });

  it('should handle unsetAuthUser', () => {
    const mockUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    const stateWithUser = authUserReducer(initialState, setAuthUser(mockUser));
    const action = unsetAuthUser();
    const newState = authUserReducer(stateWithUser, action);

    expect(newState).toEqual(null);
  });

  it('should update authUser with new user data', () => {
    const firstUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    const secondUser = {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
    };

    const stateWithFirstUser = authUserReducer(initialState, setAuthUser(firstUser));
    const newState = authUserReducer(stateWithFirstUser, setAuthUser(secondUser));

    expect(newState).toEqual(secondUser);
    expect(newState).not.toEqual(firstUser);
  });

  it('should handle user with complete profile data', () => {
    const completeUser = {
      id: 'user-3',
      name: 'Complete User',
      email: 'complete@example.com',
      avatar: 'https://example.com/avatar.jpg',
    };

    const action = setAuthUser(completeUser);
    const newState = authUserReducer(initialState, action);

    expect(newState).toHaveProperty('id', 'user-3');
    expect(newState).toHaveProperty('name', 'Complete User');
    expect(newState).toHaveProperty('email', 'complete@example.com');
    expect(newState).toHaveProperty('avatar', 'https://example.com/avatar.jpg');
  });

  it('should handle user with minimal data', () => {
    const minimalUser = {
      id: 'user-4',
      name: 'Minimal User',
      email: 'minimal@example.com',
    };

    const action = setAuthUser(minimalUser);
    const newState = authUserReducer(initialState, action);

    expect(newState).toEqual(minimalUser);
    expect(newState).not.toHaveProperty('avatar');
  });
});
