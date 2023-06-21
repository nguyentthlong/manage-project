import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  Accessibility, PeopleAlt
} from "@mui/icons-material";
import FolderIcon from '@mui/icons-material/Folder';
import InsertChartIcon from "@mui/icons-material/InsertChart";
import { NavLink } from "react-router-dom";
import ClassIcon from '@mui/icons-material/Class';
import CategoryIcon from "@mui/icons-material/Category";
import CommentIcon from "@mui/icons-material/Comment";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../hooks/useAuth";
import { Stack, } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  link: {
    color: "inherit",
    textDecoration: "none",
    ".makeStyles-link-18 active": {
      // backgroundColor: theme.palette.action.selected,
    },
  },
}));

export default function SideBar() {
  let { user } = useAuth();
  const classes = useStyles();

  const isAdmin =
    user.roles?.findIndex((item) => item.name === "ROLE_ADMIN") >= 0;
  const isStudent =
    user.roles?.findIndex((item) => item.name === "ROLE_STUDENT") >= 0;
  const isTeacher =
    user.roles?.findIndex((item) => item.name === "ROLE_TEACHER") >= 0;

  return (
    <Stack spacing={0.8} p={1} mt={1} style={{ maxWidth: 251, }}>
      {isAdmin && (
        <NavLink to="/dashboard"  className={classes.link}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Accessibility />
              </ListItemIcon>
              <ListItemText primary="Quản Lý Người Dùng" />
            </ListItemButton>
          </ListItem>
        </NavLink>
      )}

{(isAdmin || isStudent || isTeacher) && (
        <NavLink to="/dashboard/classes/search"  className={classes.link}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ClassIcon />
              </ListItemIcon>
              <ListItemText primary="Quản Lý Lớp" />
            </ListItemButton>
          </ListItem>
        </NavLink>
      )}

      {(isAdmin || isStudent || isTeacher) && (
        <NavLink to="/dashboard/student/search"  className={classes.link}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Quản Lý Sinh Viên" />
            </ListItemButton>
          </ListItem>
        </NavLink>
      )}

      {(isAdmin || isTeacher) && (
        <NavLink to="/dashboard/teacher/search"  className={classes.link}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Quản Lý Giảng Viên" />
            </ListItemButton>
          </ListItem>
        </NavLink>
      )}

      {isAdmin && (
        <NavLink to="/dashboard/role/search"  className={classes.link}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PeopleAlt />
              </ListItemIcon>
              <ListItemText primary="Phân Quyền" />
            </ListItemButton>
          </ListItem>
        </NavLink>
      )}

      {isAdmin && (
        <NavLink to="/dashboard/statistic/search"  className={classes.link}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InsertChartIcon />
              </ListItemIcon>
              <ListItemText primary="Thống Kê" />
            </ListItemButton>
          </ListItem>
        </NavLink>
      )}

      {(isAdmin || isStudent || isTeacher) && (
        <NavLink to="/dashboard/document/search"  className={classes.link}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Quản Lý Tài Liệu" />
            </ListItemButton>
          </ListItem>
        </NavLink>
      )}

      {(isAdmin || isStudent || isTeacher) && (
        <NavLink to="/dashboard/faculty/search"  className={classes.link}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Quản Lý Khoa" />
            </ListItemButton>
          </ListItem>
        </NavLink>
      )}

      {(isAdmin || isStudent || isTeacher) && (
        <NavLink to="/dashboard/major/search"  className={classes.link}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Quản Lý Ngành" />
            </ListItemButton>
          </ListItem>
        </NavLink>
      )}

      {(isAdmin || isStudent || isTeacher) && (
        <NavLink to="/dashboard/thesis/search"  className={classes.link}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Quản Lý Đồ Án-Khóa Luận" />
            </ListItemButton>
          </ListItem>
        </NavLink>
      )}

      {(isAdmin || isStudent || isTeacher) && (
        <NavLink to="/dashboard/evaluation/search"  className={classes.link}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <CommentIcon />
              </ListItemIcon>
              <ListItemText primary="Quản Lý Đánh Giá" />
            </ListItemButton>
          </ListItem>
        </NavLink>
      )}
    </Stack>
  );
}
