import ProductReview from "../../models/ProductReview.js";

export const createReview = async (req, res) => {
  const { userId, productId, rating, comment } = req.body;

  try {
    const review = await ProductReview.create({
      user_id: userId,
      product_id: productId,
      rating,
      comment,
    });
    res.json(review);
  } catch (error) {
    console.error("Error creating review:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
