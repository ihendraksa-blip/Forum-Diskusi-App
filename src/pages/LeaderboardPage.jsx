import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { asyncReceiveLeaderboards } from '../states/leaderboards/action';

const LeaderboardPage = () => {
  const dispatch = useDispatch();
  const leaderboards = useSelector((state) => state.leaderboards);
  const users = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(asyncReceiveLeaderboards());
  }, [dispatch]);

  const getUserById = (userId) => users.find((user) => user.id === userId);

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>
      <Link to="/" className="back-button">
        ← Back to Home
      </Link>

      <div className="leaderboard-list">
        {leaderboards.length === 0 ? (
          <p className="no-data">No leaderboard data available</p>
        ) : (
          leaderboards.map((leaderboard, index) => {
            const user = getUserById(leaderboard.user.id);
            return (
              <div key={leaderboard.user.id} className="leaderboard-card">
                <div className="leaderboard-rank">#{index + 1}</div>
                <div className="leaderboard-user">
                  <div className="user-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user?.name || 'Unknown'}</div>
                    <div className="user-email">{user?.email || ''}</div>
                  </div>
                </div>
                <div className="leaderboard-score">
                  <div className="score-label">Score</div>
                  <div className="score-value">{leaderboard.score}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
