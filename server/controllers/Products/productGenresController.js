import ProductGenre from "../../models/ProductGenre.js";

export const createProductGenres = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newGenre = await ProductGenre.create({ name });

    res.status(201).json({
      message: "Product genre created successfully",
      genre: newGenre,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const showProductGenres = async (req, res) => {
  try {
    const genres = await ProductGenre.findAll({
      order: [["name", "ASC"]],
    });

    res.json(genres);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};
