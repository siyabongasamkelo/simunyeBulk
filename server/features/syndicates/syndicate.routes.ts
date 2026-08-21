import { Router } from "express";
import { SyndicateGroupController } from "./syndicate.controller";
import { validate } from "../../middleware/validate";
import { createSyndicateSchema } from "../../validations/schemas";

const router = Router();

// 1. CREATE A NEW SYNDICATE BUYING POOL (Protected by Zod)
router.post(
  "/create",
  validate(createSyndicateSchema),
  SyndicateGroupController.create,
);

// 2. GET A SPECIFIC SYNDICATE BY ITS DATABASE ID
router.get("/:groupId", SyndicateGroupController.getById);

// 3. SEARCH ACTIVE SYNDICATES BY PRODUCT TARGET (e.g., /api/v1/syndicates/search/product?name=Rice)
router.get("/search/product", SyndicateGroupController.getByProduct);

// 4. SEARCH ACTIVE SYNDICATES BY WHOLESALER NAME (e.g., /api/v1/syndicates/search/wholesaler?name=Makro)
router.get("/search/wholesaler", SyndicateGroupController.getByWholesaler);

// 5. JOIN A SYNDICATE BUYING GROUP (Matchmaking Action)
router.post("/:groupId/join", SyndicateGroupController.join);

// 6. LEAVE A SYNDICATE BUYING GROUP
router.post("/:groupId/leave", SyndicateGroupController.leave);

export default router;
