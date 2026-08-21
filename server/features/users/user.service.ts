import { UserRepository } from "./user.repository";
import { ApiError } from "../../utils/ApiError";
import logger from "../../utils/logger";
import { IUser } from "./user.model";

// Use our decoupled 'repo' variable instead of the hardcoded class
const repo = new UserRepository();

export class UserService {
  // 1. REGISTER USER SERVICE
  static async registerUser(userData: Partial<IUser>): Promise<IUser> {
    const phone = userData.contactDetails?.phone;

    if (!phone) {
      logger.error("Registration failed: Missing phone number in payload");
      throw new ApiError(400, "Mobile number is required to register.");
    }

    // Use our decoupled 'repo' variable instead of the hardcoded class
    const existingUser = await repo.findByPhone(phone);
    if (existingUser) {
      logger.warn(
        `Registration rejected: User with phone ${phone} already exists`,
      );
      throw new ApiError(
        400,
        "A community member with this phone number already exists.",
      );
    }

    const newUser = await repo.create(userData);
    logger.info(
      `New user registered successfully with ID: ${newUser._id} under suburb: ${userData.address?.isigodi}`,
    );
    return newUser;
  }

  // 2. FIND USER BY PHONE SERVICE (For quick profiles/lookups)
  static async findByPhone(phone: string): Promise<IUser> {
    const user = await repo.findByPhone(phone);

    if (!user) {
      logger.error(`User search failed: Phone number ${phone} does not exist`);
      throw new ApiError(404, "User profile not found");
    }

    logger.info(`User profile with phone ${phone} retrieved successfully`);
    return user;
  }

  // 3. FIND NEIGHBORS BY TAXI STOP MATCHMAKER
  static async getNeighborsByStop(istobhi: string): Promise<IUser[]> {
    const neighbors = await repo.findByTaxiStop(istobhi);

    if (!neighbors || neighbors.length === 0) {
      logger.warn(
        `Matchmaker: No neighbors found using the taxi stop: ${istobhi}`,
      );
      throw new ApiError(
        404,
        "No community members found at this taxi stop reference.",
      );
    }

    logger.info(
      `Matchmaker: Found ${neighbors.length} neighbors at taxi stop: ${istobhi}`,
    );
    return neighbors;
  }

  // 4. SEARCH USERS BY GENERAL LOCATION (ISIGODI / SECTION)
  static async getUsersByLocation(isigodi: string): Promise<IUser[]> {
    const users = await repo.findByLocation({ isigodi });

    if (!users || users.length === 0) {
      logger.warn(
        `Location Lookup: No users found inside isigodi/section: ${isigodi}`,
      );
      throw new ApiError(
        404,
        "No community profiles discovered in this section.",
      );
    }

    logger.info(
      `Location Lookup: Found ${users.length} profiles in isigodi: ${isigodi}`,
    );
    return users;
  }

  // 5. UPDATE USER DETAILS SERVICE
  static async updateUserDetails(
    userId: string,
    updateData: Partial<IUser>,
  ): Promise<IUser> {
    // Business Logic Safety: Prevent tampering with key database paths via basic updates
    if (updateData.contactDetails) {
      delete (updateData.contactDetails as any).phone; // Phone updates should run through an OTP re-verify route
    }

    const updatedUser = await repo.update(userId, updateData);

    if (!updatedUser) {
      logger.error(`Update failed: User with ID ${userId} does not exist`);
      throw new ApiError(404, "User profile not found or update failed.");
    }

    logger.info(`User profile ${userId} updated successfully`);
    return updatedUser;
  }

  // 6. DELETE USER PROFILE SERVICE
  static async deleteUserProfile(userId: string): Promise<IUser> {
    const deletedUser = await repo.delete(userId);

    if (!deletedUser) {
      logger.error(`Deletion failed: User with ID ${userId} does not exist`);
      throw new ApiError(404, "User profile not found or already removed.");
    }

    logger.info(`User profile ${userId} permanently purged from system logs`);
    return deletedUser;
  }
}
