import { Request, Response } from "express";
import Zone from "../models/Zone";
import Region from "../models/Region";

export const getZones = async (
  req: Request,
  res: Response
) => {
  try {
    const zones = await Zone.find({
      isActive: true,
    })
      .populate("region", "name code")
      .sort({ name: 1 });

    return res.status(200).json({
      count: zones.length,
      zones,
    });
  } catch (error) {
    console.error("Get zones error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getZoneById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const zone = await Zone.findOne({
      _id: id,
      isActive: true,
    }).populate("region", "name code");

    if (!zone) {
      return res.status(404).json({
        message: "Zone not found",
      });
    }

    return res.status(200).json({
      zone,
    });
  } catch (error) {
    console.error("Get zone error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const createZone = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, code, region } = req.body;

    if (!name || !region) {
      return res.status(400).json({
        message: "Zone name and region are required",
      });
    }

    const parentRegion = await Region.findOne({
      _id: region,
      isActive: true,
    });

    if (!parentRegion) {
      return res.status(404).json({
        message: "Region not found or inactive",
      });
    }

    const existingZone = await Zone.findOne({
      $or: [
        {
          name,
          region,
        },
        ...(code ? [{ code }] : []),
      ],
    });

    if (existingZone) {
      return res.status(409).json({
        message: "Zone already exists",
      });
    }

    const zone = await Zone.create({
      name,
      code,
      region,
      isActive: true,
    });

    return res.status(201).json({
      message: "Zone created successfully",
      zone,
    });
  } catch (error) {
    console.error("Create zone error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateZone = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, code, region, isActive } = req.body;

    const zone = await Zone.findById(id);

    if (!zone) {
      return res.status(404).json({
        message: "Zone not found",
      });
    }

    if (region !== undefined) {
      const parentRegion = await Region.findOne({
        _id: region,
        isActive: true,
      });

      if (!parentRegion) {
        return res.status(404).json({
          message: "Region not found or inactive",
        });
      }

      zone.region = region;
    }

    if (name !== undefined) {
      zone.name = name;
    }

    if (code !== undefined) {
      zone.code = code;
    }

    if (isActive !== undefined) {
      zone.isActive = isActive;
    }

    await zone.save();

    return res.status(200).json({
      message: "Zone updated successfully",
      zone,
    });
  } catch (error) {
    console.error("Update zone error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};