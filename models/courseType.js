import mongoose from 'mongoose';

const CourseTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      
    },
    description: {
      type: String,
    },
    orderNumber: {
      type: Number
    },
    color: {
      type:String
    }
      
  
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('CourseType', CourseTypeSchema);

