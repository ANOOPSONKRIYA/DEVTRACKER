import DailyLog from '../models/DailyLog.js'
import DSAEntry from '../models/DSAEntry.js'
import ProjectEntry from '../models/ProjectEntry.js'

export async function getSummaryMetrics(req, res) {
  try {
    const userId = req.user._id

    const [totalLogs, totalHoursResult, totalSolved, projectCount] = await Promise.all([
      DailyLog.countDocuments({ userId }),
      DailyLog.aggregate([
        { $match: { userId } },
        { $group: { _id: null, totalHours: { $sum: '$hours' } } }
      ]),
      DSAEntry.countDocuments({ userId, status: 'Solved' }),
      ProjectEntry.countDocuments({ userId })
    ])

    const totalHours = totalHoursResult[0]?.totalHours || 0

    return res.status(200).json({
      metrics: {
        totalLogs,
        totalHours,
        totalSolved,
        projectCount
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch summary metrics',
      error: error.message
    })
  }
}

export async function getWeeklyHoursTrend(req, res) {
  try {
    const userId = req.user._id
    const now = new Date()
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const start = new Date(end)
    start.setDate(start.getDate() - 7)

    const rawData = await DailyLog.aggregate([
      {
        $match: {
          userId,
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          hours: { $sum: '$hours' }
        }
      }
    ])

    const hoursByDate = new Map(
      rawData.map((item) => {
        const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`
        return [key, item.hours]
      })
    )

    const trend = []

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(now)
      date.setDate(now.getDate() - i)

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

      trend.push({
        date: key,
        label: date.toLocaleDateString(undefined, { weekday: 'short' }),
        hours: Number(hoursByDate.get(key) || 0)
      })
    }

    return res.status(200).json({ trend })
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch weekly trend',
      error: error.message
    })
  }
}

export async function getDSADifficultyDistribution(req, res) {
  try {
    const userId = req.user._id
    const distribution = await DSAEntry.aggregate([
      { $match: { userId } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ])

    const normalized = ['Easy', 'Medium', 'Hard'].map((difficulty) => {
      const found = distribution.find((item) => item._id === difficulty)
      return {
        difficulty,
        count: found ? found.count : 0
      }
    })

    return res.status(200).json({ distribution: normalized })
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch DSA distribution',
      error: error.message
    })
  }
}
