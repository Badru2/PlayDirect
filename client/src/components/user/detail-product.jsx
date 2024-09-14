import React, { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavigation from "../navigations/user-navigation";
import { useAuth } from "../../hooks/useAuth";

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const { user } = useAuth();
  const navigate = useNavigate();
  const toTop = useRef(null);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide index
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Fetch product details by ID
    const fetchProduct = async () => {
      setProductLoading(true); // Set loading state to true
      try {
        const response = await axios.get(`/api/product/${id}`);
        console.log(response.data);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setProductLoading(false); // Set loading state to false
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
      } finally {
        setUserLoading(false); // Set loading state to false
      }
    };

    fetchProduct();
    fetchUserId();
    toTop.current?.scrollIntoView({ behavior: "smooth" });
  }, [id, user]);

  useEffect(() => {
    if (product) {
      setRelatedLoading(false);
      const fetchRelatedProducts = async () => {
        try {
          const response = await axios.get(
            `/api/product/related/${product.category_id}`
          );
          const filteredRelatedProducts = response.data.filter(
            (relatedProduct) => relatedProduct.id !== product.id
          );
          setRelatedProducts(filteredRelatedProducts);
        } catch (error) {
          console.error("Error fetching related products:", error);
        } finally {
          setRelatedLoading(false);
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

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  // Fallback loading component
  const LoadingComponent = () => (
    <div>
      <div>
        <div className="rounded-sm p-4 md:grid md:grid-cols-4 gap-2">
          <div className="relative w-full">
            <div className="sticky top-16 shadow-md bg-gray-300 animate-pulse pb-3">
              <div className="carousel w-full">
                <div className="w-full object-cover h-60 bg-gray-500" />
              </div>
              <div className="flex w-full justify-center gap-2 bottom-0 sticky flex-wrap overflow-y-auto max-h-[153px] animate-pulse">
                <div className="w-14 h-14 bg-gray-500 animate-pulse"></div>
                <div className="w-14 h-14 bg-gray-500 animate-pulse"></div>
                <div className="w-14 h-14 bg-gray-500 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="px-3 pb-3 col-span-2 bg-gray-300 animate-pulse shadow-md space-y-8 pt-4">
            <div className="space-y-3">
              <div className="animate-pulse w-3/4 h-4 rounded-full bg-gray-500"></div>
              <div className="animate-pulse w-2/4 h-4 rounded-full bg-gray-500"></div>
            </div>

            <div className="">
              {[...Array(17)].map((_, i) => (
                <div
                  key={i}
                  className={`animate-pulse h-4 rounded-full my-3 bg-gray-500 ${
                    (i + 1) % 5 === 0 ? "w-3/4 mb-8" : "w-full"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="relative hidden md:block">
            <div className="bg-gray-300 shadow-md p-5 sticky top-16 animate-pulse">
              <div className="flex items-center space-x-3 border-b pb-3 border-gray-700 animate-pulse">
                <div className="w-20 h-12 bg-gray-500 animate-pulse"></div>
                <div className="w-full">
                  <div className="animate-pulse w-full h-4 rounded-full bg-gray-500"></div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-pulse w-1/2 h-8 rounded-md bg-gray-500"></div>
                  <div className="animate-pulse w-20 h-3 rounded-md bg-gray-500"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mt-4">
                  <div className="animate-pulse w-14 h-3 rounded-md bg-gray-500"></div>
                  <div className="animate-pulse w-36 h-3 rounded-md bg-gray-500"></div>
                </div>
              </div>

              <div className="mt-5">
                <div className="w-full animate-pulse bg-gray-500 py-5 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div ref={toTop} className="top-0 absolute z-[-10]" />
      {productLoading ? (
        <LoadingComponent />
      ) : product ? (
        <div>
          <UserNavigation />
          <div className="mx-auto max-w-7xl">
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
                          className="w-full object-contain max-h-80"
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

              {/* Product Information */}
              <div className="px-3 pb-3 col-span-2 bg-white shadow-md space-y-3 pt-4">
                <div className="text-2xl font-bold">{product.name}</div>
                <div className="text-3xl font-bold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(product.price)}
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              {/* Add to Cart Section */}
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
                            type="number"
                            value={quantity}
                            className="h-8 w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            onChange={(e) => {
                              const value = Math.max(
                                1,
                                Math.min(Number(e.target.value), product.stock)
                              ); // Ensure the value stays between 1 and product.stock
                              setQuantity(value);
                            }}
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
              {relatedLoading ? (
                <LoadingComponent />
              ) : relatedProducts.length > 0 ? (
                <div className="flex w-full max-w-[100vw] overflow-x-auto space-x-4 flex-shrink-0 scrollbar">
                  {relatedProducts.map((relatedProduct) => (
                    <div
                      key={relatedProduct.id}
                      className="w-52 bg-white shadow-md flex flex-col flex-shrink-0 "
                    >
                      <img
                        src={`/public/images/products/${relatedProduct.images[0]}`}
                        alt={relatedProduct.name}
                        className="h-52 w-full object-cover rounded-sm"
                      />
                      <div className="p-4 space-y-3">
                        <div className="line-clamp-2 font-bold">
                          {relatedProduct.name}
                        </div>
                        <div className="font-bold">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(relatedProduct.price)}
                        </div>
                        <Link
                          className="block bg-blue-500 text-white text-center rounded-md p-1"
                          to={`/product/${relatedProduct.id}`}
                        >
                          Details
                        </Link>
                        <button
                          onClick={() =>
                            handleAddRelatedToCart({
                              productId: relatedProduct.id,
                            })
                          }
                          className="bg-blue-500 text-white rounded-md p-1 w-full"
                        >
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No related products found</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Product not found</div>
      )}
    </div>
  );
};

export default ProductDetails;
