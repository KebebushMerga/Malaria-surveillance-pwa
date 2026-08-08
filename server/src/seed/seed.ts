import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import Role from "../models/Role";
import User from "../models/User";

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected for seeding");

    // 1. Create roles
    const roles = [
      {
        name: "Facility User",
        description: "Health facility staff who manage malaria line list data.",
      },
      {
        name: "District Admin",
        description: "Administrator responsible for district-level surveillance.",
      },
      {
        name: "Zone Admin",
        description: "Administrator responsible for zone-level surveillance.",
      },
      {
        name: "Regional Admin",
        description: "Administrator responsible for regional surveillance.",
      },
      {
        name: "System Admin",
        description: "System administrator with full system access.",
      },
    ];

    for (const roleData of roles) {
      await Role.findOneAndUpdate(
        { name: roleData.name },
        roleData,
        { upsert: true, new: true }
      );
    }

    console.log("Roles created/verified");

    // 2. Get Facility User role
    const facilityRole = await Role.findOne({
      name: "Facility User",
    });

    if (!facilityRole) {
      throw new Error("Facility User role was not created");
    }

    // 3. Create development user
    const existingUser = await User.findOne({
      username: "facility_test",
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(
        "TestPassword123!",
        10
      );

      await User.create({
        name: "Test Facility User",
        username: "facility_test",
        password: hashedPassword,
        role: facilityRole._id,
        isActive: true,
      });

      console.log("Development user created");
    } else {
      console.log("Development user already exists");
    }

    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seed();