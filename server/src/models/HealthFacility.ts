import mongoose, { Document, Schema } from "mongoose";

export interface IHealthFacility extends Document {
  name: string;
  code?: string;
  woreda: mongoose.Types.ObjectId;
  address?: string;
  phone?: string;
  isActive: boolean;
}

const healthFacilitySchema = new Schema<IHealthFacility>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    woreda: {
      type: Schema.Types.ObjectId,
      ref: "Woreda",
      required: true,
    },

    address: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const HealthFacility = mongoose.model<IHealthFacility>(
  "HealthFacility",
  healthFacilitySchema
);

export default HealthFacility;