"use client";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/past-customers", label: "Past Customers" },
  { href: "/book", label: "Book Appointment" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <AppBar position="sticky" elevation={0} color="transparent">
      <Toolbar sx={{ minHeight: { xs: 72, md: 84 }, px: { xs: 2, md: 4 } }}>
        <Box
          component={Link}
          href="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, md: 1.5 },
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              position: "relative",
              flexShrink: 0,
              width: { xs: 72, md: 88 },
              height: { xs: 48, md: 59 },
            }}
          >
            <Image
              src="/Logo_BR.PNG"
              alt=""
              fill
              sizes="88px"
              style={{ objectFit: "contain" }}
              priority
            />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: 18, md: 22 },
                color: "white",
                lineHeight: 1.1,
              }}
            >
              Pau-Nafeesah
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                letterSpacing: "0.34em",
                color: "info.main",
                textTransform: "uppercase",
                mt: 0.3,
              }}
            >
              Beauty Room
            </Typography>
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Button
                key={link.href}
                href={link.href}
                color={active ? "primary" : "inherit"}
                variant={active ? "contained" : "text"}
                sx={{
                  color: active ? "white" : "text.secondary",
                  "&:hover": { color: "white" },
                }}
              >
                {link.label}
              </Button>
            );
          })}
        </Stack>
        <IconButton
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          sx={{ display: { md: "none" }, color: "white" }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { width: 280, backgroundColor: "#0E0E12", p: 2 } } }}
      >
        <Stack direction="row" sx={{ mb: 2, justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Menu</Typography>
          <IconButton aria-label="Close menu" onClick={() => setOpen(false)} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack spacing={1}>
          {links.map((link) => (
            <Button
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              variant={pathname === link.href ? "contained" : "text"}
              sx={{ justifyContent: "flex-start" }}
            >
              {link.label}
            </Button>
          ))}
        </Stack>
      </Drawer>
    </AppBar>
  );
}
