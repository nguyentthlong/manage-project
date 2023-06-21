import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";

export default function Header() {
  const [activeTab, setActiveTab] = React.useState("");

  return (
    <div className="nav-bar">
      <div className="nav-left">
        <IconButton
          id="menu-btn"
          size="large"
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
        onClick={() => setActiveTab("News")}
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
        id="notification-btn"
        className={`nav-item`}
      >
        <CircleNotificationsIcon />
      </div>
    </div>
  );
}
