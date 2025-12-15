import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    
    tlgid: {
      type: String,
    },
    sum: {
      type: Number,
    },
    payedPeriodInDays: {
      type: Number,
    },
    paymentDateUTC: {
      type: Date,
    },
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Payment', PaymentSchema);

