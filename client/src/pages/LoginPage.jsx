import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const emailPattern = /^\S+@\S+\.\S+$/

function validateLoginForm(formValues) {
  if (!formValues.email || !formValues.password) {
    return 'Email and password are required'
  }

  if (!emailPattern.test(formValues.email)) {
    return 'Please enter a valid email address'
  }

  if (formValues.password.length < 6) {
    return 'Password must be at least 6 characters'
  }

  return ''
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formValues, setFormValues] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const validationError = validateLoginForm(formValues)

    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await login({
        email: formValues.email.trim(),
        password: formValues.password
      })

      const redirectPath = location.state?.from || '/dashboard'
      navigate(redirectPath, { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-2xl border border-[#303030] bg-[#171717]/95 p-8 shadow-2xl shadow-black/40">
      <h1 className="text-2xl font-bold text-[#10a37f]">Login</h1>
      <p className="mt-2 text-sm text-[#a6a6a6]">Sign in to continue to DevTrackr.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm text-[#b4b4b4]">Email</span>
          <input
            type="email"
            value={formValues.email}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, email: event.target.value }))
            }
            className="w-full rounded-lg border border-[#343434] bg-[#212121] px-3 py-2 text-[#ececec] outline-none ring-[#10a37f] focus:border-[#10a37f] focus:ring-2"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-[#b4b4b4]">Password</span>
          <input
            type="password"
            value={formValues.password}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, password: event.target.value }))
            }
            className="w-full rounded-lg border border-[#343434] bg-[#212121] px-3 py-2 text-[#ececec] outline-none ring-[#10a37f] focus:border-[#10a37f] focus:ring-2"
            placeholder="••••••••"
          />
        </label>

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-[#10a37f] px-4 py-2 font-medium text-[#03160f] transition hover:bg-[#0e8f70] disabled:cursor-not-allowed disabled:bg-[#0a5f4b] disabled:text-[#90cbbb]"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p className="mt-4 text-sm text-[#a6a6a6]">
        No account yet?{' '}
        <Link className="font-medium text-[#67d9bf] hover:text-[#8ff0d8]" to="/register">
          Register here
        </Link>
      </p>
    </section>
  )
}
