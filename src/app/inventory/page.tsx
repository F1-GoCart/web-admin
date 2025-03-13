"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Database } from "../../../database.types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";

type Product = Database["public"]["Tables"]["product_details"]["Row"];

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("product_details")
      .select(
        "id, name, category, aisle, stock, price, is_sale, promo_price, created_at, image, size"
      );

    if (error) {
      console.error("Error fetching products:", error);
      return;
    }
    setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel("product_details")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "product_details" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setProducts((prev) => [...prev, payload.new as Product]);
          } else if (payload.eventType === "UPDATE") {
            setProducts((prev) =>
              prev.map((p) =>
                p.id === payload.new.id ? (payload.new as Product) : p
              )
            );
          } else if (payload.eventType === "DELETE") {
            setProducts((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteProduct = async (id: number) => {
    const { error } = await supabase
      .from("product_details")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error deleting product:", error);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const updateProduct = async () => {
    if (!editingProduct) return;
    const { error } = await supabase
      .from("product_details")
      .update(editingProduct)
      .eq("id", editingProduct.id);

    if (error) {
      console.error("Error updating product:", error);
    } else {
      closeModal();
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">
        <div className="flex justify-between items-center gap-2">
          <span>Products</span>
          <Button className="text-sm">Add Inventory</Button>
        </div>
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>PRODUCT</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>LOCATION</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>PRICE</TableHead>
            <TableHead>SALE</TableHead>
            <TableHead className="text-right">ACTION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.id}</TableCell>
              <TableCell className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name || "Product"}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <span>{product.name}</span>
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.aisle}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                {product.is_sale && product.promo_price ? (
                  <span className="text-red-500">
                    <s>${product.price}</s> ${product.promo_price}
                  </span>
                ) : (
                  `$${product.price}`
                )}
              </TableCell>
              <TableCell>{product.is_sale ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right">
                <Button
                  className="bg-green-400"
                  onClick={() => openEditModal(product)}
                >
                  <Edit />
                </Button>
                <Button
                  className="bg-red-400 ml-2"
                  onClick={() => deleteProduct(product.id)}
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/10 z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>

            <label className="block mb-2">
              <span className="text-sm font-medium">Product Name</span>
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={editingProduct.name || ""}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm font-medium">Price</span>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: Number(e.target.value),
                  })
                }
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm font-medium">Stock</span>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={editingProduct.stock ?? ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    stock: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </label>

            <div className="flex justify-end gap-2 mt-4">
              <Button className="bg-gray-400" onClick={closeModal}>
                Cancel
              </Button>
              <Button className="bg-blue-500" onClick={updateProduct}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
