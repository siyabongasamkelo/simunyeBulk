import { Router } from "express";
import { UserController } from "./user.controller";
import { validate } from "../../middleware/validate";
import { registerUserSchema } from "../../validations/schemas";

const router = Router();

// 1. REGISTER A NEW USER PROFILE (Protected by Zod Validation)
router.post("/register", validate(registerUserSchema), UserController.register);

//  2. GET USER PROFILE BY PHONE NUMBER
router.get("/profile/:phone", UserController.getProfileByPhone);

//  3. MATCHMAKER: GET ALL NEIGHBORS USING A SPECIFIC TAXI STOP (istobhi)
router.get("/neighbors/taxi-stop/:istobhi", UserController.getNeighbors);

//  4. UPDATE USER PROFILE DETAILS
router.put("/:userId", UserController.updateProfile);

//  5. DELETE USER PROFILE ACCOUNT PERMANENTLY
router.delete("/:userId", UserController.deleteAccount);

export default router;
