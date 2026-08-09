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

    // 5. Create/find all required roles
const roleDefinitions = [
  {
    name: "Facility User",
    description: "Authorized health facility user",
  },
  {
    name: "District Admin",
    description: "Administrator responsible for district-level surveillance",
  },
  {
    name: "Zone Admin",
    description: "Administrator responsible for zone-level surveillance",
  },
  {
    name: "Regional Admin",
    description: "Administrator responsible for regional-level surveillance",
  },
  {
    name: "System Admin",
    description: "Administrator with system-level access",
  },
] as const;

const roles: Record<string, any> = {};

for (const roleDefinition of roleDefinitions) {
  let role = await Role.findOne({
    name: roleDefinition.name,
  });

  if (!role) {
    role = await Role.create(roleDefinition);
    console.log(`${roleDefinition.name} role created`);
  }

  roles[roleDefinition.name] = role;
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
        role: roles["Facility User"]._id,
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

    // 7. Create development System Admin
const existingSystemAdmin = await User.findOne({
  email: "sysadmin@malaria.local",
});

if (existingSystemAdmin) {
  console.log("Development System Admin already exists");
} else {
  const hashedAdminPassword = await bcrypt.hash(
    "AdminPassword123!",
    10
  );

  const systemAdmin = await User.create({
    name: "Development System Admin",
    email: "sysadmin@malaria.local",
    password: hashedAdminPassword,
    role: roles["System Admin"]._id,
    facility: facility._id,
    isActive: true,
  });

  console.log("Development System Admin created:");
  console.log({
    id: systemAdmin._id.toString(),
    email: systemAdmin.email,
    role: "System Admin",
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