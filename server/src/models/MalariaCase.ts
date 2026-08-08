import mongoose, { Document, Schema } from "mongoose";

export type Sex = "Male" | "Female";

export type AdmissionType = "OPD" | "IPD";

export interface IMalariaCase extends Document {
  region: mongoose.Types.ObjectId;
  zone: mongoose.Types.ObjectId;
  woreda: mongoose.Types.ObjectId;
  healthFacility: mongoose.Types.ObjectId;
  kebele: string;

  patient: mongoose.Types.ObjectId;

  patientName: string;
  patientCode: string;
  sex: Sex;
  age: number;
  ageCategory: string;
  houseNumber?: string;
  mobileNumber?: string;

  dateOfOnset: Date;
  dateSeenAtHealthFacility: Date;
  admissionType: AdmissionType;

  fever: boolean;
  headache: boolean;
  jointPain: boolean;
  chillsAndRigor: boolean;
  vomiting: boolean;
  backPain: boolean;
  otherSignsAndSymptoms?: string;

  specimenTakenForRDT: boolean;
  hemoparasiteSpecies?: string;

  epidemiologicalWeek: number;
  travelHistory?: string;
  sourceOfInfection?: string;

  outcome: string;
  ftatStatus?: string;
  referredFacility?: mongoose.Types.ObjectId;
  comments?: string;

  reportedBy: mongoose.Types.ObjectId;
  isDeleted: boolean;
}

const malariaCaseSchema = new Schema<IMalariaCase>(
  {
    // Administrative Information
    region: {
      type: Schema.Types.ObjectId,
      ref: "Region",
      required: true,
    },

    zone: {
      type: Schema.Types.ObjectId,
      ref: "Zone",
      required: true,
    },

    woreda: {
      type: Schema.Types.ObjectId,
      ref: "Woreda",
      required: true,
    },

    healthFacility: {
      type: Schema.Types.ObjectId,
      ref: "HealthFacility",
      required: true,
    },

    kebele: {
      type: String,
      required: true,
      trim: true,
    },

    // Patient Information
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    patientCode: {
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

    // Clinical Information
    dateOfOnset: {
      type: Date,
      required: true,
    },

    dateSeenAtHealthFacility: {
      type: Date,
      required: true,
    },

    admissionType: {
      type: String,
      required: true,
      enum: ["OPD", "IPD"],
    },

    fever: {
      type: Boolean,
      default: false,
    },

    headache: {
      type: Boolean,
      default: false,
    },

    jointPain: {
      type: Boolean,
      default: false,
    },

    chillsAndRigor: {
      type: Boolean,
      default: false,
    },

    vomiting: {
      type: Boolean,
      default: false,
    },

    backPain: {
      type: Boolean,
      default: false,
    },

    otherSignsAndSymptoms: {
      type: String,
      trim: true,
    },

    // Laboratory Information
    specimenTakenForRDT: {
      type: Boolean,
      required: true,
    },

    hemoparasiteSpecies: {
      type: String,
      trim: true,
    },

    // Epidemiological Information
    epidemiologicalWeek: {
      type: Number,
      required: true,
      min: 1,
      max: 53,
    },

    travelHistory: {
      type: String,
      trim: true,
    },

    sourceOfInfection: {
      type: String,
      trim: true,
    },

    // Outcome Information
    outcome: {
      type: String,
      required: true,
      trim: true,
    },

    ftatStatus: {
      type: String,
      trim: true,
    },

    referredFacility: {
      type: Schema.Types.ObjectId,
      ref: "HealthFacility",
    },

    comments: {
      type: String,
      trim: true,
    },

    // User who submitted the record
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Soft deletion
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const MalariaCase = mongoose.model<IMalariaCase>(
  "MalariaCase",
  malariaCaseSchema
);

export default MalariaCase;