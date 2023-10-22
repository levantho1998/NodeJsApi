const express = require("express");

const router = express.Router();
const controller = require("../controller/controller");
const { verifyAccessToken } = require("../middleware");
const multer = require("multer");
const fs = require("fs");

const uploadDirectory = "./uploads";
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/login", controller.login);
router.post("/refresh-token", controller.postRefreshToken);
router.post("/logout", verifyAccessToken, controller.logoutUser);
router.get("/ThoLv", verifyAccessToken, controller.getAllProduct);
router.post(
  "/ThoLv",
  verifyAccessToken,
  upload.single("img"),
  controller.createProduct
);

router.put(
  "/ThoLv/:id",
  verifyAccessToken,
  upload.single("img"),
  controller.editProduct
);

router.get("/ThoLv/:id", verifyAccessToken, controller.getDetailProduct);
router.delete("/ThoLv/:id", verifyAccessToken, controller.deleteProduct);

module.exports = router;
