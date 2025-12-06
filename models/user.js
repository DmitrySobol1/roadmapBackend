import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    tlgid: {
      type: Number,
      required: true,
      unique: true,
    },
    jbid: {
      type: Number,
    },
    name: {
      type: String,
    },
    isPayed: {
      type: Boolean,
      default:false
    },
    dateTillPayed: {
      type: Date,
      default: null
    },
    isOnboarded: {
      type: Boolean,
      default:false
    },
    
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', UserSchema);

