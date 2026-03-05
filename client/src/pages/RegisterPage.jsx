import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const emailPattern = /^\S+@\S+\.\S+$/

function validateRegisterForm(formValues) {
  if (!formValues.name.trim()) {
    return 'Name is required'
  }

  if (formValues.name.trim().length < 2) {
    return 'Name must be at least 2 characters'
  }

  if (!formValues.email || !emailPattern.test(formValues.email)) {
    return 'Please enter a valid email address'
  }

  if (!formValues.password || formValues.password.length < 6) {
    return 'Password must be at least 6 characters'
  }

  if (formValues.password !== formValues.confirmPassword) {
    return 'Passwords do not match'
  }

  return ''
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const validationError = validateRegisterForm(formValues)

    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await register({
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        password: formValues.password
      })
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-2xl border border-[#303030] bg-[#171717]/95 p-8 shadow-2xl shadow-black/40">
      <h1 className="text-2xl font-bold text-[#10a37f]">Create account</h1>
      <p className="mt-2 text-sm text-[#a6a6a6]">Register to start tracking your daily progress.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm text-[#b4b4b4]">Name</span>
          <input
            type="text"
            value={formValues.name}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, name: event.target.value }))
            }
            className="w-full rounded-lg border border-[#343434] bg-[#212121] px-3 py-2 text-[#ececec] outline-none ring-[#10a37f] focus:border-[#10a37f] focus:ring-2"
            placeholder="Your name"
          />
        </label>

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
            placeholder="At least 6 characters"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-[#b4b4b4]">Confirm Password</span>
          <input
            type="password"
            value={formValues.confirmPassword}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, confirmPassword: event.target.value }))
            }
            className="w-full rounded-lg border border-[#343434] bg-[#212121] px-3 py-2 text-[#ececec] outline-none ring-[#10a37f] focus:border-[#10a37f] focus:ring-2"
            placeholder="Repeat password"
          />
        </label>

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-[#10a37f] px-4 py-2 font-medium text-[#03160f] transition hover:bg-[#0e8f70] disabled:cursor-not-allowed disabled:bg-[#0a5f4b] disabled:text-[#90cbbb]"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-sm text-[#a6a6a6]">
        Already have an account?{' '}
        <Link className="font-medium text-[#67d9bf] hover:text-[#8ff0d8]" to="/login">
          Login here
        </Link>
      </p>
    </section>
  )
}
