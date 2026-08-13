import AuditLog from "../models/AuditLog";

interface CreateAuditLogParams {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
}

export const createAuditLog = async ({
  userId,
  action,
  entity,
  entityId,
}: CreateAuditLogParams): Promise<void> => {
  try {
    await AuditLog.create({
      user: userId,
      action,
      entity,
      entityId,
    });
  } catch (error) {
    console.error("Audit log creation failed:", error);
  }
};