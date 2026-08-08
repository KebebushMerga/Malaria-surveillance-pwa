import mongoose, { Document, Schema } from "mongoose";

export type Sex = "Male" | "Female";

export interface IPatient extends Document {
  patientCode: string;
  fullName: string;
  sex: Sex;
  age: number;
  ageCategory: string;
  houseNumber?: string;
  mobileNumber?: string;
  kebele: string;
  isDeleted: boolean;
}

const patientSchema = new Schema<IPatient>(
  {
    patientCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    sex: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },

    age: {
      type: Number,
      required: true,
      min: 0,
    },

    ageCategory: {
      type: String,
      required: true,
      trim: true,
    },

    houseNumber: {
      type: String,
      trim: true,
    },

    mobileNumber: {
      type: String,
      trim: true,
    },

    kebele: {
      type: String,
      required: true,
      trim: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model<IPatient>("Patient", patientSchema);

export default Patient;