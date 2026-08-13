import { Request, Response } from "express";
import Region from "../models/Region";

export const getRegions = async (
  req: Request,
  res: Response
) => {
  try {
    const regions = await Region.find({
      isActive: true,
    }).sort({ name: 1 });

    return res.status(200).json({
      count: regions.length,
      regions,
    });
  } catch (error) {
    console.error("Get regions error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getRegionById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const region = await Region.findOne({
      _id: id,
      isActive: true,
    });

    if (!region) {
      return res.status(404).json({
        message: "Region not found",
      });
    }

    return res.status(200).json({
      region,
    });
  } catch (error) {
    console.error("Get region error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const createRegion = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, code } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Region name is required",
      });
    }

    const existingRegion = await Region.findOne({
      $or: [
        { name },
        ...(code ? [{ code }] : []),
      ],
    });

    if (existingRegion) {
      return res.status(409).json({
        message: "Region already exists",
      });
    }

    const region = await Region.create({
      name,
      code,
      isActive: true,
    });

    return res.status(201).json({
      message: "Region created successfully",
      region,
    });
  } catch (error) {
    console.error("Create region error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateRegion = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, code, isActive } = req.body;

    const region = await Region.findById(id);

    if (!region) {
      return res.status(404).json({
        message: "Region not found",
      });
    }

    if (name !== undefined) {
      region.name = name;
    }

    if (code !== undefined) {
      region.code = code;
    }

    if (isActive !== undefined) {
      region.isActive = isActive;
    }

    await region.save();

    return res.status(200).json({
      message: "Region updated successfully",
      region,
    });
  } catch (error) {
    console.error("Update region error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};