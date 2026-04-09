import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/product.api";

type ProductType = {
  id: number;
  name: string;
  description: string;
  price: number;
};

export default function Product() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [editId, setEditId] = useState<number | null>(null);

  // 🔥 SEARCH & FILTER
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 🔥 PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Gagal load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 FILTER LOGIC
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchMin = minPrice ? p.price >= Number(minPrice) : true;
    const matchMax = maxPrice ? p.price <= Number(maxPrice) : true;

    return matchSearch && matchMin && matchMax;
  });

  // 🔥 PAGINATION LOGIC
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      alert("Nama & harga wajib diisi");
      return;
    }

    try {
      const payload = {
        ...form,
        price: Number(form.price),
      };

      if (editId) {
        await updateProduct(editId, payload);
      } else {
        await createProduct(payload);
      }

      setForm({ name: "", description: "", price: "" });
      setEditId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal submit");
    }
  };

  // 🔥 EDIT
  const handleEdit = (p: ProductType) => {
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
    });
    setEditId(p.id);
  };

  // 🔥 DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus product?")) return;

    try {
      await deleteProduct(id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal hapus");
    }
  };

  return (
    <Layout>
      <div>
        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-6">
          Product Dashboard
        </h1>

        {/* FORM */}
        <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-4 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Nama"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Deskripsi"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            type="number"
            placeholder="Harga"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <button
            className="bg-blue-500 text-white rounded"
            onClick={handleSubmit}
          >
            {editId ? "Update" : "Tambah"}
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="bg-white p-4 rounded shadow mb-4 flex flex-wrap gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Search nama..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <input
            className="border p-2 rounded"
            type="number"
            placeholder="Min harga"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            type="number"
            placeholder="Max harga"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <button
            className="bg-gray-300 px-3 rounded"
            onClick={() => {
              setSearch("");
              setMinPrice("");
              setMaxPrice("");
              setCurrentPage(1);
            }}
          >
            Reset
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded shadow overflow-hidden">
          {loading ? (
            <p className="p-4">Loading...</p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Deskripsi</th>
                  <th className="p-3">Harga</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((p, index) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">
                      {(currentPage - 1) * itemsPerPage +
                        index +
                        1}
                    </td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.description}</td>
                    <td className="p-3">
                      Rp {p.price.toLocaleString()}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        className="bg-yellow-400 px-3 py-1 rounded"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(p.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}

                {currentData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-4">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            className="px-3 py-1 bg-gray-300 rounded"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-300 rounded"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
}