import * as React from "react";
import { DataGrid, GridValueGetterParams } from "@mui/x-data-grid";
import {
  Alert,
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useError } from "../../hooks/useError";
import { searchStudent, setStudentSearch } from "../../redux/studentSlice";
import { deleteStudentAPI } from "../../service/student.service";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

export default function SearchStudent() {
  const { showError } = useError();

  const { students, recordsFiltered, search, error } = useSelector(
    (state) => state.student
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      find();
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]); // khi redux seearch thay doi, thi se dc goi lai find

  const find = async () => {
    dispatch(searchStudent());
  };

  const handleChange = (e) => {
    let newSearch = {
      ...search,
      start: 0, // reset lai trang dau
      [e.target.name]: e.target.value,
    };

    //update thay doi redux search
    dispatch(setStudentSearch(newSearch));
  };

  const deleteItem = async (id) => {
    let { code } = await deleteStudentAPI(id);

    if (code === 200) {
      toast("Thanh cong!!", {
        position: toast.POSITION.TOP_RIGHT,
        type: "success",
        theme: "colored",
      });
      find();
    } else {
      showError(code);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      //type: 'number',
      width: 10,
    },
    {
      field: "studentCode",
      headerName: "Mã Sinh Viên",
      //type: 'number',
      width: 110,
    },
    {
      field: "user.fullname",
      headerName: "Tên sinh viên",
      type: "string",
      valueGetter: (params1) => {
        return params1.row?.user?.fullname;
      },
      width: 150,
    },
    {
      field: "major",
      headerName: "Chuyên ngành",
      type: "string",
      valueGetter: (params1) => {
        return params1.row.major?.title;
      },
      width: 180,
    },
    {
      field: "studentClass",
      headerName: "Lớp",
      type: "string",
      valueGetter: (params1) => {
        return params1.row?.studentClass?.name;
      },
      width: 200,
    },
    {
      field: "user.email",
      headerName: "Email",
      type: "string",
      valueGetter: (params1) => {
        return params1.row?.user?.email;
      },
      width: 200,
    },
    {
      field: "user.address",
      headerName: "Địa chỉ",
      type: "string",
      valueGetter: (params1) => {
        return params1.row?.user?.address;
      },
      width: 100,
    },
    {
      field: "user.birthdate",
      headerName: "Ngày sinh",
      type: "string",
      valueGetter: (params1) => {
        return params1.row?.user?.birthdate;
      },
      width: 100,
    },
    {
      field: "user.gender",
      headerName: "Giới tính",
      type: "string",
      valueGetter: (params1) => {
        return params1.row?.user?.gender;
      },
      width: 100,
    },
    {
      field: "user.phoneNumber",
      headerName: "SĐT",
      type: "string",
      valueGetter: (params1) => {
        return params1.row?.user?.phoneNumber;
      },
      width: 110,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (list) => {
        //console.log("editing table", list.row)
        return (
          <div>
            <IconButton
              aria-label="edit"
              color="primary"
              component={Link}
              to={`/dashboard/student/edit/${list.row.id}`}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              color="primary"
              onClick={() => deleteItem(list.row.id)}
            >
              {" "}
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const rows = students;

  return (
    <Stack spacing={0} style={{ marginTop: -10 }}>
      <h2>Danh Sách Sinh Viên</h2>
      <Stack
        direction={"row"}
        spacing={2}
        style={{ marginTop: -15 }}
        alignItems={"center"}
      >
        <TextField
          label="Tìm kiếm"
          variant="standard"
          name="value"
          value={search.value}
          onChange={handleChange}
          size="small"
        />
        <Box>
          <Button
            variant="contained"
            endIcon={<AddOutlinedIcon color=" " />}
            component={Link}
            to={`/dashboard/student/new`}
            size="medium"
          >
            Add Student
          </Button>
        </Box>
      </Stack>
      <DataGrid
        sx={{ minHeight: 500, maxHeight: 500 }}
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </Stack>
  );
}
