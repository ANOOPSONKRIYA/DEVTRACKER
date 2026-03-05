import { useEffect, useMemo, useState } from 'react'
import {
  createDSAEntry,
  deleteDSAEntry,
  listDSAEntries,
  updateDSAEntry
} from '../services/dsaApi'

const platformOptions = ['LeetCode', 'HackerRank', 'Codeforces', 'CodeChef', 'GeeksforGeeks', 'Other']
const difficultyOptions = ['Easy', 'Medium', 'Hard']
const statusOptions = ['Not Started', 'In Progress', 'Solved', 'Revisit']

function getInitialForm() {
  return {
    problemName: '',
    platform: 'LeetCode',
    difficulty: 'Easy',
    status: 'Not Started',
    notes: ''
  }
}

export default function DSATrackerManager({ token }) {
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingEntryId, setEditingEntryId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [formValues, setFormValues] = useState(getInitialForm)

  const isEditMode = Boolean(editingEntryId)

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return entries
    }

    return entries.filter((entry) => {
      return (
        entry.problemName.toLowerCase().includes(normalizedQuery) ||
        entry.platform.toLowerCase().includes(normalizedQuery) ||
        entry.difficulty.toLowerCase().includes(normalizedQuery) ||
        entry.status.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [entries, query])

  const solvedCount = useMemo(
    () => entries.filter((entry) => entry.status === 'Solved').length,
    [entries]
  )

  async function loadEntries() {
    setIsLoading(true)

    try {
      const response = await listDSAEntries(token)
      setEntries(response.entries || [])
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

    loadEntries()
  }, [token])

  function resetForm() {
    setFormValues(getInitialForm())
    setEditingEntryId('')
  }

  function startEdit(entry) {
    setFormValues({
      problemName: entry.problemName,
      platform: entry.platform,
      difficulty: entry.difficulty,
      status: entry.status,
      notes: entry.notes || ''
    })
    setEditingEntryId(entry.id)
    setMessage('Editing selected DSA entry')
    setError('')
  }

  async function handleDelete(entryId) {
    const shouldDelete = window.confirm('Delete this DSA entry?')

    if (!shouldDelete) {
      return
    }

    try {
      await deleteDSAEntry(token, entryId)
      setEntries((current) => current.filter((entry) => entry.id !== entryId))
      setMessage('DSA entry deleted')
      setError('')

      if (editingEntryId === entryId) {
        resetForm()
      }
    } catch (requestError) {
      setError(requestError.message)
      setMessage('')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!formValues.problemName.trim()) {
      setError('Problem name is required')
      setMessage('')
      return
    }

    setIsSubmitting(true)
    setError('')
    setMessage('')

    const payload = {
      problemName: formValues.problemName.trim(),
      platform: formValues.platform,
      difficulty: formValues.difficulty,
      status: formValues.status,
      notes: formValues.notes.trim()
    }

    try {
      if (isEditMode) {
        const response = await updateDSAEntry(token, editingEntryId, payload)
        setEntries((current) =>
          current.map((entry) => (entry.id === editingEntryId ? response.entry : entry))
        )
        setMessage('DSA entry updated successfully')
      } else {
        const response = await createDSAEntry(token, payload)
        setEntries((current) => [response.entry, ...current])
        setMessage('DSA entry created successfully')
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
          <h2 className="text-sm font-semibold text-[#e1e1e1]">DSA Tracker</h2>
          <p className="mt-1 text-sm text-[#c4c4c4]">
            Track problems by platform, difficulty, and progress status.
          </p>
        </div>
        <span className="rounded-md border border-[#315f52] bg-[#10a37f]/10 px-2 py-1 text-xs text-[#8cefd8]">
          Solved {solvedCount}/{entries.length}
        </span>
      </div>

      <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#949494]">Problem Name</span>
          <input
            type="text"
            value={formValues.problemName}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, problemName: event.target.value }))
            }
            placeholder="Two Sum"
            className="h-10 w-full rounded-md border border-[#343434] bg-[#1a1a1a] px-3 text-sm text-[#ececec] outline-none placeholder:text-[#878787] focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20"
          />
        </label>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#949494]">Platform</span>
            <select
              value={formValues.platform}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, platform: event.target.value }))
              }
              className="h-10 w-full rounded-md border border-[#343434] bg-[#1a1a1a] px-3 text-sm text-[#ececec] outline-none focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20"
            >
              {platformOptions.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#949494]">Difficulty</span>
            <select
              value={formValues.difficulty}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, difficulty: event.target.value }))
              }
              className="h-10 w-full rounded-md border border-[#343434] bg-[#1a1a1a] px-3 text-sm text-[#ececec] outline-none focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20"
            >
              {difficultyOptions.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#949494]">Status</span>
            <select
              value={formValues.status}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, status: event.target.value }))
              }
              className="h-10 w-full rounded-md border border-[#343434] bg-[#1a1a1a] px-3 text-sm text-[#ececec] outline-none focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#949494]">Notes</span>
          <textarea
            rows={3}
            value={formValues.notes}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, notes: event.target.value }))
            }
            placeholder="Pattern used, mistakes, and revisit points"
            className="w-full rounded-md border border-[#343434] bg-[#1a1a1a] px-3 py-2 text-sm text-[#ececec] outline-none placeholder:text-[#878787] focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20"
          />
        </label>

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        {message ? <p className="text-sm text-[#72ddc4]">{message}</p> : null}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-[#10a37f] px-4 py-2 text-sm font-medium text-[#03160f] transition hover:bg-[#0e8f70] disabled:cursor-not-allowed disabled:bg-[#0a5f4b] disabled:text-[#90cbbb]"
          >
            {isSubmitting ? (isEditMode ? 'Updating...' : 'Saving...') : isEditMode ? 'Update Entry' : 'Add Entry'}
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-[#e1e1e1]">Entries</h3>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter entries..."
            className="h-9 w-full max-w-xs rounded-md border border-[#343434] bg-[#1a1a1a] px-3 text-sm text-[#ececec] outline-none placeholder:text-[#878787] focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20"
          />
        </div>

        {isLoading ? <p className="mt-3 text-sm text-[#b8b8b8]">Loading DSA entries...</p> : null}

        {!isLoading && filteredEntries.length === 0 ? (
          <p className="mt-3 text-sm text-[#b8b8b8]">No DSA entries found.</p>
        ) : null}

        <div className="mt-3 space-y-3">
          {filteredEntries.map((entry) => (
            <article key={entry.id} className="rounded-lg border border-[#2f2f2f] bg-[#1c1c1c] p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[#ececec]">{entry.problemName}</p>
                  <p className="text-xs text-[#9f9f9f]">
                    {entry.platform} | {entry.difficulty} | {entry.status}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(entry)}
                    className="rounded-md border border-[#2f7d66] bg-[#10a37f]/15 px-3 py-1.5 text-xs font-medium text-[#8ef0d9] transition hover:bg-[#10a37f]/25"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    className="rounded-md border border-[#5a3c3c] bg-[#3a2323] px-3 py-1.5 text-xs font-medium text-[#efaaaa] transition hover:bg-[#4a2a2a]"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {entry.notes ? <p className="mt-2 text-sm text-[#cfcfcf]">{entry.notes}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
