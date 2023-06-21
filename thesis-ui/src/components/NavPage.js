import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PropTypes from "prop-types";
import "./NavPage.css";

export default function NavigationBar({ isView }) {
  const [activeTab, setActiveTab] = useState("");

  let { logout } = useAuth();
  let navigate = useNavigate();

  const handleLogoutCLick = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfileCLick = () => {
    navigate("/dashboard/user/profile");
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const item = JSON.parse(localStorage.getItem("user"));
  console.log();

  return (
    <div className="nav-bar">
      <div className="nav-left">
        <IconButton
          id="menu-btn"
          size="medium"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <a href="http://www.tlu.edu.vn/">
        <img src="http://www.tlu.edu.vn/Portals/_default/skins/tluvie/images/logo.png" alt="Trường Đại học Thủy lợi" 
        id="nav-logo"
        />
        </a>
      </div>
      <div
        className={`nav-item ${activeTab === "TLU PORTAL" ? "active" : ""}`}
        onClick={() => setActiveTab("Home")}
      >
        GIỚI THIỆU
      </div>
      <div
        className={`nav-item ${activeTab === "NEWS" ? "active" : ""}`}
        onClick={() => setActiveTab("About")}
      >
        TIN TỨC
      </div>
      <div
        className={`nav-item ${activeTab === "LIBRARY" ? "active" : ""}`}
        onClick={() => setActiveTab("Library")}
      >
        THƯ VIỆN
      </div>
      <div
        className={`nav-item ${activeTab === "COMMUNITY" ? "active" : ""}`}
        onClick={() => setActiveTab("Community")}
      >
        CỘNG ĐỒNG
      </div>
      <div
        className={`nav-item ${activeTab === "CONTACT" ? "active" : ""}`}
        onClick={() => setActiveTab("contact")}
      >
        LIÊN HỆ
      </div>

      <div
        className={`nav-item ${activeTab === "Logout" ? "active" : ""}`}
        onClick={() => setActiveTab("Logout")}
      ></div>
      <div>
        <Button onClick={handleClick}>
          <Avatar
            alt=""
            style={{ height: 50, width: 50 }}
            src={`http://localhost:8811/api/user/download/${item.avatar}`}
          />
          <Box style={{ color: "white", marginTop: 5 }}>
            <ArrowDropDownIcon />
          </Box>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: "180px",
            },
          }}
        >
          <MenuItem onClick={handleClose}>
            <ListItemText style={{ marginLeft: 3 }}>
              {item.fullname}
            </ListItemText>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText onClick={handleProfileCLick}>Hồ sơ</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <CircleNotificationsIcon />
            </ListItemIcon>
            <ListItemText>Thông báo</ListItemText>
          </MenuItem>
          <MenuItem style={{}} onClick={handleClose}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText onClick={handleLogoutCLick}>Đăng xuất</ListItemText>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );

  function Logout() {
    return (
      <Link to="/login" onClick={handleLogoutCLick} style={{ marginBottom: 0 }}>
        <Typography> Đăng xuất</Typography>
      </Link>
    );
  }

  function Profile() {
    return (
      <Link
        to="/profile"
        onClick={handleLogoutCLick}
        style={{ marginBottom: 0 }}
      >
        Hồ sơ
      </Link>
    );
  }

  function Notification() {
    return (
      <Link
        to="/notification"
        onClick={handleLogoutCLick}
        style={{ marginBottom: 0 }}
      >
        Thông báo
      </Link>
    );
  }
}
