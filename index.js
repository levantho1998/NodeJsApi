const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 8000;
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Thay thế chuỗi kết nối sau bằng link MongoDB của bạn
const mongoURI = "mongodb+srv://admin:admin@atlascluster.lb7b90g.mongodb.net/";

const useRouter = require("./router/user");
const productRouter = require("./router/product");

app.use("/", useRouter);
app.use("/", productRouter);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// const uploadDirectory = "./uploads";
// if (!fs.existsSync(uploadDirectory)) {
//   fs.mkdirSync(uploadDirectory);
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

// Tạo và cập nhật một todo
// app.put(
//   "/ThoLv/:id",
//   verifyAccessToken,
//   upload.single("img"),
//   async (req, res) => {
//     const productId = req.params.id;
//     const { title, description, sex } = req.body;
//     const imageFilePath = req.file?.path;

//     if (!title || !description || !sex) {
//       return res.status(400).json({ error: "Missing required fields." });
//     }

//     try {
//       const product = await Product.findById(productId);
//       console.log(2, product);

//       if (!productId) {
//         return res.status(404).json({ error: "Todo not found." });
//       }

//       if (imageFilePath) {
//         if (fs.existsSync(product.img)) {
//           fs.unlinkSync(product.img);
//         }
//         product.img = imageFilePath;
//       }

//       product.title = title;
//       product.description = description;
//       product.sex = sex;

//       const updatedProduct = await product.save();

//       res.status(200).json(updatedProduct);
//     } catch (error) {
//       res
//         .status(500)
//         .json({ error: "An error occurred while updating the todo." });
//     }
//   }
// );

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
