import api from '../../utils/api/api';
import { setAuthUser, unsetAuthUser } from './slice';

const asyncSetAuthUser = ({ email, password }) => {
  return async (dispatch) => {
    try {
      const tokenResponse = await api.login({ email, password });
      const token = tokenResponse.data.token;
      api.setToken(token);

      const usersResponse = await api.getAllUsers();
      const users = usersResponse.data.users;
      const authUser = users.find((u) => u.email === email);

      if (authUser) {
        dispatch(setAuthUser(authUser));
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      alert(error.message);
      throw error;
    }
  };
};

const asyncUnsetAuthUser = () => {
  return (dispatch) => {
    dispatch(unsetAuthUser());
    api.removeToken();
  };
};

const asyncRestoreAuthUser = () => {
  return async (dispatch) => {
    try {
      const token = api.getToken();
      if (!token) {
        dispatch(unsetAuthUser());
        return;
      }

      const profileResponse = await api.getOwnProfile();
      const authUser = profileResponse.data.user;
      dispatch(setAuthUser(authUser));
    } catch {
      dispatch(unsetAuthUser());
      api.removeToken();
    }
  };
};

export { asyncSetAuthUser, asyncUnsetAuthUser, asyncRestoreAuthUser };
