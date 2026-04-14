import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  const allowedFields = [
    "title",
    "description",
    "price",
    "category",
    "image",
    "stock",
  ];

  //  Load single product (BEST PRACTICE)
  const loadProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setForm(res.data);
    } catch (error) {
      console.error("Error loading product:", error);
      alert("Failed to load product");
    }
  };

  // useEffect with dependency
  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  //  Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // âœ… Submit updated product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/update/${id}`, form);
      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {allowedFields.map((key) => (
          <input
            key={key}
            name={key}
            value={form[key] || ""}
            onChange={handleChange}
            placeholder={key}
            className="w-full border border-gray-300 p-2 rounded"
          />
        ))}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}



