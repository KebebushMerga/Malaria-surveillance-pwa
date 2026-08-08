import mongoose, { Document, Schema } from "mongoose";

export interface IRegion extends Document {
  name: string;
  code?: string;
  isActive: boolean;
}

const regionSchema = new Schema<IRegion>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    code: {
      type: String,
      unique: true,
      sparse: true,
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

const Region = mongoose.model<IRegion>("Region", regionSchema);

export default Region;