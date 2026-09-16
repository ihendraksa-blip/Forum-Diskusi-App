import { asyncReceiveUsers } from '../users/action';
import { asyncReceiveThreads } from '../threads/action';
import { asyncReceiveLeaderboards } from '../leaderboards/action';
import { setIsPreload } from '../isPreload/slice';
import { asyncRestoreAuthUser } from '../authUser/action';

const asyncPreloadProcess = () => {
  return async (dispatch) => {
    try {
      await dispatch(asyncRestoreAuthUser());
      await Promise.all([
        dispatch(asyncReceiveUsers()),
        dispatch(asyncReceiveThreads()),
        dispatch(asyncReceiveLeaderboards()),
      ]);
    } catch (error) {
      alert(error.message);
    } finally {
      dispatch(setIsPreload(false));
    }
  };
};

export { asyncPreloadProcess };
