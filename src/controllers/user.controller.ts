// src/controllers/user.controller.ts

import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";
import * as userService from "../services/user.service";

// ---- نوع params لكل الدوال يلي فيها id ----
interface ReqParamsId {
  id: string;
}

// ---- إنشاء مستخدم جديد ----
export const createUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  }
);

// ---- جلب جميع المستخدمين مع فلترة + صفحة ----
export const getUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await userService.getUsers(req.query);
    res.status(200).json({ success: true, count: users.length, data: users });
  }
);

// ---- جلب مستخدم بواسطة ID ----
export const getUserById = asyncHandler(
  async (req: Request<ReqParamsId>, res: Response) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) throw new AppError("User not found", 404);
    res.status(200).json({ success: true, data: user });
  }
);

// ---- تحديث مستخدم بواسطة ID ----
export const updateUser = asyncHandler(
  async (req: Request<ReqParamsId>, res: Response) => {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) throw new AppError("User not found", 404);
    res.status(200).json({ success: true, data: user });
  }
);

// ---- حذف مستخدم بواسطة ID ----
export const deleteUser = asyncHandler(
  async (req: Request<ReqParamsId>, res: Response) => {
    const user = await userService.deleteUser(req.params.id);
    if (!user) throw new AppError("User not found", 404);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  }
);
