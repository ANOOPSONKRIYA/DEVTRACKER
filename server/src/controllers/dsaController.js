import mongoose from 'mongoose'
import DSAEntry from '../models/DSAEntry.js'

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value)
}

function buildResponse(entry) {
  return {
    id: entry._id.toString(),
    userId: entry.userId.toString(),
    problemName: entry.problemName,
    platform: entry.platform,
    difficulty: entry.difficulty,
    status: entry.status,
    notes: entry.notes,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt
  }
}

function normalizePayload(body, options = { partial: false }) {
  const partial = options.partial
  const payload = {}
  const fields = ['problemName', 'platform', 'difficulty', 'status', 'notes']

  for (const field of fields) {
    if (!partial || body[field] !== undefined) {
      payload[field] = body[field]
    }
  }

  if (partial && Object.keys(payload).length === 0) {
    return { error: 'At least one updatable field is required' }
  }

  return { payload }
}

function handleError(res, error, fallbackMessage) {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Invalid DSA entry data',
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

export async function createDSAEntry(req, res) {
  try {
    const { payload, error } = normalizePayload(req.body, { partial: false })

    if (error) {
      return res.status(400).json({ message: error })
    }

    const entry = await DSAEntry.create({
      userId: req.user._id,
      ...payload
    })

    return res.status(201).json({
      message: 'DSA entry created successfully',
      entry: buildResponse(entry)
    })
  } catch (error) {
    return handleError(res, error, 'Failed to create DSA entry')
  }
}

export async function listDSAEntries(req, res) {
  try {
    const query = { userId: req.user._id }

    if (req.query.platform) {
      query.platform = req.query.platform
    }

    if (req.query.difficulty) {
      query.difficulty = req.query.difficulty
    }

    if (req.query.status) {
      query.status = req.query.status
    }

    const entries = await DSAEntry.find(query).sort({ createdAt: -1 }).lean()

    return res.status(200).json({
      entries: entries.map(buildResponse)
    })
  } catch (error) {
    return handleError(res, error, 'Failed to fetch DSA entries')
  }
}

export async function getDSAEntryById(req, res) {
  try {
    const { entryId } = req.params

    if (!isValidObjectId(entryId)) {
      return res.status(400).json({ message: 'Invalid DSA entry id' })
    }

    const entry = await DSAEntry.findOne({ _id: entryId, userId: req.user._id }).lean()

    if (!entry) {
      return res.status(404).json({ message: 'DSA entry not found' })
    }

    return res.status(200).json({
      entry: buildResponse(entry)
    })
  } catch (error) {
    return handleError(res, error, 'Failed to fetch DSA entry')
  }
}

export async function updateDSAEntry(req, res) {
  try {
    const { entryId } = req.params

    if (!isValidObjectId(entryId)) {
      return res.status(400).json({ message: 'Invalid DSA entry id' })
    }

    const { payload, error } = normalizePayload(req.body, { partial: true })

    if (error) {
      return res.status(400).json({ message: error })
    }

    const entry = await DSAEntry.findOneAndUpdate(
      { _id: entryId, userId: req.user._id },
      payload,
      { new: true, runValidators: true }
    )

    if (!entry) {
      return res.status(404).json({ message: 'DSA entry not found' })
    }

    return res.status(200).json({
      message: 'DSA entry updated successfully',
      entry: buildResponse(entry)
    })
  } catch (error) {
    return handleError(res, error, 'Failed to update DSA entry')
  }
}

export async function deleteDSAEntry(req, res) {
  try {
    const { entryId } = req.params

    if (!isValidObjectId(entryId)) {
      return res.status(400).json({ message: 'Invalid DSA entry id' })
    }

    const entry = await DSAEntry.findOneAndDelete({ _id: entryId, userId: req.user._id })

    if (!entry) {
      return res.status(404).json({ message: 'DSA entry not found' })
    }

    return res.status(200).json({ message: 'DSA entry deleted successfully' })
  } catch (error) {
    return handleError(res, error, 'Failed to delete DSA entry')
  }
}
