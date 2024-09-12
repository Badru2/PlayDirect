import date from "date-and-time";
import Stock from "../../models/Stock.js";
import Product from "../../models/Product.js";

export const CreateStock = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  const now = new Date();
  const dateNow = date.format(now, "YYYY-MM-DD HH:mm:ss");

  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ error: "All field are required" });
  }

  try {
    const newStock = await Stock.create({
      user_id,
      product_id,
      quantity,
      created_at: dateNow,
      updated_at: dateNow,
    });

    res.status(201).json({
      message: "Stock created successfully",
      stock: newStock,
    });
  } catch (error) {
    console.error("Error creating stock:", error);
    res.status(500).json({ error: error.message });
  }
};

// export const getStocks = async (req, res) => {
//   try {
//     const stocks = await Stock.findAll({
//       include: [
//         {
//           model: Product,
//           attributes: [
//             "id",
//             "name",
//             "price",
//             "images",
//             "category_id",
//             "genre_id",
//             "description",
//             "created_at",
//             "updated_at",
//           ],
//         },
//       ],
//     });
//     res.status(200).json(stocks);
//   } catch (error) {
//     console.error("Error retrieving stocks:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
