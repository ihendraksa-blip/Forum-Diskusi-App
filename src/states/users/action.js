import api from '../../utils/api/api';
import { receiveUsers } from './slice';

const asyncReceiveUsers = () => {
  return async (dispatch) => {
    try {
      const users = await api.getAllUsers();
      dispatch(receiveUsers(users.data.users));
    } catch (error) {
      alert(error.message);
    }
  };
};

export { asyncReceiveUsers };
