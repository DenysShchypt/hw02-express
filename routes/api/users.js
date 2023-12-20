const express = require('express');
const { validateBody, authenticate } = require("../../middlewares");
const schema = require('../../models/user');
const router = express.Router();
const ctrl = require("../../controllers/auth")

// signup
router.post("/register", validateBody(schema.registerLoginSchema), ctrl.register);
// signin
router.post("/login", validateBody(schema.registerLoginSchema), ctrl.login);
// Поточний user
router.get("/current", authenticate, ctrl.getCurrent);
// Logout user
router.post("/logout", authenticate, ctrl.logout);
// subscription
router.patch("/", authenticate,validateBody(schema.updatePatchSchemaSubscription), ctrl.updateSubscription);



module.exports = router;