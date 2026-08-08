import mongoose, { Document, Schema } from "mongoose";

export interface IWoreda extends Document {
  name: string;
  code?: string;
  zone: mongoose.Types.ObjectId;
  isActive: boolean;
}

const woredaSchema = new Schema<IWoreda>(
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

    zone: {
      type: Schema.Types.ObjectId,
      ref: "Zone",
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

const Woreda = mongoose.model<IWoreda>("Woreda", woredaSchema);

export default Woreda;