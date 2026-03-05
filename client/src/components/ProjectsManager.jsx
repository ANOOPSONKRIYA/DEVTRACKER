import { useEffect, useState } from 'react'
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject
} from '../services/projectsApi'

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

function getInitialForm() {
  return {
    title: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
    description: ''
  }
}

export default function ProjectsManager({ token }) {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formValues, setFormValues] = useState(getInitialForm)

  const isEditMode = Boolean(editingProjectId)

  async function loadProjects() {
    setIsLoading(true)

    try {
      const response = await listProjects(token)
      setProjects(response.projects || [])
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

    loadProjects()
  }, [token])

  function resetForm() {
    setFormValues(getInitialForm())
    setEditingProjectId('')
  }

  function startEdit(project) {
    setFormValues({
      title: project.title || '',
      techStack: joinArray(project.techStack),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      description: project.description || ''
    })

    setEditingProjectId(project.id)
    setError('')
    setMessage('Editing selected project')
  }

  async function handleDelete(projectId) {
    const shouldDelete = window.confirm('Delete this project?')

    if (!shouldDelete) {
      return
    }

    try {
      await deleteProject(token, projectId)
      setProjects((current) => current.filter((project) => project.id !== projectId))
      setMessage('Project deleted')
      setError('')

      if (editingProjectId === projectId) {
        resetForm()
      }
    } catch (requestError) {
      setError(requestError.message)
      setMessage('')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!formValues.title.trim() || !formValues.githubUrl.trim()) {
      setError('Title and GitHub URL are required')
      setMessage('')
      return
    }

    setIsSubmitting(true)
    setError('')
    setMessage('')

    const payload = {
      title: formValues.title.trim(),
      techStack: splitCommaSeparated(formValues.techStack),
      githubUrl: formValues.githubUrl.trim(),
      liveUrl: formValues.liveUrl.trim(),
      description: formValues.description.trim()
    }

    try {
      if (isEditMode) {
        const response = await updateProject(token, editingProjectId, payload)
        setProjects((current) =>
          current.map((project) => (project.id === editingProjectId ? response.project : project))
        )
        setMessage('Project updated successfully')
      } else {
        const response = await createProject(token, payload)
        setProjects((current) => [response.project, ...current])
        setMessage('Project created successfully')
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
          <h2 className="text-sm font-semibold text-[#e1e1e1]">Projects</h2>
          <p className="mt-1 text-sm text-[#c4c4c4]">Capture portfolio work with stack and links.</p>
        </div>
        <span className="rounded-md border border-[#315f52] bg-[#10a37f]/10 px-2 py-1 text-xs text-[#8cefd8]">
          {projects.length} projects
        </span>
      </div>

      <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#949494]">Title</span>
            <input
              type="text"
              value={formValues.title}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="DevTrackr"
              className="h-10 w-full rounded-md border border-[#343434] bg-[#1a1a1a] px-3 text-sm text-[#ececec] outline-none placeholder:text-[#878787] focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#949494]">
              Tech Stack (comma separated)
            </span>
            <input
              type="text"
              value={formValues.techStack}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, techStack: event.target.value }))
              }
              placeholder="React, Node.js, MongoDB"
              className="h-10 w-full rounded-md border border-[#343434] bg-[#1a1a1a] px-3 text-sm text-[#ececec] outline-none placeholder:text-[#878787] focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20"
            />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#949494]">GitHub URL</span>
            <input
              type="url"
              value={formValues.githubUrl}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, githubUrl: event.target.value }))
              }
              placeholder="https://github.com/..."
              className="h-10 w-full rounded-md border border-[#343434] bg-[#1a1a1a] px-3 text-sm text-[#ececec] outline-none placeholder:text-[#878787] focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#949494]">Live URL (optional)</span>
            <input
              type="url"
              value={formValues.liveUrl}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, liveUrl: event.target.value }))
              }
              placeholder="https://your-app.com"
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
            placeholder="What problem it solves and what you built"
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
            {isSubmitting ? (isEditMode ? 'Updating...' : 'Saving...') : isEditMode ? 'Update Project' : 'Add Project'}
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
        <h3 className="text-sm font-semibold text-[#e1e1e1]">Project List</h3>

        {isLoading ? <p className="mt-3 text-sm text-[#b8b8b8]">Loading projects...</p> : null}

        {!isLoading && projects.length === 0 ? (
          <p className="mt-3 text-sm text-[#b8b8b8]">No projects yet. Add one above.</p>
        ) : null}

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project.id} className="rounded-lg border border-[#2f2f2f] bg-[#1c1c1c] p-4">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold text-[#ececec]">{project.title}</h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(project)}
                    className="rounded-md border border-[#2f7d66] bg-[#10a37f]/15 px-3 py-1.5 text-xs font-medium text-[#8ef0d9] transition hover:bg-[#10a37f]/25"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project.id)}
                    className="rounded-md border border-[#5a3c3c] bg-[#3a2323] px-3 py-1.5 text-xs font-medium text-[#efaaaa] transition hover:bg-[#4a2a2a]"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {project.description ? <p className="mt-2 text-sm text-[#cdcdcd]">{project.description}</p> : null}

              {Array.isArray(project.techStack) && project.techStack.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={`${project.id}-${tech}`}
                      className="rounded-full border border-[#315f52] bg-[#10a37f]/10 px-2 py-1 text-xs text-[#8cefd8]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#84d8ff] hover:text-[#9ee4ff]"
                >
                  GitHub
                </a>
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#84d8ff] hover:text-[#9ee4ff]"
                  >
                    Live Demo
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
