import mongoose from 'mongoose'
import ProjectEntry from '../models/ProjectEntry.js'

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value)
}

function buildResponse(entry) {
  return {
    id: entry._id.toString(),
    userId: entry.userId.toString(),
    title: entry.title,
    techStack: entry.techStack,
    githubUrl: entry.githubUrl,
    liveUrl: entry.liveUrl,
    description: entry.description,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt
  }
}

function normalizeStringArray(value, fieldName) {
  if (value === undefined) {
    return []
  }

  if (!Array.isArray(value)) {
    return { error: `${fieldName} must be an array of strings` }
  }

  const normalized = value.map((item) => String(item).trim())
  return { value: normalized }
}

function normalizePayload(body, options = { partial: false }) {
  const partial = options.partial
  const payload = {}

  if (!partial || body.title !== undefined) {
    payload.title = body.title
  }

  if (!partial || body.githubUrl !== undefined) {
    payload.githubUrl = body.githubUrl
  }

  if (!partial || body.liveUrl !== undefined) {
    payload.liveUrl = body.liveUrl
  }

  if (!partial || body.description !== undefined) {
    payload.description = body.description
  }

  if (!partial || body.techStack !== undefined) {
    const stackResult = normalizeStringArray(body.techStack, 'techStack')

    if (stackResult.error) {
      return { error: stackResult.error }
    }

    payload.techStack = stackResult.value
  }

  if (partial && Object.keys(payload).length === 0) {
    return { error: 'At least one updatable field is required' }
  }

  return { payload }
}

function handleError(res, error, fallbackMessage) {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Invalid project data',
      error: error.message
    })
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid request data',
      error: error.message
    })
  }

  return res.status(500).json({
    message: fallbackMessage,
    error: error.message
  })
}

export async function createProjectEntry(req, res) {
  try {
    const { payload, error } = normalizePayload(req.body, { partial: false })

    if (error) {
      return res.status(400).json({ message: error })
    }

    const entry = await ProjectEntry.create({
      userId: req.user._id,
      ...payload
    })

    return res.status(201).json({
      message: 'Project created successfully',
      project: buildResponse(entry)
    })
  } catch (error) {
    return handleError(res, error, 'Failed to create project')
  }
}

export async function listProjectEntries(req, res) {
  try {
    const entries = await ProjectEntry.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean()

    return res.status(200).json({
      projects: entries.map(buildResponse)
    })
  } catch (error) {
    return handleError(res, error, 'Failed to fetch projects')
  }
}

export async function getProjectEntryById(req, res) {
  try {
    const { projectId } = req.params

    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ message: 'Invalid project id' })
    }

    const entry = await ProjectEntry.findOne({ _id: projectId, userId: req.user._id }).lean()

    if (!entry) {
      return res.status(404).json({ message: 'Project not found' })
    }

    return res.status(200).json({
      project: buildResponse(entry)
    })
  } catch (error) {
    return handleError(res, error, 'Failed to fetch project')
  }
}

export async function updateProjectEntry(req, res) {
  try {
    const { projectId } = req.params

    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ message: 'Invalid project id' })
    }

    const { payload, error } = normalizePayload(req.body, { partial: true })

    if (error) {
      return res.status(400).json({ message: error })
    }

    const entry = await ProjectEntry.findOneAndUpdate(
      { _id: projectId, userId: req.user._id },
      payload,
      { new: true, runValidators: true }
    )

    if (!entry) {
      return res.status(404).json({ message: 'Project not found' })
    }

    return res.status(200).json({
      message: 'Project updated successfully',
      project: buildResponse(entry)
    })
  } catch (error) {
    return handleError(res, error, 'Failed to update project')
  }
}

export async function deleteProjectEntry(req, res) {
  try {
    const { projectId } = req.params

    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ message: 'Invalid project id' })
    }

    const entry = await ProjectEntry.findOneAndDelete({ _id: projectId, userId: req.user._id })

    if (!entry) {
      return res.status(404).json({ message: 'Project not found' })
    }

    return res.status(200).json({ message: 'Project deleted successfully' })
  } catch (error) {
    return handleError(res, error, 'Failed to delete project')
  }
}
