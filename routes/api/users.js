const express = require('express');
const { validateBody, authenticate, upload } = require("../../middlewares");
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
router.patch("/", authenticate, validateBody(schema.updatePatchSchemaSubscription), ctrl.updateSubscription);
// upload.single("") це коли очикується один файл
// upload.array("",10) це коли очікується більше одного файлу
// upload.fields([{name:"a",maxCount:5},{name:"b",maxCount:10}]) це коли очікується декілька файлів з різних полів
router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updateAvatar);

module.exports = router;