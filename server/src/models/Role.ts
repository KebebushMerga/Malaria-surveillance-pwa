import mongoose, { Document, Schema } from "mongoose";

export type RoleName =
  | "Facility User"
  | "District Admin"
  | "Zone Admin"
  | "Regional Admin"
  | "System Admin";

export interface IRole extends Document {
  name: RoleName;
  description?: string;
}

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "Facility User",
        "District Admin",
        "Zone Admin",
        "Regional Admin",
        "System Admin",
      ],
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model<IRole>("Role", roleSchema);

export default Role;