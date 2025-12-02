import mongoose from 'mongoose';

const UserFavoriteLessonsSchema = new mongoose.Schema(
  {
    linkToUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
    linkToLesson: {
      type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
    },
    isFavorite: {
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

export default mongoose.model('UserFavoriteLessons', UserFavoriteLessonsSchema);

