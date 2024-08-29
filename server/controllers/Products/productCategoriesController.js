import ProductCategory from "../../models/ProductCategory.js";

export const createProductCategories = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newCategory = await ProductCategory.create({ name });

    res.status(201).json({
      message: "Product category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const showProductCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.findAll({
      order: [["name", "ASC"]],
    });

    res.json(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};
