import mongoose, { Document, Schema } from "mongoose";

export interface IZone extends Document {
  name: string;
  code?: string;
  region: mongoose.Types.ObjectId;
  isActive: boolean;
}

const zoneSchema = new Schema<IZone>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      trim: true,
    },

    region: {
      type: Schema.Types.ObjectId,
      ref: "Region",
      required: true,
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

const Zone = mongoose.model<IZone>("Zone", zoneSchema);

export default Zone;