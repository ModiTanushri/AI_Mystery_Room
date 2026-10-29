const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');
const sessionsKey = 'mystery-room-sessions';
const sessions = () => { try { return JSON.parse(localStorage.getItem(sessionsKey) || '{}'); } catch { return {}; } };
export function rememberSession(caseId, id, token) { const all = sessions(); all[id] = token; localStorage.setItem(sessionsKey, JSON.stringify(all)); const cases=JSON.parse(localStorage.getItem('mystery-room-cases')||'{}'); cases[caseId]=id; localStorage.setItem('mystery-room-cases',JSON.stringify(cases)); }
export function sessionToken(id) { return sessions()[id]; }
export function investigationForCase(caseId) { try { return JSON.parse(localStorage.getItem('mystery-room-cases')||'{}')[caseId]; } catch { return null; } }

export async function request(path, options = {}) {
  const { investigationId, ...fetchOptions } = options;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (investigationId) {
    const token = sessionToken(investigationId);
    if (token) headers['X-Investigation-Token'] = token;
  }
  const response = await fetch(`${API}${path}`, { ...fetchOptions, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message || 'Something went wrong. Please try again.');
  return payload;
}
