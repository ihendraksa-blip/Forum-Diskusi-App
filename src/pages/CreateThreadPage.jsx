import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncAddThread } from '../states/threads/action';

const CreateThreadPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) {
      alert('Please login to create a thread');
      navigate('/login');
      return;
    }

    try {
      await dispatch(asyncAddThread({ title, body, category }));
      navigate('/');
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
  };

  return (
    <div className="create-thread-container">
      <div className="create-thread-card">
        <h2>Create New Thread</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="body">Content</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={6}
            />
          </div>
          <button type="submit" className="submit-button">
            Create Thread
          </button>
        </form>
        <Link to="/" className="cancel-button">
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default CreateThreadPage;
