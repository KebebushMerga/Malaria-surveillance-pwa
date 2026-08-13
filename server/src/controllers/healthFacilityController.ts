import { Request, Response } from "express";
import HealthFacility from "../models/HealthFacility";
import { createAuditLog } from "../utils/auditLogger";

export const getHealthFacilities = async (
  req: Request,
  res: Response
) => {
  try {
    const facilities = await HealthFacility.find({
      isActive: true,
    })
      .populate("woreda", "name code")
      .sort({ name: 1 });

    return res.status(200).json({
      count: facilities.length,
      facilities,
    });
  } catch (error) {
    console.error("Get health facilities error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getHealthFacilityById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const facility = await HealthFacility.findOne({
      _id: id,
      isActive: true,
    }).populate("woreda", "name code");

    if (!facility) {
      return res.status(404).json({
        message: "Health facility not found",
      });
    }

    return res.status(200).json({
      facility,
    });
  } catch (error) {
    console.error("Get health facility error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const createHealthFacility = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      code,
      woreda,
      address,
      phone,
    } = req.body;

    if (!name || !woreda) {
      return res.status(400).json({
        message: "Name and woreda are required",
      });
    }

    const existingFacility = await HealthFacility.findOne({
      $or: [
        { name },
        ...(code ? [{ code }] : []),
      ],
    });

    if (existingFacility) {
      return res.status(409).json({
        message: "Health facility already exists",
      });
    }

    const facility = await HealthFacility.create({
      name,
      code,
      woreda,
      address,
      phone,
      isActive: true,
    });

    await createAuditLog({
      userId: (req as any).user.userId,
      action: "CREATE",
      entity: "HealthFacility",
      entityId: facility._id.toString(),
    });

    return res.status(201).json({
      message: "Health facility created successfully",
      facility,
    });
  } catch (error) {
    console.error("Create health facility error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateHealthFacility = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      name,
      code,
      woreda,
      address,
      phone,
      isActive,
    } = req.body;

    const facility = await HealthFacility.findById(id);

    if (!facility) {
      return res.status(404).json({
        message: "Health facility not found",
      });
    }

    if (name !== undefined) facility.name = name;
    if (code !== undefined) facility.code = code;
    if (woreda !== undefined) facility.woreda = woreda;
    if (address !== undefined) facility.address = address;
    if (phone !== undefined) facility.phone = phone;
    if (isActive !== undefined) facility.isActive = isActive;

    await facility.save();

    await createAuditLog({
      userId: (req as any).user.userId,
      action: "UPDATE",
      entity: "HealthFacility",
      entityId: facility._id.toString(),
    });

    return res.status(200).json({
      message: "Health facility updated successfully",
      facility,
    });
  } catch (error) {
    console.error("Update health facility error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteHealthFacility = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const facility = await HealthFacility.findById(id);

    if (!facility) {
      return res.status(404).json({
        message: "Health facility not found",
      });
    }

    facility.isActive = false;

    await facility.save();

    await createAuditLog({
      userId: (req as any).user.userId,
      action: "DEACTIVATE",
      entity: "HealthFacility",
      entityId: facility._id.toString(),
    });

    return res.status(200).json({
      message: "Health facility deactivated successfully",
    });
  } catch (error) {
    console.error("Delete health facility error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};