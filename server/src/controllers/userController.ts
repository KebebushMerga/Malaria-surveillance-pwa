import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { createAuditLog } from "../utils/auditLogger";

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      role,
      facility,
    } = req.body;

    if (!name || !email || !password || !role || !facility) {
      return res.status(400).json({
        message:
          "Name, email, password, role, and facility are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      facility,
      isActive: true,
    });

    await createAuditLog({
      userId: (req as any).user.userId,
      action: "CREATE",
      entity: "User",
      entityId: user._id.toString(),
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        facility: user.facility,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("role")
      .populate("facility");

    return res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-password")
      .populate("role")
      .populate("facility");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      password,
      role,
      facility,
      isActive,
    } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "A user with this email already exists",
        });
      }

      user.email = email.toLowerCase();
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (role !== undefined) {
      user.role = role;
    }

    if (facility !== undefined) {
      user.facility = facility;
    }

    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 12);
    }

    await user.save();

    await createAuditLog({
      userId: (req as any).user.userId,
      action: "UPDATE",
      entity: "User",
      entityId: user._id.toString(),
    });

    return res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        facility: user.facility,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deactivateUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isActive = false;

    await user.save();

    await createAuditLog({
      userId: (req as any).user.userId,
      action: "DEACTIVATE",
      entity: "User",
      entityId: user._id.toString(),
    });

    return res.status(200).json({
      message: "User deactivated successfully",
    });
  } catch (error) {
    console.error("Deactivate user error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};