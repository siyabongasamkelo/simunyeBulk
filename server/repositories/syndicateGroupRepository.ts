import { SyndicateGroup, ISyndicateGroup } from "../models/SyndicateGroup";
import { Types } from "mongoose";

export class SyndicateGroupRepository {
  // 1. CREATE A NEW SYNDICATE GROUP
  async create(groupData: Partial<ISyndicateGroup>): Promise<ISyndicateGroup> {
    const group = new SyndicateGroup(groupData);
    return await group.save();
  }

  // 2. GET SYNDICATE BY ID (Populates member details for WhatsApp transitions)
  async findById(groupId: string): Promise<ISyndicateGroup | null> {
    return await SyndicateGroup.findById(groupId).populate("members");
  }

  // 3. GET ALL ACTIVE SYNDICATE GROUPS
  async findAllActive(): Promise<ISyndicateGroup[]> {
    return await SyndicateGroup.find({ status: "active" });
  }

  // 4. GET BY LOCATION (Search by isigodi or istobhi to match local neighbors)
  async findByLocation(
    isigodi?: string,
    istobhi?: string,
  ): Promise<ISyndicateGroup[]> {
    const filter: any = { status: "active" };

    if (isigodi) {
      filter["location.isigodi"] = { $regex: new RegExp(isigodi, "i") };
    }
    if (istobhi) {
      filter["location.istobhi"] = { $regex: new RegExp(istobhi, "i") };
    }

    return await SyndicateGroup.find(filter);
  }

  // 5. GET BY WHOLESALER (e.g., finding all pools heading to Makro or Cambridge)
  async findByWholesaler(wholesalerName: string): Promise<ISyndicateGroup[]> {
    return await SyndicateGroup.find({
      wholesalerName: { $regex: new RegExp(wholesalerName, "i") },
      status: "active",
    });
  }

  // 6. GET BY PRODUCT (Find neighbors buying 10kg Rice, Cooking Oil, etc.)
  async findByProduct(productName: string): Promise<ISyndicateGroup[]> {
    return await SyndicateGroup.find({
      products: { $elemMatch: { $regex: new RegExp(productName, "i") } },
      status: "active",
    });
  }

  // 7. UPDATE SYNDICATE DETAILS (e.g., changing status to 'completed' or adding a WhatsApp link)
  async update(
    groupId: string,
    updateData: Partial<ISyndicateGroup>,
  ): Promise<ISyndicateGroup | null> {
    return await SyndicateGroup.findByIdAndUpdate(
      groupId,
      { $set: updateData },
      { new: true, runValidators: true },
    );
  }

  // 8. DELETE SYNDICATE GROUP
  async delete(groupId: string): Promise<ISyndicateGroup | null> {
    return await SyndicateGroup.findByIdAndDelete(groupId);
  }

  // ➕ BONUS 1: ADD MEMBER TO GROUP (Pushes a user ID to the members array if not already there)
  async addMember(
    groupId: string,
    userId: string,
  ): Promise<ISyndicateGroup | null> {
    return await SyndicateGroup.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: new Types.ObjectId(userId) } }, // $addToSet automatically blocks duplicates
      { new: true },
    );
  }

  // ➖ BONUS 2: REMOVE MEMBER FROM GROUP (Pulls a user ID out of the members array)
  async removeMember(
    groupId: string,
    userId: string,
  ): Promise<ISyndicateGroup | null> {
    return await SyndicateGroup.findByIdAndUpdate(
      groupId,
      { $pull: { members: new Types.ObjectId(userId) } },
      { new: true },
    );
  }
}
