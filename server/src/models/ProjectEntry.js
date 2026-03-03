import mongoose from 'mongoose'

const projectEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'title is required'],
      trim: true,
      minlength: [2, 'title must be at least 2 characters'],
      maxlength: [120, 'title must be at most 120 characters']
    },
    techStack: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return value.every((tech) => typeof tech === 'string' && tech.trim().length > 0)
        },
        message: 'techStack must contain non-empty strings'
      }
    },
    githubUrl: {
      type: String,
      required: [true, 'githubUrl is required'],
      trim: true,
      validate: {
        validator(value) {
          return /^https?:\/\//i.test(value)
        },
        message: 'githubUrl must be a valid http/https URL'
      }
    },
    liveUrl: {
      type: String,
      default: '',
      trim: true,
      validate: {
        validator(value) {
          return value === '' || /^https?:\/\//i.test(value)
        },
        message: 'liveUrl must be empty or a valid http/https URL'
      }
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'description must be at most 2000 characters']
    }
  },
  { timestamps: true }
)

projectEntrySchema.index({ userId: 1, createdAt: -1 })

const ProjectEntry = mongoose.model('ProjectEntry', projectEntrySchema)

export default ProjectEntry