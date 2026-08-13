import { Request, Response } from "express";
import MalariaCase from "../models/MalariaCase";
import Patient from "../models/Patient";
import { createAuditLog } from "../utils/auditLogger";
 
export const getMalariaCases = async (
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
          patientName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const cases = await MalariaCase.find(filter)
      .populate("patient")
      .populate("region")
      .populate("zone")
      .populate("woreda")
      .populate("healthFacility")
      .populate("reportedBy")
      .sort({ dateSeenAtHealthFacility: -1 });

    return res.status(200).json({
      count: cases.length,
      cases,
    });
  } catch (error) {
    console.error("Get malaria cases error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMalariaCaseById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const malariaCase = await MalariaCase.findOne({
      _id: id,
      isDeleted: false,
    })
      .populate("patient")
      .populate("region")
      .populate("zone")
      .populate("woreda")
      .populate("healthFacility")
      .populate("referredFacility")
      .populate("reportedBy");

    if (!malariaCase) {
      return res.status(404).json({
        message: "Malaria case not found",
      });
    }

    return res.status(200).json({
      malariaCase,
    });
  } catch (error) {
    console.error("Get malaria case error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const createMalariaCase = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      region,
      zone,
      woreda,
      healthFacility,
      kebele,
      patient,
      dateOfOnset,
      dateSeenAtHealthFacility,
      admissionType,
      fever,
      headache,
      jointPain,
      chillsAndRigor,
      vomiting,
      backPain,
      otherSignsAndSymptoms,
      specimenTakenForRDT,
      hemoparasiteSpecies,
      epidemiologicalWeek,
      travelHistory,
      sourceOfInfection,
      outcome,
      ftatStatus,
      referredFacility,
      comments,
    } = req.body;

    // Validate mandatory fields
    if (
      !region ||
      !zone ||
      !woreda ||
      !healthFacility ||
      !kebele ||
      !patient ||
      !dateOfOnset ||
      !dateSeenAtHealthFacility ||
      !admissionType ||
      specimenTakenForRDT === undefined ||
      !epidemiologicalWeek ||
      !outcome
    ) {
      return res.status(400).json({
        message: "All mandatory malaria case fields are required",
      });
    }

    // Validate dates
    const onsetDate = new Date(dateOfOnset);
    const seenDate = new Date(dateSeenAtHealthFacility);

    if (
      Number.isNaN(onsetDate.getTime()) ||
      Number.isNaN(seenDate.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    // Validate admission type
    if (!["OPD", "IPD"].includes(admissionType)) {
      return res.status(400).json({
        message: "Admission type must be OPD or IPD",
      });
    }

    // Validate epidemiological week
    if (
      typeof epidemiologicalWeek !== "number" ||
      epidemiologicalWeek < 1 ||
      epidemiologicalWeek > 53
    ) {
      return res.status(400).json({
        message:
          "Epidemiological week must be between 1 and 53",
      });
    }

    // Find patient
    const existingPatient = await Patient.findOne({
      _id: patient,
      isDeleted: false,
    });

    if (!existingPatient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    // Use patient data as the source for patient information
    const malariaCase = await MalariaCase.create({
      region,
      zone,
      woreda,
      healthFacility,
      kebele,

      patient: existingPatient._id,

      patientName: existingPatient.fullName,
      patientCode: existingPatient.patientCode,
      sex: existingPatient.sex,
      age: existingPatient.age,
      ageCategory: existingPatient.ageCategory,
      houseNumber: existingPatient.houseNumber,
      mobileNumber: existingPatient.mobileNumber,

      dateOfOnset: onsetDate,
      dateSeenAtHealthFacility: seenDate,
      admissionType,

      fever: fever ?? false,
      headache: headache ?? false,
      jointPain: jointPain ?? false,
      chillsAndRigor: chillsAndRigor ?? false,
      vomiting: vomiting ?? false,
      backPain: backPain ?? false,
      otherSignsAndSymptoms,

      specimenTakenForRDT,
      hemoparasiteSpecies,

      epidemiologicalWeek,
      travelHistory,
      sourceOfInfection,

      outcome,
      ftatStatus,
      referredFacility,
      comments,

      reportedBy: (req as any).user.userId,
      isDeleted: false,
    });

    await createAuditLog({
  userId: (req as any).user.userId,
  action: "CREATE",
  entity: "MalariaCase",
  entityId: malariaCase._id.toString(),
});

    return res.status(201).json({
      message: "Malaria case created successfully",
      malariaCase,
    });
  } catch (error) {
    console.error("Create malaria case error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
  
};
export const updateMalariaCase = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const malariaCase = await MalariaCase.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!malariaCase) {
      return res.status(404).json({
        message: "Malaria case not found",
      });
    }

    const {
      region,
      zone,
      woreda,
      healthFacility,
      kebele,
      patient,
      dateOfOnset,
      dateSeenAtHealthFacility,
      admissionType,
      fever,
      headache,
      jointPain,
      chillsAndRigor,
      vomiting,
      backPain,
      otherSignsAndSymptoms,
      specimenTakenForRDT,
      hemoparasiteSpecies,
      epidemiologicalWeek,
      travelHistory,
      sourceOfInfection,
      outcome,
      ftatStatus,
      referredFacility,
      comments,
    } = req.body;

    if (patient !== undefined) {
      const existingPatient = await Patient.findOne({
        _id: patient,
        isDeleted: false,
      });

      if (!existingPatient) {
        return res.status(404).json({
          message: "Patient not found",
        });
      }

      malariaCase.patient = existingPatient._id;
      malariaCase.patientName = existingPatient.fullName;
      malariaCase.patientCode = existingPatient.patientCode;
      malariaCase.sex = existingPatient.sex;
      malariaCase.age = existingPatient.age;
      malariaCase.ageCategory = existingPatient.ageCategory;
      malariaCase.houseNumber = existingPatient.houseNumber;
      malariaCase.mobileNumber = existingPatient.mobileNumber;
    }

    if (region !== undefined) malariaCase.region = region;
    if (zone !== undefined) malariaCase.zone = zone;
    if (woreda !== undefined) malariaCase.woreda = woreda;
    if (healthFacility !== undefined) {
      malariaCase.healthFacility = healthFacility;
    }
    if (kebele !== undefined) malariaCase.kebele = kebele;

    if (dateOfOnset !== undefined) {
      const date = new Date(dateOfOnset);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          message: "Invalid dateOfOnset",
        });
      }

      malariaCase.dateOfOnset = date;
    }

    if (dateSeenAtHealthFacility !== undefined) {
      const date = new Date(dateSeenAtHealthFacility);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          message: "Invalid dateSeenAtHealthFacility",
        });
      }

      malariaCase.dateSeenAtHealthFacility = date;
    }

    if (admissionType !== undefined) {
      if (!["OPD", "IPD"].includes(admissionType)) {
        return res.status(400).json({
          message: "Admission type must be OPD or IPD",
        });
      }

      malariaCase.admissionType = admissionType;
    }

    if (fever !== undefined) malariaCase.fever = fever;
    if (headache !== undefined) malariaCase.headache = headache;
    if (jointPain !== undefined) malariaCase.jointPain = jointPain;
    if (chillsAndRigor !== undefined) {
      malariaCase.chillsAndRigor = chillsAndRigor;
    }
    if (vomiting !== undefined) malariaCase.vomiting = vomiting;
    if (backPain !== undefined) malariaCase.backPain = backPain;

    if (otherSignsAndSymptoms !== undefined) {
      malariaCase.otherSignsAndSymptoms = otherSignsAndSymptoms;
    }

    if (specimenTakenForRDT !== undefined) {
      malariaCase.specimenTakenForRDT = specimenTakenForRDT;
    }

    if (hemoparasiteSpecies !== undefined) {
      malariaCase.hemoparasiteSpecies = hemoparasiteSpecies;
    }

    if (epidemiologicalWeek !== undefined) {
      if (
        typeof epidemiologicalWeek !== "number" ||
        epidemiologicalWeek < 1 ||
        epidemiologicalWeek > 53
      ) {
        return res.status(400).json({
          message:
            "Epidemiological week must be between 1 and 53",
        });
      }

      malariaCase.epidemiologicalWeek = epidemiologicalWeek;
    }

    if (travelHistory !== undefined) {
      malariaCase.travelHistory = travelHistory;
    }

    if (sourceOfInfection !== undefined) {
      malariaCase.sourceOfInfection = sourceOfInfection;
    }

    if (outcome !== undefined) {
      malariaCase.outcome = outcome;
    }

    if (ftatStatus !== undefined) {
      malariaCase.ftatStatus = ftatStatus;
    }

    if (referredFacility !== undefined) {
      malariaCase.referredFacility = referredFacility;
    }

    if (comments !== undefined) {
      malariaCase.comments = comments;
    }

    await malariaCase.save();

    await createAuditLog({
  userId: (req as any).user.userId,
  action: "UPDATE",
  entity: "MalariaCase",
  entityId: malariaCase._id.toString(),
});

    return res.status(200).json({
      message: "Malaria case updated successfully",
      malariaCase,
    });
  } catch (error) {
    console.error("Update malaria case error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteMalariaCase = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const malariaCase = await MalariaCase.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!malariaCase) {
      return res.status(404).json({
        message: "Malaria case not found",
      });
    }

    malariaCase.isDeleted = true;

    await malariaCase.save();

    await createAuditLog({
  userId: (req as any).user.userId,
  action: "DELETE",
  entity: "MalariaCase",
  entityId: malariaCase._id.toString(),
});

    return res.status(200).json({
      message: "Malaria case deleted successfully",
    });
  } catch (error) {
    console.error("Delete malaria case error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};