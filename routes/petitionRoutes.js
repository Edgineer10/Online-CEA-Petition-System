const express = require("express");
const router = express.Router();
const petitionController = require("../controllers/petitionsController");
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router
  .route("/")
  .get(petitionController.getAllPetitions)
  .post(petitionController.createNewPetition)
  .patch(petitionController.updatePetition)
  .delete(petitionController.deletePetition);

module.exports = router;
