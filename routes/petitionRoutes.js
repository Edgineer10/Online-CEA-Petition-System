const express = require("express");
const router = express.Router();
const petitionController = require("../controllers/petitionsController");

router
  .route("/")
  .get(petitionController.getAllPetitions)
  .post(petitionController.createNewPetition)
  .patch(petitionController.updatePetition)
  .delete(petitionController.deletePetition);

module.exports = router;
