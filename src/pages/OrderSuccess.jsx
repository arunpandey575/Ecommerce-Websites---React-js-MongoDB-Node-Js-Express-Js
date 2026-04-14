import { useParams, useNavigate } from "react-router";

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600">
        Order Placed Successfully
      </h1>

      <p className="mt-4">
        Your Order ID:
        <span className="font-semibold">{id ? id : "Not Available"}</span>
      </p>

      <button
        onClick={goHome}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Continue Shopping
      </button>
    </div>
  );
}
