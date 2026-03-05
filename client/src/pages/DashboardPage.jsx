import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getProtectedExample } from '../services/authApi'

export default function DashboardPage() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [protectedMessage, setProtectedMessage] = useState('Loading protected data...')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadProtectedContent() {
      try {
        const response = await getProtectedExample(token)

        if (!mounted) {
          return
        }

        setProtectedMessage(response.message)
        setError('')
      } catch (requestError) {
        if (!mounted) {
          return
        }

        setError(requestError.message)
      }
    }

    loadProtectedContent()

    return () => {
      mounted = false
    }
  }, [token])

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-8 shadow-xl">
      <h1 className="text-2xl font-bold text-indigo-300">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-300">
        Welcome {user?.name || 'Developer'} ({user?.email || 'No email available'})
      </p>

      <div className="mt-6 rounded-lg border border-slate-700 bg-slate-950/60 p-4">
        <h2 className="text-sm font-semibold text-slate-200">Protected API check</h2>
        <p className="mt-2 text-sm text-slate-300">{protectedMessage}</p>
        {error ? <p className="mt-2 text-sm text-rose-400">{error}</p> : null}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-6 rounded-lg bg-slate-700 px-4 py-2 font-medium text-slate-100 transition hover:bg-slate-600"
      >
        Logout
      </button>
    </section>
  )
}
