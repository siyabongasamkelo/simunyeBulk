import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import logger from "../../utils/logger";

export class UserController {
  // 1. REGISTER A NEW COMMUNITY MEMBER
  static async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      logger.info(
        `Incoming Registration Request for phone: ${req.body.contactDetails?.phone}`,
      );

      const newUser = await UserService.registerUser(req.body);

      res.status(201).json({
        success: true,
        message: "User registered successfully under their local community!",
        user: newUser,
      });
    } catch (error) {
      // Passes the error straight to your Global Error Handler middleware
      next(error);
    }
  }

  // 2. GET USER PROFILE BY PHONE
  static async getProfileByPhone(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const phone = req.params.phone as string;
      logger.info(`Profile query received for phone: ${phone}`);

      const user = await UserService.findByPhone(phone);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  // 3. MATCHMAKER: GET NEIGHBORS BY TAXI STOP (istobhi)
  static async getNeighbors(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const istobhi = req.params.istobhi as string;
      logger.info(`Matchmaker query triggered for taxi stop: ${istobhi}`);

      const neighbors = await UserService.getNeighborsByStop(istobhi);

      res.status(200).json({
        success: true,
        count: neighbors.length,
        neighbors,
      });
    } catch (error) {
      next(error);
    }
  }

  // 4. UPDATE USER PROFILE DETAILS
  static async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.params.userId as string;
      logger.info(
        `Profile modification request initiated for user ID: ${userId}`,
      );

      const updatedUser = await UserService.updateUserDetails(userId, req.body);

      res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  // 5. DELETE USER PROFILE
  static async deleteAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.params.userId as string;
      logger.warn(
        `Account permanent deletion request received for user ID: ${userId}`,
      );

      await UserService.deleteUserProfile(userId);

      res.status(200).json({
        success: true,
        message: "User profile has been permanently removed from system logs.",
      });
    } catch (error) {
      next(error);
    }
  }
}
