"use client";
import React, { useEffect, useState } from "react";
import {
  Box, Typography, Stack, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, IconButton, InputLabel, FormControl
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchProducts, fetchOperations, createOperation, updateOperation, deleteOperation } from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";
import RequireAuth from "../../../components/RequireAuth";
import type { Product, Operation } from "../../../types";

type OperationForm = {
  name: string;
  step_number: string;
  mct_time: string;
  product_id: string;
};

const emptyOperation: OperationForm = { name: "", step_number: "", mct_time: "", product_id: "" };

export default function OperationsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState(emptyOperation);
  const [filterProduct, setFilterProduct] = useState("");

  const getProducts = async () => token && setProducts(await fetchProducts(token));
  const getOperations = async (productId?: string) => {
    if (!token) return;
    setOperations(await fetchOperations(token, productId ? Number(productId) : undefined));
  };

  useEffect(() => {
    getProducts();
    getOperations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    getOperations(filterProduct);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterProduct]);

  const handleSave = async () => {
    if (!token) return;
    const op = {
      ...form,
      product_id: Number(form.product_id),
      step_number: Number(form.step_number),
      mct_time: Number(form.mct_time),
    };
    if (editIdx === null) await createOperation(token, op);
    else await updateOperation(token, operations[editIdx].id, op);
    setOpen(false);
    setEditIdx(null);
    setForm(emptyOperation);
    getOperations(filterProduct);
  };

  const handleDelete = async (idx: number) => {
    if (!token) return;
    await deleteOperation(token, operations[idx].id);
    getOperations(filterProduct);
  };

  const openEdit = (idx: number) => {
    setEditIdx(idx);
    setForm({
      ...operations[idx],
      product_id: String(operations[idx].product_id),
      step_number: String(operations[idx].step_number),
      mct_time: String(operations[idx].mct_time),
    });
    setOpen(true);
  };

  return (
    <RequireAuth>
      <Box>
        <Typography variant="h4" mb={2} color="primary.main" fontWeight={700}>
          Operations
        </Typography>
        <Box mb={2} display="flex" gap={2} alignItems="center">
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Filter by Product</InputLabel>
            <Select
              label="Filter by Product"
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
            >
              <MenuItem value="">
                <em>Show All</em>
              </MenuItem>
              {products.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            color="secondary"
            onClick={() => {
              setOpen(true);
              setEditIdx(null);
              setForm(emptyOperation);
            }}
            sx={{ borderRadius: 3 }}
          >
            Add Operation
          </Button>
        </Box>
        <Stack gap={2}>
          {operations.length === 0 && (
            <Typography color="accent.main" p={2}>
              No operations found.
            </Typography>
          )}
          {operations.map((o, idx) => (
            <Paper key={o.id} elevation={1} sx={{ p: 3, display: "flex", alignItems: "center", gap: 3, justifyContent: "space-between" }}>
              <Box>
                <Typography fontWeight={600}>
                  [{o.step_number}] {o.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  MCT Time: <b>{o.mct_time}</b> hours
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
          <DialogTitle>{editIdx === null ? "Add Operation" : "Edit Operation"}</DialogTitle>
          <DialogContent sx={{ minWidth: 330 }}>
            <TextField
              label="Step Number"
              value={form.step_number}
              fullWidth
              margin="dense"
              onChange={(e) => setForm((f) => ({ ...f, step_number: e.target.value }))}
            />
            <TextField
              label="Operation Name"
              value={form.name}
              fullWidth
              margin="dense"
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <TextField
              label="MCT Time (hours)"
              value={form.mct_time}
              fullWidth
              margin="dense"
              onChange={(e) => setForm((f) => ({ ...f, mct_time: e.target.value }))}
            />
            <FormControl fullWidth margin="dense" sx={{ mt: 1 }}>
              <InputLabel>Product</InputLabel>
              <Select
                label="Product"
                value={form.product_id}
                onChange={(e) => setForm((f) => ({ ...f, product_id: e.target.value }))}
              >
                {products.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              disabled={!form.name || !form.step_number || !form.mct_time || !form.product_id}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </RequireAuth>
  );
}
