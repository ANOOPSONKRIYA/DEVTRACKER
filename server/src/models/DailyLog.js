import mongoose from 'mongoose'

const dailyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      index: true
    },
    date: {
      type: Date,
      required: [true, 'date is required']
    },
    hours: {
      type: Number,
      required: [true, 'hours is required'],
      min: [0, 'hours cannot be negative'],
      max: [24, 'hours cannot exceed 24']
    },
    description: {
      type: String,
      required: [true, 'description is required'],
      trim: true,
      minlength: [3, 'description must be at least 3 characters'],
      maxlength: [2000, 'description must be at most 2000 characters']
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return value.every((tag) => typeof tag === 'string' && tag.trim().length > 0)
        },
        message: 'tags must contain non-empty strings'
      }
    },
    links: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return value.every((link) => /^https?:\/\//i.test(link))
        },
        message: 'links must be valid http/https URLs'
      }
    }
  },
  { timestamps: true }
)

dailyLogSchema.index({ userId: 1, date: -1 })

const DailyLog = mongoose.model('DailyLog', dailyLogSchema)

export default DailyLog