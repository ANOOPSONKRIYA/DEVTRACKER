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

export function listDSAEntries(token) {
  return request('/dsa-entries', { token })
}

export function createDSAEntry(token, payload) {
  return request('/dsa-entries', {
    method: 'POST',
    token,
    body: payload
  })
}

export function updateDSAEntry(token, entryId, payload) {
  return request(`/dsa-entries/${entryId}`, {
    method: 'PUT',
    token,
    body: payload
  })
}

export function deleteDSAEntry(token, entryId) {
  return request(`/dsa-entries/${entryId}`, {
    method: 'DELETE',
    token
  })
}
