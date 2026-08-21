import { Request, Response, NextFunction } from "express";
import { SyndicateGroupService } from "./syndicate.service";
import logger from "../../utils/logger";

export class SyndicateGroupController {
  // 1. CREATE A NEW SYNDICATE BUYING POOL
  static async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      logger.info(`Creating a new syndicate group: ${req.body.name}`);
      const newGroup = await SyndicateGroupService.createGroup(req.body);

      res.status(201).json({
        success: true,
        message: " Syndicate group created successfully!",
        group: newGroup,
      });
    } catch (error) {
      next(error);
    }
  }

  // 2. GET A SPECIFIC SYNDICATE BY ITS ID
  static async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const groupId = req.params.groupId as string;
      const group = await SyndicateGroupService.getGroupById(groupId);

      res.status(200).json({
        success: true,
        group,
      });
    } catch (error) {
      next(error);
    }
  }

  // 3. FILTER SYNDICATES BY PRODUCT (e.g., /api/syndicates/search/product?name=Rice)
  static async getByProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const productName = req.query.name as string;

      logger.info(`Searching active syndicates for product: ${productName}`);
      const groups =
        await SyndicateGroupService.getGroupsByProduct(productName);

      res.status(200).json({
        success: true,
        count: groups.length,
        groups,
      });
    } catch (error) {
      next(error);
    }
  }

  // 4. FILTER SYNDICATES BY WHOLESALER (e.g., /api/syndicates/search/wholesaler?name=Makro)
  static async getByWholesaler(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const wholesalerName = req.query.name as string;

      logger.info(
        `Searching active syndicates for wholesaler: ${wholesalerName}`,
      );
      const groups =
        await SyndicateGroupService.getGroupsByWholesaler(wholesalerName);

      res.status(200).json({
        success: true,
        count: groups.length,
        groups,
      });
    } catch (error) {
      next(error);
    }
  }

  // 5. JOIN A SYNDICATE GROUP (Matchmaking Action)
  static async join(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const groupId = req.params.groupId as string;
      const userId = req.body.userId as string; // The user ID joining the pool

      logger.info(`User ${userId} requested to join group ${groupId}`);
      const updatedGroup = await SyndicateGroupService.joinGroup(
        groupId,
        userId,
      );

      res.status(200).json({
        success: true,
        message: "Successfully joined the syndicate buying pool!",
        group: updatedGroup,
      });
    } catch (error) {
      next(error);
    }
  }

  // 6. LEAVE A SYNDICATE GROUP
  static async leave(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const groupId = req.params.groupId as string;
      const userId = req.body.userId as string;

      logger.info(`User ${userId} requested to leave group ${groupId}`);
      const updatedGroup = await SyndicateGroupService.leaveGroup(
        groupId,
        userId,
      );

      res.status(200).json({
        success: true,
        message: "Left the syndicate group successfully.",
        group: updatedGroup,
      });
    } catch (error) {
      next(error);
    }
  }
}
