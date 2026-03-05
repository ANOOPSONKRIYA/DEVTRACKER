import { useEffect, useMemo, useState } from 'react'
import {
  createDailyLog,
  deleteDailyLog,
  listDailyLogs,
  updateDailyLog
} from '../services/dailyLogApi'

function getNowDateTimeLocal() {
  const now = new Date()
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 16)
}

function toInputDateTime(value) {
  const rawValue = String(value || '')

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(rawValue)) {
    return rawValue.slice(0, 16)
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return getNowDateTimeLocal()
  }

  const timezoneOffsetMs = date.getTimezoneOffset() * 60 * 1000
  return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 16)
}

function joinArray(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return ''
  }

  return values.join(', ')
}

function splitCommaSeparated(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function DailyLogsManager({ token }) {
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingLogId, setEditingLogId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formValues, setFormValues] = useState({
    date: getNowDateTimeLocal(),
    hours: '',
    description: '',
    tags: '',
    links: ''
  })

  const isEditMode = Boolean(editingLogId)

  const submitButtonLabel = useMemo(() => {
    if (isSubmitting && isEditMode) {
      return 'Updating...'
    }

    if (isSubmitting) {
      return 'Saving...'
    }

    return isEditMode ? 'Update Log' : 'Add Log'
  }, [isEditMode, isSubmitting])

  async function loadLogs() {
    setIsLoading(true)

    try {
      const response = await listDailyLogs(token)
      setLogs(response.dailyLogs || [])
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      return
    }

    loadLogs()
  }, [token])

  function resetForm() {
    setFormValues({
      date: getNowDateTimeLocal(),
      hours: '',
      description: '',
      tags: '',
      links: ''
    })
    setEditingLogId('')
  }

  function hydrateFormFromLog(log) {
    setFormValues({
      date: toInputDateTime(log.date),
      hours: String(log.hours),
      description: log.description || '',
      tags: joinArray(log.tags),
      links: joinArray(log.links)
    })
    setEditingLogId(log.id)
    setMessage('Editing selected log')
    setError('')
  }

  async function handleDelete(logId) {
    const shouldDelete = window.confirm('Delete this daily log?')

    if (!shouldDelete) {
      return
    }

    try {
      await deleteDailyLog(token, logId)
      setLogs((currentLogs) => currentLogs.filter((log) => log.id !== logId))
      setMessage('Daily log deleted')
      setError('')

      if (editingLogId === logId) {
        resetForm()
      }
    } catch (requestError) {
      setError(requestError.message)
      setMessage('')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const normalizedDescription = formValues.description.trim()
    const parsedHours = Number(formValues.hours)

    if (!formValues.date || Number.isNaN(parsedHours) || !normalizedDescription) {
      setError('Date, hours, and description are required')
      setMessage('')
      return
    }

    setIsSubmitting(true)
    setError('')
    setMessage('')

    const payload = {
      date: formValues.date,
      hours: parsedHours,
      description: normalizedDescription,
      tags: splitCommaSeparated(formValues.tags),
      links: splitCommaSeparated(formValues.links)
    }

    try {
      if (isEditMode) {
        const response = await updateDailyLog(token, editingLogId, payload)
        setLogs((currentLogs) =>
          currentLogs.map((log) => (log.id === editingLogId ? response.dailyLog : log))
        )
        setMessage('Daily log updated successfully')
      } else {
        const response = await createDailyLog(token, payload)
        setLogs((currentLogs) => [response.dailyLog, ...currentLogs])
        setMessage('Daily log created successfully')
      }

      resetForm()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-xl border border-[#303030] bg-[#171717]/85 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#e1e1e1]">Daily Logs</h2>
          <p className="mt-1 text-sm text-[#c4c4c4]">
            Capture focused work, update entries, and keep your timeline clean.
          </p>
        </div>
        <span className="rounded-md border border-[#315f52] bg-[#10a37f]/10 px-2 py-1 text-xs text-[#8cefd8]">
          {logs.length} logs
        </span>
      </div>

      <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#949494]">Date</span>
            <input
              type="datetime-local"
              value={formValues.date}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, date: event.target.value }))
              }
              max="2099-12-31T23:59"
              className="h-10 w-full rounded-md border border-[#343434] bg-[#1a1a1a] px-3 text-sm text-[#ececec] outline-none focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20"
            />
            <span className="mt-1 block text-xs text-[#8f8f8f]">Calendar + time auto-filled to now</span>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#949494]">Hours</span>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={formValues.hours}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, hours: event.target.value }))
              }
              placeholder="e.g. 3.5"
              className="h-10 w-full rounded-md border border-[#343434] bg-[#1a1a1a] px-3 text-sm text-[#ececec] outline-none placeholder:text-[#878787] focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#949494]">Description</span>
          <textarea
            rows={3}
            value={formValues.description}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, description: event.target.value }))
            }
            placeholder="What did you work on today?"
            className="w-full rounded-md border border-[#343434] bg-[#1a1a1a] px-3 py-2 text-sm text-[#ececec] outline-none placeholder:text-[#878787] focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#949494]">
              Tags (comma separated)
            </span>
            <input
              type="text"
              value={formValues.tags}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, tags: event.target.value }))
              }
              placeholder="dsa, frontend, backend"
              className="h-10 w-full rounded-md border border-[#343434] bg-[#1a1a1a] px-3 text-sm text-[#ececec] outline-none placeholder:text-[#878787] focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#949494]">
              Links (comma separated)
            </span>
            <input
              type="text"
              value={formValues.links}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, links: event.target.value }))
              }
              placeholder="https://..."
              className="h-10 w-full rounded-md border border-[#343434] bg-[#1a1a1a] px-3 text-sm text-[#ececec] outline-none placeholder:text-[#878787] focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20"
            />
          </label>
        </div>

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        {message ? <p className="text-sm text-[#72ddc4]">{message}</p> : null}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-[#10a37f] px-4 py-2 text-sm font-medium text-[#03160f] transition hover:bg-[#0e8f70] disabled:cursor-not-allowed disabled:bg-[#0a5f4b] disabled:text-[#90cbbb]"
          >
            {submitButtonLabel}
          </button>

          {isEditMode ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-[#343434] bg-[#262626] px-4 py-2 text-sm font-medium text-[#ececec] transition hover:bg-[#2f2f2f]"
            >
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-5 border-t border-[#2a2a2a] pt-4">
        <h3 className="text-sm font-semibold text-[#e1e1e1]">Logs List</h3>

        {isLoading ? <p className="mt-2 text-sm text-[#b8b8b8]">Loading logs...</p> : null}

        {!isLoading && logs.length === 0 ? (
          <p className="mt-2 text-sm text-[#b8b8b8]">No logs yet. Add your first daily log above.</p>
        ) : null}

        <div className="mt-3 space-y-3">
          {logs.map((log) => (
            <article key={log.id} className="rounded-lg border border-[#2f2f2f] bg-[#1c1c1c] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#ececec]">
                  {new Date(log.date).toLocaleString()} - {log.hours}h
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => hydrateFormFromLog(log)}
                    className="rounded-md border border-[#2f7d66] bg-[#10a37f]/15 px-3 py-1.5 text-xs font-medium text-[#8ef0d9] transition hover:bg-[#10a37f]/25"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(log.id)}
                    className="rounded-md border border-[#5a3c3c] bg-[#3a2323] px-3 py-1.5 text-xs font-medium text-[#efaaaa] transition hover:bg-[#4a2a2a]"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-2 text-sm text-[#d0d0d0]">{log.description}</p>

              {Array.isArray(log.tags) && log.tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {log.tags.map((tag) => (
                    <span
                      key={`${log.id}-${tag}`}
                      className="rounded-full border border-[#315f52] bg-[#10a37f]/10 px-2 py-1 text-xs text-[#8cefd8]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {Array.isArray(log.links) && log.links.length > 0 ? (
                <ul className="mt-3 space-y-1">
                  {log.links.map((link) => (
                    <li key={`${log.id}-${link}`}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#84d8ff] hover:text-[#9ee4ff]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
