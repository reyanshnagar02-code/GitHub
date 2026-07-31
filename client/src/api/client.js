const API_BASE = '/api';

async function request(path, { method = 'GET', body, token, isForm = false } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isForm && body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message = data?.error || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: (token) => request('/auth/me', { token }),

  getIssues: (params = {}, token) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    return request(`/issues${query ? `?${query}` : ''}`, { token });
  },
  getIssue: (id, token) => request(`/issues/${id}`, { token }),
  createIssue: (formData, token) => request('/issues', { method: 'POST', body: formData, isForm: true, token }),
  upvoteIssue: (id, token) => request(`/issues/${id}/upvote`, { method: 'POST', token }),
  addComment: (id, text, token) => request(`/issues/${id}/comment`, { method: 'POST', body: { text }, token }),
  updateStatus: (id, formData, token) =>
    request(`/issues/${id}/status`, { method: 'PATCH', body: formData, isForm: true, token }),

  getStats: () => request('/stats'),
  getLeaderboard: () => request('/leaderboard'),
  getCategoryAnalytics: (token) => request('/analytics/categories', { token }),
  getResolutionAnalytics: (token) => request('/analytics/resolution-time', { token }),
  getHotspots: (token) => request('/analytics/hotspots', { token }),
};

export default api;
