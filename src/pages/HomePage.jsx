import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { asyncReceiveThreads } from '../states/threads/action';
import { asyncUnsetAuthUser } from '../states/authUser/action';
import ThreadList from '../components/ThreadList';
import ThreadFilter from '../components/ThreadFilter';

const HomePage = () => {
  const [filter, setFilter] = useState('');
  const threads = useSelector((state) => state.threads);
  const authUser = useSelector((state) => state.authUser);
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(asyncReceiveThreads());
  }, [dispatch]);

  const filteredThreads = filter
    ? threads.filter((thread) => thread.category === filter)
    : threads;

  const categories = [...new Set(threads.map((thread) => thread.category))];

  const handleLogout = () => {
    dispatch(asyncUnsetAuthUser());
    navigate('/login');
  };

  const getUserById = (userId) => users.find((user) => user.id === userId);

  return (
    <div className="home-container" data-testid="home-page">
      <header className="home-header">
        <h1>Forum Diskusi</h1>
        {authUser ? (
          <div className="user-info">
            <span>Welcome, {authUser.name}</span>
            <button onClick={handleLogout} className="logout-button" data-testid="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="login-button" data-testid="home-login-button">
            Login
          </button>
        )}
      </header>

      <ThreadFilter
        categories={categories}
        filter={filter}
        setFilter={setFilter}
      />

      {authUser && (
        <button
          onClick={() => navigate('/create-thread')}
          className="create-thread-button"
          data-testid="create-thread-button"
        >
          Create New Thread
        </button>
      )}

      <ThreadList
        threads={filteredThreads}
        authUser={authUser}
        getUserById={getUserById}
        onThreadClick={(threadId) => navigate(`/thread/${threadId}`)}
      />
    </div>
  );
};

export default HomePage;
