import { SyndicateGroupRepository } from "./syndicate.Repository";
import { ApiError } from "../../utils/ApiError";
import logger from "../../utils/logger";
import { ISyndicateGroup } from "./syndicate.model";

// If the database structure or repository name changes, you only touch this one line!
const repo = new SyndicateGroupRepository();

export class SyndicateGroupService {
  // 1. CREATE A NEW SYNDICATE GROUP
  static async createGroup(
    groupData: Partial<ISyndicateGroup>,
  ): Promise<ISyndicateGroup> {
    if (
      !groupData.name ||
      !groupData.adminName ||
      !groupData.location?.isigodi
    ) {
      logger.error(
        "Group Creation Failed: Missing required operational fields in payload",
      );
      throw new ApiError(
        400,
        "Group Name, Admin Name, and Section/Isigodi are strictly required.",
      );
    }

    const newGroup = await repo.create(groupData);
    logger.info(
      ` Syndicate Group '${newGroup.name}' created successfully by Admin: ${newGroup.adminName} in ${newGroup.location.isigodi}`,
    );
    return newGroup;
  }

  // 2. GET SYNDICATE GROUP BY ID (With complete member profiles)
  static async getGroupById(groupId: string): Promise<ISyndicateGroup> {
    const group = await repo.findById(groupId);

    if (!group) {
      logger.error(
        `Group Lookup Failed: Syndicate ID ${groupId} does not exist`,
      );
      throw new ApiError(
        404,
        "Syndicate group not discovered or has been archived.",
      );
    }

    logger.info(
      `Syndicate Group profile '${group.name}' retrieved successfully with ${group.members.length} members`,
    );
    return group;
  }

  // 3. GET ALL ACTIVE SYNDICATE GROUPS
  static async getAllActiveGroups(): Promise<ISyndicateGroup[]> {
    const groups = await repo.findAllActive();
    logger.info(
      `Bulk Discovery: Retrieved ${groups.length} active buying pools globally across the app`,
    );
    return groups;
  }

  // 4. SEARCH SYNDICATES BY LOCAL COMMUNITY LOCATION
  static async getGroupsByLocation(
    isigodi?: string,
    istobhi?: string,
  ): Promise<ISyndicateGroup[]> {
    const groups = await repo.findByLocation(isigodi, istobhi);
    logger.info(
      `Location Lookup: Discovered ${groups.length} matching buying groups around Isigodi: ${isigodi || "Any"}, Istobhi: ${istobhi || "Any"}`,
    );
    return groups;
  }

  // 5. SEARCH SYNDICATES BY WHOLESALER NAME (e.g., Makro / Cambridge)
  static async getGroupsByWholesaler(
    wholesalerName: string,
  ): Promise<ISyndicateGroup[]> {
    if (!wholesalerName) {
      throw new ApiError(400, "Please specify a wholesaler name to query.");
    }
    const groups = await repo.findByWholesaler(wholesalerName);
    logger.info(
      `Wholesaler Lookup: Found ${groups.length} active buying syndicates routing to ${wholesalerName}`,
    );
    return groups;
  }

  // 6. SEARCH SYNDICATES BY TARGET PRODUCT (e.g., 10kg Rice)
  static async getGroupsByProduct(
    productName: string,
  ): Promise<ISyndicateGroup[]> {
    if (!productName) {
      throw new ApiError(400, "Please specify a product keyword to filter.");
    }
    const groups = await repo.findByProduct(productName);
    logger.info(
      `Product Lookup: Discovered ${groups.length} syndicates actively pooling for product: ${productName}`,
    );
    return groups;
  }

  // 7. JOIN A SYNDICATE GROUP (The core Matchmaking engine rule)
  static async joinGroup(
    groupId: string,
    userId: string,
  ): Promise<ISyndicateGroup> {
    const updatedGroup = await repo.addMember(groupId, userId);

    if (!updatedGroup) {
      logger.error(
        `Membership Action Failed: Group ID ${groupId} does not exist`,
      );
      throw new ApiError(404, "Target syndicate group could not be located.");
    }

    logger.info(
      `👤 Community User ${userId} successfully locked into Syndicate Buying Pool: ${groupId}`,
    );
    return updatedGroup;
  }

  // 8. LEAVE A SYNDICATE GROUP
  static async leaveGroup(
    groupId: string,
    userId: string,
  ): Promise<ISyndicateGroup> {
    const updatedGroup = await repo.removeMember(groupId, userId);

    if (!updatedGroup) {
      logger.error(
        `Membership Action Failed: Group ID ${groupId} does not exist`,
      );
      throw new ApiError(404, "Target syndicate group could not be located.");
    }

    logger.warn(
      `👤 Community User ${userId} removed themselves from Syndicate Buying Pool: ${groupId}`,
    );
    return updatedGroup;
  }

  // 9. UPDATE GENERAL SYNDICATE SPECIFICATIONS (Change status / edit WhatsApp Link)
  static async updateGroupDetails(
    groupId: string,
    updateData: Partial<ISyndicateGroup>,
  ): Promise<ISyndicateGroup> {
    const updatedGroup = await repo.update(groupId, updateData);

    if (!updatedGroup) {
      logger.error(
        `Update Action Failed: Syndicate ID ${groupId} does not exist`,
      );
      throw new ApiError(
        404,
        "Syndicate group profile not found or modification rejected.",
      );
    }

    logger.info(
      `Syndicate Group configurations modified successfully for ID: ${groupId}`,
    );
    return updatedGroup;
  }

  // 10. REMOVE/CLOSE A BUYING POOL
  static async deleteGroup(groupId: string): Promise<ISyndicateGroup> {
    const deletedGroup = await repo.delete(groupId);

    if (!deletedGroup) {
      logger.error(
        `Deletion Action Failed: Syndicate ID ${groupId} does not exist`,
      );
      throw new ApiError(
        404,
        "Target syndicate group could not be deleted or already dropped.",
      );
    }

    logger.warn(
      `🗑️ Syndicate Group '${deletedGroup.name}' has been completely closed out by the system`,
    );
    return deletedGroup;
  }
}
