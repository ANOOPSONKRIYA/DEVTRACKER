import { createContext, useMemo, useState } from 'react'
import { login, register } from '../services/authApi'

const AUTH_TOKEN_KEY = 'devtrackr_auth_token'
const AUTH_USER_KEY = 'devtrackr_auth_user'

function readStoredUser() {
  const storedUser = localStorage.getItem(AUTH_USER_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem(AUTH_USER_KEY)
    return null
  }
}

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY) || '')
  const [user, setUser] = useState(() => readStoredUser())

  function persistSession(nextToken, nextUser) {
    setToken(nextToken)
    setUser(nextUser)
    localStorage.setItem(AUTH_TOKEN_KEY, nextToken)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser))
  }

  async function registerUser(payload) {
    const response = await register(payload)
    persistSession(response.token, response.user)
    return response
  }

  async function loginUser(payload) {
    const response = await login(payload)
    persistSession(response.token, response.user)
    return response
  }

  function logoutUser() {
    setToken('')
    setUser(null)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      register: registerUser,
      login: loginUser,
      logout: logoutUser
    }),
    [token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
