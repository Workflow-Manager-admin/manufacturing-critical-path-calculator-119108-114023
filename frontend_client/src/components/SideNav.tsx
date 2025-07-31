"use client";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 220;

const items = [
  { text: "Dashboard", icon: <DashboardIcon />, route: "/dashboard" },
  { text: "Products", icon: <ListAltIcon />, route: "/dashboard/products" },
  { text: "Operations", icon: <AssignmentIcon />, route: "/dashboard/operations" },
  { text: "Reports", icon: <ListAltIcon />, route: "/dashboard/reports" },
];

export default function SideNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "#fff",
          borderRight: "1px solid #ececec",
        },
      }}
    >
      <Toolbar sx={{ minHeight: 64 }} />
      <List>
        {items.map(({ text, icon, route }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              selected={pathname === route}
              onClick={() => router.push(route)}
            >
              <ListItemIcon sx={{ color: pathname === route ? "primary.main" : "inherit" }}>
                {icon}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
