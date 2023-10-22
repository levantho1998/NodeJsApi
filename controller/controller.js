const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Product = require("../model/Product");
const fs = require("fs");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helper/UtiHelper");

const { jwtSecretKey } = require("../middleware");

//đăng ký tài khoản
const createUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      accessToken: "",
      refreshToken: "",
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
};

// Đăng nhập và cấp AccessToken và RefreshToken
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Authentication failed. User not found." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: "Authentication failed. Incorrect password." });
    }

    const accessToken = generateAccessToken({ username: user.username });
    const refreshToken = generateRefreshToken({ username: user.username });

    // Lưu AccessToken và RefreshToken vào tài khoản
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during login." });
  }
};

// Làm mới AccessToken bằng RefreshToken
const postRefreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ error: "RefreshToken is missing." });
  }

  try {
    const { username } = jwt.verify(refreshToken, jwtSecretKey);

    const existingUser = await User.findOne({ username });
    if (!existingUser || existingUser.refreshToken !== refreshToken) {
      return res.status(408).json({ error: "Invalid RefreshToken." });
    }

    const accessToken = generateAccessToken({ username });
    const newRefreshToken = generateRefreshToken({ username });

    existingUser.accessToken = accessToken;
    existingUser.refreshToken = newRefreshToken;

    await existingUser.save();

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during token refresh." });
  }
};

// Đăng xuất và xóa AccessToken và RefreshToken
const logoutUser = async (req, res) => {
  const { username, password } = req.user;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    // Xóa AccessToken và RefreshToken khỏi tài khoản
    user.accessToken = "";
    user.refreshToken = "";
    await user.save();

    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during logout." });
  }
};

// Lấy all danh sách sản phẩm
const getAllProduct = async (req, res) => {
  try {
    const lists = await Product.find();
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching todos." });
  }
};

// API để đăng tải dữ liệu mới
const createProduct = async (req, res) => {
  const { title, description, sex } = req.body;
  const imageFilePath = req.file ? req.file.path : null;

  if (
    !title ||
    !description ||
    !sex ||
    title === "" ||
    description === "" ||
    sex === ""
  ) {
    return res.status(400).json({ error: `web_200` });
  }

  try {
    // Tạo một bản ghi Todo mới
    const newProduct = new Product({
      title,
      description,
      sex,
      img: imageFilePath, // Đặt đường dẫn hình ảnh nếu có
    });

    // Lưu bản ghi vào MongoDB
    const savedTodo = await newProduct.save();

    res.status(201).json(savedTodo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the todo." });
  }
};

// Tạo và cập nhật một todo
const editProduct = async (req, res) => {
  const productId = req.params.id;
  const { title, description, sex } = req.body;
  const imageFilePath = req.file?.path;

  if (!title || !description || !sex) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const product = await Product.findById(productId);

    if (!productId) {
      return res.status(404).json({ error: "Todo not found." });
    }

    if (imageFilePath) {
      if (fs.existsSync(product.img)) {
        fs.unlinkSync(product.img);
      }
      product.img = imageFilePath;
    }

    product.title = title;
    product.description = description;
    product.sex = sex;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the todo." });
  }
};

// Lấy thông tin một todo theo ID
const getDetailProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const todo = await Product.findById(productId);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found." });
    }

    res.status(200).json(todo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the todo." });
  }
};

// Xóa một 1 product
const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Todo not found." });
    }

    const imagePath = deletedProduct.img;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: "Todo deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the todo." });
  }
};

const controllerApi = {
  createUser,
  login,
  postRefreshToken,
  logoutUser,
  getAllProduct,
  createProduct,
  editProduct,
  getDetailProduct,
  deleteProduct,
};

module.exports = controllerApi;
