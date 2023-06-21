import React from "react";
import SideBar from "../components/Sidebar";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button, Grid, LinearProgress } from "@mui/material";
import Footer from "../components/Footer";
import NavigationBar from "../components/NavPage";

const MainLayout = () => {
  let { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LinearProgress />;

  if (isAuthenticated)
    return ( 
      <>
        <Grid container mb={0}>
          <Grid item xs={12}>
            <NavigationBar />
          </Grid>
          <Grid item xs={12} container spacing={1} >
            <Grid item sx={12} sm={3} style={{marginBottom: -70}}>
              <SideBar />
            </Grid>
            <Grid item sx={12} sm={9} style={{marginLeft: -80}}>
              <Outlet />
            </Grid>
            <Footer />
          </Grid>
        </Grid>
      </>
    );

  return <Navigate to={"/login"} />;
};

export default MainLayout;
