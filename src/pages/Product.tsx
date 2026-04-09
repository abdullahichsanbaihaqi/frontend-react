import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/product.api";

export default function Product() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [editId, setEditId] = useState<number | null>(null);

  const fetchData = async () => {
    const res = await getProducts();
    setProducts(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.price) return;

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
  };

  const handleEdit = (p: any) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
    });
    setEditId(p.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus?")) return;

    await deleteProduct(id);
    fetchData();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Product CRUD</h2>

      {/* FORM */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Nama"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Deskripsi"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          placeholder="Harga"
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <button onClick={handleSubmit}>
          {editId ? "Update" : "Tambah"}
        </button>

        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setForm({ name: "", description: "", price: "" });
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* TABLE */}
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Deskripsi</th>
            <th>Harga</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.price}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}