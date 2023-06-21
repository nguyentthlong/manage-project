import React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Stack, Typography } from "@mui/material";
import './Footer.css'

export default function Footer() {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        height: 50,
        backgroundColor: '#0073a5',
        marginTop: 0,
        width: "100%",
      }}
    >
      <Stack justifyItems={"center"} alignItems={"center"} py={0} >
        <Typography sx={{ textAlign: "center" , color: '#fff', marginTop: 0.2, marginBottom: -1}}>
          &copy; {new Date().getFullYear()} - Nguyễn Thành Long. All rights
          reserved.
        </Typography>
        <Stack direction={"row"} justifyItems={"center"} >
          <a className="icon-footer" href="https://github.com/">
            <GitHubIcon />
          </a>
          <a className="icon-footer" href="https://www.google.com.vn/">
            <GoogleIcon />
          </a>
          <a className="icon-footer" href="https://www.facebook.com/">
            <FacebookIcon />
          </a>
        </Stack>
      </Stack>
    </footer>
  );
}
