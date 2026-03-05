const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

async function request(path, { method = 'GET', body, token } = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    })
  } catch {
    throw new Error('Unable to reach API server. Ensure backend is running on http://localhost:5000')
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`)
  }

  return data
}

export function listDailyLogs(token) {
  return request('/daily-logs', { token })
}

export function createDailyLog(token, payload) {
  return request('/daily-logs', {
    method: 'POST',
    token,
    body: payload
  })
}

export function updateDailyLog(token, logId, payload) {
  return request(`/daily-logs/${logId}`, {
    method: 'PUT',
    token,
    body: payload
  })
}

export function deleteDailyLog(token, logId) {
  return request(`/daily-logs/${logId}`, {
    method: 'DELETE',
    token
  })
}
