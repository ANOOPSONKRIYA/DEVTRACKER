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

export function register(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: payload
  })
}

export function login(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: payload
  })
}

export function getProtectedExample(token) {
  return request('/auth/protected', { token })
}
