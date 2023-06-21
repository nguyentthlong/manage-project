import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./page/login/Login";
import Signup from "./page/login/SignUp";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Button, Container } from "@mui/material";
import { Avatar, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { useAuth } from "./hooks/useAuth";
import MainLayout from "./layout/MainLayout";
import { ToastContainer } from "react-toastify";
import { AuthenProvider } from "./context/AuthenContext";
import NewUser from "./page/user/NewUser";
import EditUser from "./page/user/EditUser";
import SearchUser from "./page/user/SearchUser-UI";
import NewThesis from "./page/thesis/NewThesis";
import EditThesis from "./page/thesis/EditThesis";
import SearchThesis from "./page/thesis/SearchThesis-UI";
import EditMajor from "./page/major/EditMajor";
import NewMajor from "./page/major/NewMajor";
import SearchMajor from "./page/major/SearchMajor-UI";
import EditFaculty from "./page/faculty/EditFaculty";
import NewFaculty from "./page/faculty/NewFaculty";
import SearchFaculty from "./page/faculty/SearchFaculty-UI";
import SearchEvaluation from "./page/evaluation/SearchEvaluation-UI";
import NewEvaluation from "./page/evaluation/NewEvaluation";
import EditEvaluation from "./page/evaluation/EditEvaluation";
import SearchStudent from "./page/student/SearchStudent-UI";
import NewStudent from "./page/student/NewStudent";
import EditStudent from "./page/student/EditStudent";
import SearchTeacher from "./page/teacher/SearchTeacher-UI";
import NewTeacher from "./page/teacher/NewTeacher";
import EditTeacher from "./page/teacher/EditTeacher";
import EditDocument from "./page/document/EditDocument";
import NewDocument from "./page/document/NewDocument";
import SearchDocument from "./page/document/SearchDocument-UI";
import SearchRole from "./page/user-role/SearchRole-UI";
import NewRole from "./page/user-role/NewRole";
import EditRole from "./page/user-role/EditRole";
import SearchStatistic from "./page/statistics/SearchStatistic-UI";
import SearchClasses from "./page/classes/SearchClasses-UI";
import NewClasses from "./page/classes/NewClasses";
import EditClasses from "./page/classes/EditClasses";
import Profile from "./page/profile/Profile";

function App() {
  return (
    <Provider store={store}>
      <AuthenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginTemplate />}>
              <Route index element={<Login />} />
            </Route>
            <Route path="/dashboard" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard/user/search" />} />
              <Route path="user/search" element={<SearchUser />} />
              <Route path="user/new" element={<NewUser />} />
              <Route path="user/edit/:id" element={<EditUser />} />
              <Route path="user/profile" element={<Profile />} />
              <Route path="faculty/search" element={<SearchFaculty />} />
              <Route path="faculty/new" element={<NewFaculty />} />
              <Route path="faculty/edit/:id" element={<EditFaculty />} />
              <Route path="major/search" element={<SearchMajor />} />
              <Route path="major/new" element={<NewMajor />} />
              <Route path="major/edit/:id" element={<EditMajor />} />
              <Route path="thesis/search" element={<SearchThesis />} />
              <Route path="thesis/new" element={<NewThesis />} />
              <Route path="thesis/edit/:id" element={<EditThesis />} />
              <Route path="evaluation/search" element={<SearchEvaluation />} />
              <Route path="evaluation/new" element={<NewEvaluation />} />
              <Route path="evaluation/edit/:id" element={<EditEvaluation />} />
              <Route path="student/search" element={<SearchStudent />} />
              <Route path="student/new" element={<NewStudent />} />
              <Route path="student/edit/:id" element={<EditStudent />} />
              <Route path="teacher/search" element={<SearchTeacher />} />
              <Route path="teacher/new" element={<NewTeacher />} />
              <Route path="teacher/edit/:id" element={<EditTeacher />} />
              <Route path="document/search" element={<SearchDocument />} />
              <Route path="document/new" element={<NewDocument />} />
              <Route path="document/edit/:id" element={<EditDocument />} />
              <Route path="role/search" element={<SearchRole />} />
              <Route path="role/new" element={<NewRole />} />
              <Route path="role/edit/:id" element={<EditRole />} />
              <Route path="classes/search" element={<SearchClasses />} />
              <Route path="classes/new" element={<NewClasses />} />
              <Route path="classes/edit/:id" element={<EditClasses />} />v
              <Route path="statistic/search" element={<SearchStatistic />} />
            </Route>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/logout" element={<Navigate to="/login" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthenProvider>
      <ToastContainer />
    </Provider>
  );
}

function LoginTemplate() {
  let { isAuthenticated, isLoading, user } = useAuth();
  let navigate = useNavigate();
  if (isLoading) return <LinearProgress />;

  if (isAuthenticated) {
    console.log(1);
    console.log(user.roles?.findIndex((item) => item.name === "ROLE_ADMIN"));
    const isAdmin =
      user.roles?.findIndex((item) => item.name === "ROLE_ADMIN") >= 0;
    const isStudent =
      user.roles?.findIndex((item) => item.name === "ROLE_STUDENT") >= 0;
    const isTeacher =
      user.roles?.findIndex((item) => item.name === "ROLE_TEACHER") >= 0;

    if (isAdmin) {
      return <Navigate to="/dashboard/user/search" />;
    } else if (isStudent) {
      return <Navigate to="/dashboard/student/search" />;
    } else if (isTeacher) {
      return <Navigate to="/dashboard/teacher/search" />;
    }
  } else {
    return <Outlet />;
  }
}

function NotFound() {
  return (
    <Container maxWidth="md">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack spacing={2} alignItems="center" justifyContent="center">
            <Avatar variant="square" sx={{ width: 40, height: 40 }} />
            <Typography variant="h1">404 Not Found</Typography>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;

