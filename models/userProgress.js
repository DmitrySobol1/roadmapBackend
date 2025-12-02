import mongoose from 'mongoose';

const UserProgressSchema = new mongoose.Schema(
  {
    linkToUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
    linkToLesson: {
      type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
    },
    isLearned: {
      type: Boolean,
    },
    tlgid: {
      type: String,
    },
       
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('UserProgress', UserProgressSchema);

