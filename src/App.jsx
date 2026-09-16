import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import store from './states/store';
import LoadingBar from './components/LoadingBar';
import Loading from './components/Loading';
import Navigation from './components/Navigation';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { asyncPreloadProcess } from './states/shared/action';
import { useDispatch } from 'react-redux';

// Lazy load components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DetailPage = lazy(() => import('./pages/DetailPage'));
const CreateThreadPage = lazy(() => import('./pages/CreateThreadPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));

function AppContent() {
  const isPreload = useSelector((state) => state.isPreload);
  const authUser = useSelector((state) => state.authUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  if (isPreload) {
    return <Loading />;
  }

  return (
    <>
      <LoadingBar />
      <Navigation />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/thread/:id" element={<DetailPage />} />
          <Route path="/create-thread" element={<CreateThreadPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
