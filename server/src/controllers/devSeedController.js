import User from '../models/User.js'
import DailyLog from '../models/DailyLog.js'
import DSAEntry from '../models/DSAEntry.js'
import ProjectEntry from '../models/ProjectEntry.js'

export async function seedInsertReadCheck(_req, res) {
  try {
    const unique = Date.now().toString()

    const user = await User.create({
      name: `Test User ${unique.slice(-4)}`,
      email: `test.${unique}@devtrackr.local`,
      password: 'secret123'
    })

    const dailyLog = await DailyLog.create({
      userId: user._id,
      date: new Date(),
      hours: 2,
      description: 'Day 2 persistence check log',
      tags: ['setup', 'backend'],
      links: ['https://example.com/day2-check']
    })

    const dsaEntry = await DSAEntry.create({
      userId: user._id,
      problemName: 'Two Sum',
      platform: 'LeetCode',
      difficulty: 'Easy',
      status: 'Solved',
      notes: 'Seeded by Day 2 insert-read check route'
    })

    const projectEntry = await ProjectEntry.create({
      userId: user._id,
      title: 'DevTrackr MVP',
      techStack: ['React', 'Express', 'MongoDB'],
      githubUrl: 'https://github.com/example/devtrackr',
      liveUrl: 'https://example.com/devtrackr',
      description: 'Seed project entry for persistence verification'
    })

    const [logs, dsaEntries, projectEntries] = await Promise.all([
      DailyLog.find({ userId: user._id }).lean(),
      DSAEntry.find({ userId: user._id }).lean(),
      ProjectEntry.find({ userId: user._id }).lean()
    ])

    res.status(201).json({
      message: 'Day 2 insert-read check passed',
      inserted: {
        userId: user._id,
        dailyLogId: dailyLog._id,
        dsaEntryId: dsaEntry._id,
        projectEntryId: projectEntry._id
      },
      fetched: {
        logsCount: logs.length,
        dsaEntriesCount: dsaEntries.length,
        projectEntriesCount: projectEntries.length
      },
      sample: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        dailyLog,
        dsaEntry,
        projectEntry
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Day 2 insert-read check failed',
      error: error.message
    })
  }
}

export async function getSeededDataSummary(req, res) {
  try {
    const { userId } = req.params

    const user = await User.findById(userId).select('-password').lean()

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const [logs, dsaEntries, projectEntries] = await Promise.all([
      DailyLog.find({ userId }).sort({ createdAt: -1 }).lean(),
      DSAEntry.find({ userId }).sort({ createdAt: -1 }).lean(),
      ProjectEntry.find({ userId }).sort({ createdAt: -1 }).lean()
    ])

    return res.status(200).json({
      user,
      counts: {
        logs: logs.length,
        dsaEntries: dsaEntries.length,
        projectEntries: projectEntries.length
      },
      data: {
        logs,
        dsaEntries,
        projectEntries
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch seeded data summary',
      error: error.message
    })
  }
}