import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    shortDescription: {
      type: String,
    },
    longDescription: {
      type: String,
    },
    text1: {
      type: String,
    },
    text2: {
      type: String,
    },
    orderNumber: {
      type: Number,
    },

    
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Stock', StockSchema);

