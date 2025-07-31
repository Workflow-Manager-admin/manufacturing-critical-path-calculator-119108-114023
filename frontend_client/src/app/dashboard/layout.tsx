"use client";
import React from "react";
import { Box } from "@mui/material";
import SideNav from "../../components/SideNav";
import TopBar from "../../components/TopBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box display="flex" height="100vh">
      <SideNav />
      <Box flexGrow={1} flexDirection="column" sx={{ background: "#fafafa", minWidth: 0 }}>
        <TopBar />
        <Box p={3} sx={{ height: "calc(100vh - 64px)", overflowY: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
