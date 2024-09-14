import Carousel from "../models/Carousel.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createCarousel = async (req, res) => {
  const { description, url } = req.body;

  if (!req.files || !req.files.image || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const image = req.files.image;

  // Use timestamp for the image name to ensure uniqueness
  const timestamp = Date.now();
  const imageName = `${timestamp}_${image.name}`;

  // Set the upload path (ensure this folder exists or create it)
  const uploadPath = path.join(
    __dirname,
    "../public/images/carousel",
    imageName
  );

  try {
    // Move the image file to the desired folder
    image.mv(uploadPath, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Image upload failed" });
      }

      // Save the image file path and other details in the database
      const newCarousel = await Carousel.create({
        image: `${imageName}`, // Save the image name (or relative path) in the database
        description,
        url,
      });

      res.status(201).json({
        message: "Carousel created successfully",
        carousel: newCarousel,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCarousel = async (req, res) => {
  try {
    const carousel = await Carousel.findAll();
    res.status(200).json(carousel);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};
