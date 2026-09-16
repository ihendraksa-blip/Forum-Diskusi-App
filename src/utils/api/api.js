const BASE_URL = 'https://forum-api.dicoding.dev/v1';

async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
}

const api = {
  async login({ email, password }) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },

  async register({ name, email, password }) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  },

  async getAllUsers() {
    return fetchWithAuth(`${BASE_URL}/users`);
  },

  async getOwnProfile() {
    return fetchWithAuth(`${BASE_URL}/users/me`);
  },

  async getAllThreads() {
    return fetchWithAuth(`${BASE_URL}/threads`);
  },

  async getThreadDetail(threadId) {
    return fetchWithAuth(`${BASE_URL}/threads/${threadId}`);
  },

  async createThread({ title, body, category }) {
    return fetchWithAuth(`${BASE_URL}/threads`, {
      method: 'POST',
      body: JSON.stringify({ title, body, category }),
    });
  },

  async upVoteThread(threadId) {
    return fetchWithAuth(`${BASE_URL}/threads/${threadId}/up-vote`, {
      method: 'POST',
    });
  },

  async downVoteThread(threadId) {
    return fetchWithAuth(`${BASE_URL}/threads/${threadId}/down-vote`, {
      method: 'POST',
    });
  },

  async neutralizeThreadVote(threadId) {
    return fetchWithAuth(`${BASE_URL}/threads/${threadId}/neutral-vote`, {
      method: 'POST',
    });
  },

  async createComment(threadId, content) {
    return fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  async upVoteComment(threadId, commentId) {
    return fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`, {
      method: 'POST',
    });
  },

  async downVoteComment(threadId, commentId) {
    return fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`, {
      method: 'POST',
    });
  },

  async neutralizeCommentVote(threadId, commentId) {
    return fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`, {
      method: 'POST',
    });
  },

  async getLeaderboards() {
    return fetchWithAuth(`${BASE_URL}/leaderboards`);
  },

  setToken(token) {
    localStorage.setItem('token', token);
  },

  getToken() {
    return localStorage.getItem('token');
  },

  removeToken() {
    localStorage.removeItem('token');
  },
};

export default api;
