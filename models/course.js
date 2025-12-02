import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
  {
    type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseType'
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
    access: {
    type: String,
    enum: ['free', 'payment'],
    default: 'payment'  // опционально
},
orderNumber: {
  type: Number
}
    
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Course', CourseSchema);

