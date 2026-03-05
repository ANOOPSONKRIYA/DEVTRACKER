const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

async function request(path, { token } = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
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

export function getSummaryMetrics(token) {
  return request('/analytics/summary', { token })
}

export function getWeeklyHours(token) {
  return request('/analytics/weekly-hours', { token })
}

export function getDSADifficultyDistribution(token) {
  return request('/analytics/dsa-distribution', { token })
}
