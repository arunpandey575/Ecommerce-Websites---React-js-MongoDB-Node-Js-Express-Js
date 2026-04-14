import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function Checkout() {
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState(null);

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    const loadData = async () => {
      try {
        const cartRes = await api.get(`/cart/${userId}`);
        const addressRes = await api.get(`/address/${userId}`);

        setCart(cartRes.data);
        setAddress(addressRes.data);

        if (addressRes.data.length > 0) {
          setSelectedAddress(addressRes.data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [userId, navigate]);

  // Loader safety
  if (!cart || !cart.items) {
    return <div>Loading...</div>;
  }

  const total = cart.items.reduce((sum, i) => {
    return sum + (i.productId?.price || 0) * i.quantity;
  }, 0);

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        alert("Please select an address");
        return;
      }

      // API call
      const res = await api.post("/order/place", {
        userId,
        address: selectedAddress,
      });

      alert("Order placed successfully");

      //  IMPORTANT FIX: send order ID in URL
      navigate(`/order-success/${res.data._id}`);
    } catch (error) {
      console.error(error);
      alert("Order failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <h2 className="font-semibold mb-2">Select Address</h2>

      {address.length === 0 ? (
        <p>No address found</p>
      ) : (
        address.map((addr) => (
          <div
            key={addr._id}
            onClick={() => setSelectedAddress(addr)}
            className={`border p-4 mb-4 cursor-pointer rounded ${
              selectedAddress?._id === addr._id
                ? "border-green-500"
                : "border-gray-300"
            }`}
          >
            <p>{addr.fullName}</p>
            <p>{addr.phone}</p>
            <p>
              {addr.addressLine}, {addr.city}, {addr.state}, {addr.pincode}
            </p>
          </div>
        ))
      )}

      <h2 className="font-semibold mb-2">Order Summary</h2>

      {cart.items.map((item) => (
        <div key={item._id} className="flex justify-between mb-2">
          <span>{item.productId?.title}</span>
          <span>₹{(item.productId?.price || 0) * item.quantity}</span>
        </div>
      ))}

      <p className="font-bold mt-4">Total Amount: ₹{total}</p>

      <button
        onClick={placeOrder}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Place Order (COD)
      </button>
    </div>
  );
}
