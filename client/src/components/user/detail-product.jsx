import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import UserNavigation from "../navigations/user-navigation";
import { useAuth } from "../../hooks/useAuth";

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide index
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState("");

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

    const fetchUserId = async () => {
      try {
        const response = await axios.get(
          `/api/profile/show?email=${user.email}`
        );
        console.log(response.data.id);
        setUserId(response.data.id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserId();
    fetchProduct();
  }, [id, user]);

  useEffect(() => {
    if (product) {
      const fetchRelatedProducts = async () => {
        try {
          const response = await axios.get(
            `/api/product/related/${product.category_id}`
          );

          // Filter out the current product
          const filteredRelatedProducts = response.data.filter(
            (relatedProduct) => relatedProduct.id !== product.id
          );

          setRelatedProducts(filteredRelatedProducts);
        } catch (error) {
          console.error("Error fetching related products:", error);
        }
      };

      fetchRelatedProducts();
    }
  }, [product]);

  const handleAddRelatedToCart = async ({ productId }) => {
    try {
      const response = await axios.post("/api/cart/add", {
        userId,
        productId,
        quantity: 1,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (!product) return <p>Product not found</p>;

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(product.price);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/cart/add", {
        userId: userId,
        productId: product.id,
        quantity,
      });
      console.log(response.data);
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div>
      <UserNavigation />
      <div className="mx-auto max-w-7xl min-h-[200vh]">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <div className="rounded-sm p-4 md:grid md:grid-cols-4 gap-2">
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

              <div className="px-3 pb-3 col-span-2 bg-white shadow-md space-y-3 pt-4">
                <div className="text-2xl font-bold">{product.name}</div>
                <div className="text-3xl font-bold">{formattedPrice}</div>
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              <div className="relative hidden md:block">
                <div className="bg-white shadow-md p-5 sticky top-16">
                  <div className="flex items-center space-x-3 border-b pb-3 border-gray-400">
                    <img
                      src={`/public/images/products/${product.images[0]}`}
                      alt=""
                      className="h-14 w-14 object-cover rounded-sm"
                    />
                    <div>{product.name}</div>
                  </div>

                  <div className="mt-4 ">
                    <form onSubmit={handleAddToCart} className="space-y-7">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <div
                            onClick={() =>
                              quantity > 1 && setQuantity(quantity - 1)
                            }
                            className="border h-8 w-8 border-black flex items-center justify-center font-bold rounded-sm cursor-pointer"
                          >
                            -
                          </div>

                          <input
                            type="text"
                            value={quantity}
                            className="h-8 w-16 text-center"
                            accept="number"
                            onChange={(e) => setQuantity(e.target.value)}
                            min={1}
                            max={product.stock}
                          />

                          <div
                            onClick={() =>
                              quantity < product.stock &&
                              setQuantity(quantity + 1)
                            }
                            className="border h-8 w-8 font-bold border-black rounded-sm cursor-pointer flex items-center justify-center"
                          >
                            +
                          </div>
                        </div>
                        <div>
                          Stock: <b>{product.stock}</b>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          Subtotal:
                          <div className="font-bold text-xl">
                            {Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(quantity * product.price)}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="bg-blue-500 text-white w-full py-2 rounded font-bold"
                        >
                          Add To Cart
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 w-full space-y-3">
              <div className="text-2xl font-bold">Related Products:</div>
              <div className="flex w-full max-w-[100vw] overflow-x-auto space-x-4 flex-shrink-0 scrollbar">
                {relatedProducts.length > 0
                  ? relatedProducts.map((relatedProduct) => (
                      <div
                        key={relatedProduct.id}
                        className="w-52 bg-white shadow-md flex flex-col flex-shrink-0 "
                      >
                        <img
                          src={`/public/images/products/${relatedProduct.images[0]}`}
                          alt={relatedProduct.name}
                          className="h-52 w-full object-cover rounded-sm"
                        />
                        <div className="p-2">
                          <Link
                            to={`/product/${relatedProduct.id}`}
                            className="hover:text-blue-500 block"
                          >
                            <span className="">{relatedProduct.name}</span>
                          </Link>
                        </div>

                        <div className="p-2">
                          <button
                            onClick={
                              user
                                ? () =>
                                    handleAddRelatedToCart({
                                      productId: relatedProduct.id,
                                    })
                                : () => navigate("/login")
                            }
                            className="bg-green-400 px-5 text-white font-bold rounded-sm"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 w-full md:hidden">
        <div className="py-2 w-full bg-white shadow-lg flex justify-between px-3">
          <div className="px-2 py-1 border rounded-md">chat</div>
          <div className="text-white text-center">
            <button
              onClick={
                user
                  ? () =>
                      handleAddRelatedToCart({
                        productId: product.id,
                      })
                  : () => navigate("/login")
              }
              className="bg-green-400 px-5 py-1 text-white font-bold rounded-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
