import { Request, Response } from "express";
import Patient from "../models/Patient";
import MalariaCase from "../models/MalariaCase";
import { createAuditLog } from "../utils/auditLogger";

export const getPatients = async (
  req: Request,
  res: Response
) => {
  try {
    const { search } = req.query;

    const filter: any = {
      isDeleted: false,
    };

    if (search) {
      filter.$or = [
        {
          patientCode: {
            $regex: search,
            $options: "i",
          },
        },
        {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          mobileNumber: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const patients = await Patient.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("Get patients error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getPatientById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    const malariaCases = await MalariaCase.find({
      patient: patient._id,
      isDeleted: false,
    }).sort({
      dateSeenAtHealthFacility: -1,
    });

    return res.status(200).json({
      patient,
      malariaCaseHistory: malariaCases,
    });
  } catch (error) {
    console.error("Get patient details error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const createPatient = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      patientCode,
      fullName,
      sex,
      age,
      ageCategory,
      houseNumber,
      mobileNumber,
      kebele,
    } = req.body;

    if (
      !patientCode ||
      !fullName ||
      !sex ||
      age === undefined ||
      !ageCategory ||
      !kebele
    ) {
      return res.status(400).json({
        message:
          "Patient code, full name, sex, age, age category, and kebele are required",
      });
    }

    const existingPatient = await Patient.findOne({
      patientCode,
      isDeleted: false,
    });

    if (existingPatient) {
      return res.status(409).json({
        message: "Patient code already exists",
      });
    }

    const patient = await Patient.create({
      patientCode,
      fullName,
      sex,
      age,
      ageCategory,
      houseNumber,
      mobileNumber,
      kebele,
      isDeleted: false,
    });

    await createAuditLog({
  userId: (req as any).user.userId,
  action: "CREATE",
  entity: "Patient",
  entityId: patient._id.toString(),
});

    return res.status(201).json({
      message: "Patient registered successfully",
      patient,
    });
  } catch (error) {
    console.error("Register patient error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updatePatient = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      fullName,
      sex,
      age,
      ageCategory,
      houseNumber,
      mobileNumber,
      kebele,
    } = req.body;

    const patient = await Patient.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    if (fullName !== undefined) {
      patient.fullName = fullName;
    }

    if (sex !== undefined) {
      patient.sex = sex;
    }

    if (age !== undefined) {
      patient.age = age;
    }

    if (ageCategory !== undefined) {
      patient.ageCategory = ageCategory;
    }

    if (houseNumber !== undefined) {
      patient.houseNumber = houseNumber;
    }

    if (mobileNumber !== undefined) {
      patient.mobileNumber = mobileNumber;
    }

    if (kebele !== undefined) {
      patient.kebele = kebele;
    }

    await patient.save();

    await createAuditLog({
  userId: (req as any).user.userId,
  action: "UPDATE",
  entity: "Patient",
  entityId: patient._id.toString(),
});

    return res.status(200).json({
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    console.error("Update patient error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deletePatient = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    patient.isDeleted = true;

    await patient.save();

    await createAuditLog({
  userId: (req as any).user.userId,
  action: "DELETE",
  entity: "Patient",
  entityId: patient._id.toString(),
});

    return res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error("Delete patient error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};