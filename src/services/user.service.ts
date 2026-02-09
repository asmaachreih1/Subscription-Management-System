import User, { IUser } from "../models/user.model"; // import الموديل
import ApiFeatures from "../utils/ApiFeatures";

// ---- إنشاء مستخدم ----
export const createUser = async (data: Partial<IUser>) => {
  return await User.create(data);
};

// ---- جلب جميع المستخدمين مع فلترة + ترتيب + pagination ----
export const getUsers = async (query: any) => {
  const features = new ApiFeatures<IUser>(User, query)
    .filter()
    .sort()
    .paginate();

  return await features.query;
};

// ---- جلب مستخدم بواسطة ID ----
export const getUserById = async (id: string) => {
  return await User.findById(id);
};

// ---- تحديث مستخدم بواسطة ID ----
export const updateUser = async (id: string, data: Partial<IUser>) => {
  return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

// ---- حذف مستخدم بواسطة ID ----
export const deleteUser = async (id: string) => {
  return await User.findByIdAndDelete(id);
};
