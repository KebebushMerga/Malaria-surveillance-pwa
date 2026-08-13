import { Request, Response } from "express";
import Woreda from "../models/Woreda";
import Zone from "../models/Zone";

export const getWoredas = async (
  req: Request,
  res: Response
) => {
  try {
    const woredas = await Woreda.find({
      isActive: true,
    })
      .populate("zone", "name code")
      .sort({ name: 1 });

    return res.status(200).json({
      count: woredas.length,
      woredas,
    });
  } catch (error) {
    console.error("Get woredas error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getWoredaById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const woreda = await Woreda.findOne({
      _id: id,
      isActive: true,
    }).populate("zone", "name code");

    if (!woreda) {
      return res.status(404).json({
        message: "Woreda not found",
      });
    }

    return res.status(200).json({
      woreda,
    });
  } catch (error) {
    console.error("Get woreda error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const createWoreda = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, code, zone } = req.body;

    if (!name || !zone) {
      return res.status(400).json({
        message: "Woreda name and zone are required",
      });
    }

    const parentZone = await Zone.findOne({
      _id: zone,
      isActive: true,
    });

    if (!parentZone) {
      return res.status(404).json({
        message: "Zone not found or inactive",
      });
    }

    const existingWoreda = await Woreda.findOne({
      $or: [
        {
          name,
          zone,
        },
        ...(code ? [{ code }] : []),
      ],
    });

    if (existingWoreda) {
      return res.status(409).json({
        message: "Woreda already exists",
      });
    }

    const woreda = await Woreda.create({
      name,
      code,
      zone,
      isActive: true,
    });

    return res.status(201).json({
      message: "Woreda created successfully",
      woreda,
    });
  } catch (error) {
    console.error("Create woreda error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateWoreda = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, code, zone, isActive } = req.body;

    const woreda = await Woreda.findById(id);

    if (!woreda) {
      return res.status(404).json({
        message: "Woreda not found",
      });
    }

    if (zone !== undefined) {
      const parentZone = await Zone.findOne({
        _id: zone,
        isActive: true,
      });

      if (!parentZone) {
        return res.status(404).json({
          message: "Zone not found or inactive",
        });
      }

      woreda.zone = zone;
    }

    if (name !== undefined) {
      woreda.name = name;
    }

    if (code !== undefined) {
      woreda.code = code;
    }

    if (isActive !== undefined) {
      woreda.isActive = isActive;
    }

    await woreda.save();

    return res.status(200).json({
      message: "Woreda updated successfully",
      woreda,
    });
  } catch (error) {
    console.error("Update woreda error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};