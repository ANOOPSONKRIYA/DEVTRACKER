import mongoose from 'mongoose'
import DailyLog from '../models/DailyLog.js'

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value)
}

function buildDailyLogResponse(log) {
  return {
    id: log._id.toString(),
    userId: log.userId.toString(),
    date: log.date,
    hours: log.hours,
    description: log.description,
    tags: log.tags,
    links: log.links,
    createdAt: log.createdAt,
    updatedAt: log.updatedAt
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

function validateAndNormalizePayload(body, options = { partial: false }) {
  const partial = options.partial
  const payload = {}

  if (!partial || body.date !== undefined) {
    if (body.date === undefined || body.date === null || body.date === '') {
      return { error: 'date is required' }
    }

    const parsedDate = new Date(body.date)

    if (Number.isNaN(parsedDate.getTime())) {
      return { error: 'date must be a valid date' }
    }

    payload.date = parsedDate
  }

  if (!partial || body.hours !== undefined) {
    if (body.hours === undefined || body.hours === null || body.hours === '') {
      return { error: 'hours is required' }
    }

    const parsedHours = Number(body.hours)

    if (Number.isNaN(parsedHours)) {
      return { error: 'hours must be a number' }
    }

    payload.hours = parsedHours
  }

  if (!partial || body.description !== undefined) {
    const description = String(body.description || '').trim()

    if (!description) {
      return { error: 'description is required' }
    }

    payload.description = description
  }

  if (!partial || body.tags !== undefined) {
    const tagsResult = normalizeStringArray(body.tags, 'tags')

    if (tagsResult.error) {
      return { error: tagsResult.error }
    }

    payload.tags = tagsResult.value
  }

  if (!partial || body.links !== undefined) {
    const linksResult = normalizeStringArray(body.links, 'links')

    if (linksResult.error) {
      return { error: linksResult.error }
    }

    payload.links = linksResult.value
  }

  if (partial && Object.keys(payload).length === 0) {
    return { error: 'At least one updatable field is required' }
  }

  return { payload }
}

function handleControllerError(res, error, fallbackMessage) {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Invalid daily log data',
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

export async function createDailyLog(req, res) {
  try {
    const { payload, error } = validateAndNormalizePayload(req.body, { partial: false })

    if (error) {
      return res.status(400).json({ message: error })
    }

    const dailyLog = await DailyLog.create({
      userId: req.user._id,
      ...payload
    })

    return res.status(201).json({
      message: 'Daily log created successfully',
      dailyLog: buildDailyLogResponse(dailyLog)
    })
  } catch (error) {
    return handleControllerError(res, error, 'Failed to create daily log')
  }
}

export async function listDailyLogs(req, res) {
  try {
    const logs = await DailyLog.find({ userId: req.user._id })
      .sort({ date: -1, createdAt: -1 })
      .lean()

    return res.status(200).json({
      dailyLogs: logs.map(buildDailyLogResponse)
    })
  } catch (error) {
    return handleControllerError(res, error, 'Failed to fetch daily logs')
  }
}

export async function getDailyLogById(req, res) {
  try {
    const { logId } = req.params

    if (!isValidObjectId(logId)) {
      return res.status(400).json({ message: 'Invalid daily log id' })
    }

    const log = await DailyLog.findOne({ _id: logId, userId: req.user._id }).lean()

    if (!log) {
      return res.status(404).json({ message: 'Daily log not found' })
    }

    return res.status(200).json({
      dailyLog: buildDailyLogResponse(log)
    })
  } catch (error) {
    return handleControllerError(res, error, 'Failed to fetch daily log')
  }
}

export async function updateDailyLog(req, res) {
  try {
    const { logId } = req.params

    if (!isValidObjectId(logId)) {
      return res.status(400).json({ message: 'Invalid daily log id' })
    }

    const { payload, error } = validateAndNormalizePayload(req.body, { partial: true })

    if (error) {
      return res.status(400).json({ message: error })
    }

    const updatedLog = await DailyLog.findOneAndUpdate(
      { _id: logId, userId: req.user._id },
      payload,
      { new: true, runValidators: true }
    )

    if (!updatedLog) {
      return res.status(404).json({ message: 'Daily log not found' })
    }

    return res.status(200).json({
      message: 'Daily log updated successfully',
      dailyLog: buildDailyLogResponse(updatedLog)
    })
  } catch (error) {
    return handleControllerError(res, error, 'Failed to update daily log')
  }
}

export async function deleteDailyLog(req, res) {
  try {
    const { logId } = req.params

    if (!isValidObjectId(logId)) {
      return res.status(400).json({ message: 'Invalid daily log id' })
    }

    const deletedLog = await DailyLog.findOneAndDelete({ _id: logId, userId: req.user._id })

    if (!deletedLog) {
      return res.status(404).json({ message: 'Daily log not found' })
    }

    return res.status(200).json({
      message: 'Daily log deleted successfully'
    })
  } catch (error) {
    return handleControllerError(res, error, 'Failed to delete daily log')
  }
}
