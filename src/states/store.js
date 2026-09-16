import { configureStore } from '@reduxjs/toolkit';
import { loadingBarReducer } from 'react-redux-loading-bar';
import authUserReducer from './authUser/slice';
import isPreloadReducer from './isPreload/slice';
import usersReducer from './users/slice';
import threadsReducer from './threads/slice';
import detailThreadReducer from './detailThread/slice';
import leaderboardsReducer from './leaderboards/slice';

const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    isPreload: isPreloadReducer,
    users: usersReducer,
    threads: threadsReducer,
    detailThread: detailThreadReducer,
    leaderboards: leaderboardsReducer,
    loadingBar: loadingBarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
