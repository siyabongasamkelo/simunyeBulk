import { User, IUser } from "../models/User";

export class UserRepository {
  async findByPhone(phone: string): Promise<IUser | null> {
    return await User.findOne({ "contactDetails.phone": phone });
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async findByTaxiStop(istobhi: string): Promise<IUser[]> {
    return await User.find({ "address.istobhi": istobhi }).select(
      "personalDetails.name personalDetails.surname contactDetails.phone address.isigodi",
    );
  }

  // This lets the app search flexibly whether users search by section or broad location
  async findByLocation(query: { isigodi?: string }): Promise<IUser[]> {
    const filter: any = {};

    if (query.isigodi) {
      filter["address.isigodi"] = { $regex: new RegExp(query.isigodi, "i") }; // Case-insensitive partial matching
    }

    return await User.find(filter).select(
      "personalDetails.name personalDetails.surname contactDetails.phone address.istobhi address.landmarkReference",
    );
  }

  // We use Mongoose { new: true } to return the newly updated profile immediately
  async update(
    userId: string,
    updateData: Partial<IUser>,
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    );
  }

  async delete(userId: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(userId);
  }
}
