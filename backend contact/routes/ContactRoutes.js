const express = require("express");
const router = express.Router();
const {
  getContact,
  createContact,
  updateContact,
  getContactById,
  deleteContact,
  toggleFavorite,
} = require("../controllers/ContactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(getContact).post(createContact);
router.route("/:id").get(getContactById).put(updateContact).delete(deleteContact);
router.route("/:id/favorite").patch(toggleFavorite);

module.exports = router;