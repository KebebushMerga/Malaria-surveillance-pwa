import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
import { createAuditLog } from "../utils/auditLogger";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email }).populate("role");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check account status
    if (!user.isActive) {
      return res.status(403).json({
        message: "User account is inactive",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Get role name
    const role = user.role as any;

    // Generate JWT
    const token = generateToken({
      userId: user._id.toString(),
      role: role.name,
    });

    await createAuditLog({
  userId: user._id.toString(),
  action: "LOGIN",
  entity: "Authentication",
});

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role.name,
        facility: user.facility,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    await createAuditLog({
      userId,
      action: "LOGOUT",
      entity: "Authentication",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};