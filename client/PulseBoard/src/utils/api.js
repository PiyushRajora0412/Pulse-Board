const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function getToken() {
  return localStorage.getItem('pb_token');
}
export function setToken(token) {
  localStorage.setItem('pb_token', token);
}
export function clearToken() {
  localStorage.removeItem('pb_token');
}

export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export const api = {
  register: (email, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),
  getGoals: () => request('/goals'),
  addGoal: (title, target) =>
    request('/goals', { method: 'POST', body: JSON.stringify({ title, target }) }),
  updateGoal: (id, payload) =>
    request(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteGoal: (id) => request(`/goals/${id}`, { method: 'DELETE' }),
};
