const express = require('express')
const { registerUser } = require("../controllers/userControllers")
const router = express.Router();
router.use(express.json());
router.route("/").post(registerUser);
// router.post('/login', authUser)

module.exports = router;