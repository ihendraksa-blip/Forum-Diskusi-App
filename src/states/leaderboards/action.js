import api from '../../utils/api/api';
import { receiveLeaderboards } from './slice';

const asyncReceiveLeaderboards = () => {
  return async (dispatch) => {
    try {
      const leaderboards = await api.getLeaderboards();
      dispatch(receiveLeaderboards(leaderboards.data.leaderboards));
    } catch (error) {
      alert(error.message);
    }
  };
};

export { asyncReceiveLeaderboards };
