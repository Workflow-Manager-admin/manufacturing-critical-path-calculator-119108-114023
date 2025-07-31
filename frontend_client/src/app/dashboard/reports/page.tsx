"use client";
import React, { useEffect, useState } from "react";
import {
  Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem,
  Table, TableHead, TableRow, TableCell, TableBody, Button
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import { fetchProducts, fetchOperations, calculateMCT } from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";
import RequireAuth from "../../../components/RequireAuth";
import type { Product, Operation } from "../../../types";

function exportTableToCSV(tableId: string, filename: string) {
  const table = document.getElementById(tableId);
  if (!table) return;
  let csv: string = "";
  const rows = table.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    const cols = rows[i].querySelectorAll("td,th");
    const row: string[] = [];
    for (let j = 0; j < cols.length; j++) {
      row.push('"' + cols[j].textContent?.replace(/"/g, '""') + '"');
    }
    csv += row.join(",") + "\n";
  }
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

type MCTResult = { total_mct: number };

export default function ReportsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [operations, setOperations] = useState<Operation[]>([]);
  const [mctResult, setMctResult] = useState<MCTResult | null>(null);

  useEffect(() => {
    (async () => {
      if (!token) return;
      const prods = await fetchProducts(token);
      setProducts(prods);
      if (prods.length) setSelectedProduct(prods[0].id.toString());
    })();
  }, [token]);

  useEffect(() => {
    (async () => {
      if (!token || !selectedProduct) return;
      setOperations(await fetchOperations(token, Number(selectedProduct)));
      setMctResult(await calculateMCT(token, Number(selectedProduct)));
    })();
  }, [token, selectedProduct]);

  return (
    <RequireAuth>
      <Box>
        <Typography variant="h4" color="primary.main" fontWeight={700} mb={2}>
          MCT Report
        </Typography>
        <Paper sx={{ mb: 2, p: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Product</InputLabel>
            <Select
              label="Product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {products.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            startIcon={<PrintIcon />}
            color="primary"
            variant="outlined"
            onClick={() => window.print()}
            sx={{ ml: 1 }}
          >
            Print
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            color="secondary"
            variant="outlined"
            onClick={() => exportTableToCSV("mct-table", "mct_report.csv")}
            sx={{ ml: 1 }}
          >
            Export CSV
          </Button>
        </Paper>
        <Paper sx={{ p: 3 }}>
          {mctResult && (
            <Box mb={2}>
              <Typography fontWeight={600}>
                Total MCT: <span style={{ color: "#f95801" }}>{mctResult.total_mct}</span> hours
              </Typography>
              <Typography variant="body2" color="secondary">
                ({products.find((p) => p.id === Number(selectedProduct))?.name || ""})
              </Typography>
            </Box>
          )}
          <Table id="mct-table">
            <TableHead>
              <TableRow>
                <TableCell>Step</TableCell>
                <TableCell>Operation</TableCell>
                <TableCell>MCT Time (hours)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {operations.map((op) => (
                <TableRow key={op.id}>
                  <TableCell>{op.step_number}</TableCell>
                  <TableCell>{op.name}</TableCell>
                  <TableCell>{op.mct_time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!operations.length && (
            <Typography color="accent.main" p={2}>
              No operations for selected product.
            </Typography>
          )}
        </Paper>
      </Box>
    </RequireAuth>
  );
}
