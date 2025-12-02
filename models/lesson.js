import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema(
  {
    linkToCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
},
    name: {
      type: String,
    },
    shortDescription: {
      type: String,
    },
    longDescription: {
      type: String,
    },
    urlToFile: {
    type: String,
},
numberInListLessons: {
    type:Number
},
access: {
    type: String,
    enum: ['free', 'payment'],
    default: 'payment'  // опционально
},

    
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Lesson', LessonSchema);

