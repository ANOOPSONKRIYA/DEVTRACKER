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

export function listProjects(token) {
  return request('/projects', { token })
}

export function createProject(token, payload) {
  return request('/projects', {
    method: 'POST',
    token,
    body: payload
  })
}

export function updateProject(token, projectId, payload) {
  return request(`/projects/${projectId}`, {
    method: 'PUT',
    token,
    body: payload
  })
}

export function deleteProject(token, projectId) {
  return request(`/projects/${projectId}`, {
    method: 'DELETE',
    token
  })
}
