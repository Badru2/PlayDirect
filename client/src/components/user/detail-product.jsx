import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserNavigation from "../navigations/user-navigation";

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide index

  useEffect(() => {
    // Fetch product details by ID
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(product.price);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div>
      <UserNavigation />
      <div className="mx-auto max-w-7xl">
        <div className="rounded-sm p-4 grid grid-cols-4 gap-2">
          <div className="relative w-full">
            <div className="sticky top-16 bg-white shadow-md pb-3">
              <div className="carousel w-full">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`carousel-item inset-0 w-full sticky transition-opacity duration-500  ${
                      index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={`/public/images/products/${image}`}
                      alt={product.name}
                      className="w-full object-cover max-h-80"
                    />
                  </div>
                ))}
              </div>
              <div className="flex w-full justify-center gap-2 py-2 bottom-0 sticky flex-wrap overflow-y-auto max-h-[153px]">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={`/public/images/products/${image}`}
                    alt={product.name}
                    className={`w-16 h-16 object-cover rounded-md cursor-pointer ${
                      index === currentSlide
                        ? "border-2 border-blue-500"
                        : "border-2 border-transparent"
                    }`}
                    onClick={() => handleSlideChange(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="px-3 pb-3 col-span-2 bg-white shadow-md">
            <h1 className="text-xl font-bold">{product.name}</h1>
            <p>{formattedPrice}</p>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
