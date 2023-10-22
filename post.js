// API để đăng tải dữ liệu mới
app.post(
  "/ThoLv",
  verifyAccessToken,
  upload.single("img"),
  async (req, res) => {
    const { title, description, sex } = req.body;
    const imageFilePath = req.file ? req.file.path : null;

    if (!title || !description || !sex) {
      return res.status(400).json({ error: `Missing required fields.` });
    }

    try {
      // Tạo một bản ghi Todo mới
      const newTodo = new Todo({
        title,
        description,
        sex,
        img: imageFilePath, // Đặt đường dẫn hình ảnh nếu có
      });

      // Lưu bản ghi vào MongoDB
      const savedTodo = await newTodo.save();

      res.status(201).json(savedTodo);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the todo." });
    }
  }
);
