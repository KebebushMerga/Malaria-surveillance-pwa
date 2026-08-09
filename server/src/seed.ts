import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import Region from "./models/Region";
import Zone from "./models/Zone";
import Woreda from "./models/Woreda";
import HealthFacility from "./models/HealthFacility";
import Role from "./models/Role";
import User from "./models/User";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    console.log("MongoDB connected");

    // 1. Create/find Region
    let region = await Region.findOne({
      name: "Development Region",
    });

    if (!region) {
      region = await Region.create({
        name: "Development Region",
        code: "DEV-REG",
        isActive: true,
      });

      console.log("Development region created");
    }

    // 2. Create/find Zone
    let zone = await Zone.findOne({
      name: "Development Zone",
      region: region._id,
    });

    if (!zone) {
      zone = await Zone.create({
        name: "Development Zone",
        code: "DEV-ZONE",
        region: region._id,
        isActive: true,
      });

      console.log("Development zone created");
    }

    // 3. Create/find Woreda
    let woreda = await Woreda.findOne({
      name: "Development Woreda",
      zone: zone._id,
    });

    if (!woreda) {
      woreda = await Woreda.create({
        name: "Development Woreda",
        code: "DEV-WOREDA",
        zone: zone._id,
        isActive: true,
      });

      console.log("Development woreda created");
    }

    // 4. Create/find Health Facility
    let facility = await HealthFacility.findOne({
      name: "Development Health Facility",
    });

    if (!facility) {
      facility = await HealthFacility.create({
        name: "Development Health Facility",
        code: "DEV-HF-001",
        woreda: woreda._id,
        address: "Development Address",
        phone: "0000000000",
        isActive: true,
      });

      console.log("Development health facility created");
    }

    // 5. Create/find Facility User role
    let role = await Role.findOne({
      name: "Facility User",
    });

    if (!role) {
      role = await Role.create({
        name: "Facility User",
        description: "Authorized health facility user",
      });

      console.log("Facility User role created");
    }

    // 6. Create development user
    const existingUser = await User.findOne({
      email: "devuser@malaria.local",
    });

    if (existingUser) {
      console.log("Development user already exists");
    } else {
      const hashedPassword = await bcrypt.hash(
        "DevPassword123!",
        10
      );

      const user = await User.create({
        name: "Development User",
        email: "devuser@malaria.local",
        password: hashedPassword,
        role: role._id,
        facility: facility._id,
        isActive: true,
      });

      console.log("Development user created:");
      console.log({
        id: user._id.toString(),
        email: user.email,
        role: "Facility User",
        facility: facility.name,
      });
    }

    console.log("Seed completed successfully");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);

    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();