import { useEffect, useState } from "react";
import axios from "axios";
import SuperAdminNavigation from "../../components/navigations/super-admin-navigation";
import { format } from "date-fns";

const SuperAdminTransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTransaction = async () => {
    try {
      const response = await axios.get("/api/transaction/show");

      console.log(response.data);
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching transactions", error);
      setError("Error fetching transactions");
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  return (
    <div className="flex">
      <div className="w-1/5">
        <SuperAdminNavigation />
      </div>

      <div className="w-4/5 p-5">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="bg-white p-4 shadow-md ">
                <div className="flex justify-between border-b pb-2">
                  <div>
                    <div>
                      Transaction ID : <b>{transaction.id}</b>
                    </div>
                    <div>
                      User : <b>{transaction.User.username}</b>
                    </div>
                    <div>
                      Total :{" "}
                      <b>
                        Rp.
                        {Intl.NumberFormat("id-ID", {}).format(
                          transaction.total_price
                        )}
                      </b>
                    </div>
                  </div>

                  <div>
                    <div>
                      Date :{" "}
                      <b>
                        {transaction.updated_at
                          ? format(
                              new Date(transaction.updated_at),
                              "EEE-MMM-yyyy"
                            )
                          : "N/A"}
                      </b>
                    </div>
                    <div>
                      Time :{" "}
                      <b>
                        {transaction.updated_at
                          ? format(new Date(transaction.updated_at), "HH:mm")
                          : "N/A"}
                      </b>
                    </div>
                    <div>
                      Status :{" "}
                      <b className={"uppercase"}>{transaction.status}</b>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 flex-wrap pt-1">
                  {Array.isArray(transaction.products) &&
                  transaction.products.length > 0
                    ? transaction.products.map((product, index) => (
                        <div key={index}>
                          <div>
                            <img
                              src={`/public/images/products/${product.image}`}
                              alt=""
                              className="w-36 object-cover"
                            />
                          </div>
                          <p>{product.product_name}</p>
                          <p>
                            Rp.{" "}
                            <b>
                              {Intl.NumberFormat("id-ID", {}).format(
                                product.price
                              )}
                            </b>
                          </p>
                          <p>Quantity: {product.quantity}</p>
                        </div>
                      ))
                    : "No products"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminTransactionPage;
