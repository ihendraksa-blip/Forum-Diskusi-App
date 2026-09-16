import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navigation = () => {
  const authUser = useSelector((state) => state.authUser);

  return (
    <nav className="navigation" data-testid="navigation">
      <div className="nav-brand">
        <Link to="/">Forum Diskusi</Link>
      </div>
      <div className="nav-links">
        <Link to="/" data-testid="nav-home">Home</Link>
        <Link to="/leaderboard" data-testid="nav-leaderboard">Leaderboard</Link>
        {authUser ? (
          <>
            <Link to="/create-thread" data-testid="nav-create-thread">Create Thread</Link>
            <span className="nav-user" data-testid="nav-user">Welcome, {authUser.name}</span>
          </>
        ) : (
          <>
            <Link to="/login" data-testid="nav-login">Login</Link>
            <Link to="/register" data-testid="nav-register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
