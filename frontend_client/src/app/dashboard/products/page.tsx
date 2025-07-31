"use client";
import { Box, Typography, Button, Paper, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState, useEffect } from "react";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";
import RequireAuth from "../../../components/RequireAuth";
import type { Product } from "../../../types";

type ProductForm = { name: string; description: string };
const emptyProduct: ProductForm = { name: "", description: "" };

export default function ProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState(emptyProduct);

  const getProducts = async () => {
    if (!token) return;
    setProducts(await fetchProducts(token));
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSave = async () => {
    if (!token) return;
    if (editIdx === null) {
      await createProduct(token, form);
    } else {
      await updateProduct(token, products[editIdx].id, form);
    }
    setOpen(false);
    setEditIdx(null);
    setForm(emptyProduct);
    getProducts();
  };

  const handleDelete = async (idx: number) => {
    if (!token) return;
    await deleteProduct(token, products[idx].id);
    getProducts();
  };

  const openEdit = (idx: number) => {
    setEditIdx(idx);
    setForm({ ...products[idx] });
    setOpen(true);
  };

  return (
    <RequireAuth>
      <Box>
        <Typography variant="h4" mb={2} color="primary.main" fontWeight={700}>
          Products
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="secondary"
          sx={{ mb: 3, borderRadius: 3 }}
          onClick={() => {
            setForm(emptyProduct);
            setEditIdx(null);
            setOpen(true);
          }}
        >
          Add Product
        </Button>
        <Stack gap={2}>
          {products.length === 0 && (
            <Typography color="accent.main" p={2}>
              No products found.
            </Typography>
          )}
          {products.map((p, idx) => (
            <Paper
              key={p.id}
              elevation={1}
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography fontWeight={600}>{p.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {p.description}
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={() => openEdit(idx)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(idx)} color="secondary">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Stack>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>
            {editIdx === null ? "Add Product" : "Edit Product"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              label="Product Name"
              value={form.name}
              fullWidth
              sx={{ my: 1 }}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <TextField
              label="Description"
              value={form.description}
              fullWidth
              multiline
              minRows={2}
              sx={{ my: 1 }}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="accent">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              disabled={!form.name}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </RequireAuth>
  );
}
