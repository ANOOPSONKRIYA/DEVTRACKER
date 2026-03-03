import mongoose from 'mongoose'

const dsaEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      index: true
    },
    problemName: {
      type: String,
      required: [true, 'problemName is required'],
      trim: true,
      minlength: [2, 'problemName must be at least 2 characters'],
      maxlength: [250, 'problemName must be at most 250 characters']
    },
    platform: {
      type: String,
      required: [true, 'platform is required'],
      trim: true,
      enum: {
        values: ['LeetCode', 'HackerRank', 'Codeforces', 'CodeChef', 'GeeksforGeeks', 'Other'],
        message: 'platform is invalid'
      }
    },
    difficulty: {
      type: String,
      required: [true, 'difficulty is required'],
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: 'difficulty must be Easy, Medium, or Hard'
      }
    },
    status: {
      type: String,
      required: [true, 'status is required'],
      enum: {
        values: ['Not Started', 'In Progress', 'Solved', 'Revisit'],
        message: 'status is invalid'
      }
    },
    notes: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'notes must be at most 1000 characters']
    }
  },
  { timestamps: true }
)

dsaEntrySchema.index({ userId: 1, createdAt: -1 })

const DSAEntry = mongoose.model('DSAEntry', dsaEntrySchema)

export default DSAEntry