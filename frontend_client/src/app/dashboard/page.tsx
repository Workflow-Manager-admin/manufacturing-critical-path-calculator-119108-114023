"use client";
import { Box, Typography, Paper, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchProducts, calculateMCT } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import RequireAuth from "../../components/RequireAuth";
import type { Product } from "../../types";

type MCTResult = { total_mct: number };

export default function DashboardHome() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [mctResults, setMctResults] = useState<MCTResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!token) return;
      const prods = await fetchProducts(token);
      setProducts(prods);
      if (prods.length) {
        setLoading(true);
        const results = await Promise.all(
          prods.map((product: Product) => calculateMCT(token, product.id))
        );
        setMctResults(results);
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <RequireAuth>
      <Box>
        <Typography variant="h4" fontWeight={700} mt={2} mb={2} color="primary.main">
          Dashboard
        </Typography>
        <Stack gap={3} direction={{ xs: "column", md: "row" }}>
          {products.map((p, idx) => (
            <Paper
              elevation={2}
              key={p.id}
              sx={{ flex: 1, p: 3, minWidth: 260, borderLeft: "6px solid #f95801" }}
            >
              <Typography variant="h6" fontWeight={600}>
                {p.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {p.description}
              </Typography>
              <Typography fontWeight={500} mt={1}>
                MCT:{" "}
                <span style={{ color: "#f95801", fontWeight: 700 }}>
                  {loading ? "Calculating..." : mctResults[idx]?.total_mct ?? "--"}
                </span>{" "}
                hours
              </Typography>
              <Button
                color="secondary"
                variant="text"
                onClick={() => window.location.assign(`/dashboard/reports?product_id=${p.id}`)}
                sx={{ mt: 2 }}
              >
                View Report
              </Button>
            </Paper>
          ))}
          {!products.length && (
            <Paper elevation={1} sx={{ py: 6, px: 4, textAlign: "center", borderRadius: 2 }}>
              <Typography color="accent.main" fontWeight={500}>
                No products yet.
              </Typography>
              <Typography>Create a product to get started!</Typography>
            </Paper>
          )}
        </Stack>
      </Box>
    </RequireAuth>
  );
}
