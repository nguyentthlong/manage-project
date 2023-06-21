import * as React from "react";
import {
  DataGrid
} from "@mui/x-data-grid";
import {
  Button,
  IconButton, TextField
} from "@mui/material";
import {
  Stack
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useError } from "../../hooks/useError";
import { searchUser, setUserSearch } from "../../redux/userSlice";
import {
  deleteUserAPI,
  downloadDocumentUserAPI,
} from "../../service/user.service";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { Box } from "@material-ui/core";

export default function SearchUser() {
  const { showError } = useError();

  const { users, recordsFiltered, totalElements, search, error, user } =
    useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      find();
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]); // khi redux seearch thay doi, thi se dc goi lai find

  const find = async () => {
    dispatch(searchUser());
  };

  const handleChange = (e) => {
    let newSearch = {
      ...search,
      start: 0, // reset lai trang dau
      [e.target.name]: e.target.value,
    };

    //update thay doi redux search
    dispatch(setUserSearch(newSearch));
  };

  const deleteItem = async (id) => {
    //console.log("delete id",id);
    let { code } = await deleteUserAPI(id);

    if (code === 200) {
      toast("Thanh cong !!!", {
        position: toast.POSITION.TOP_RIGHT,
        type: "success",
        theme: "colored",
      });
      find();
    } else {
      showError(code);
    }
  };

  const downloadItem = async (document) => {
   await downloadDocumentUserAPI(document);
  };

  const handleFilterTitleUser = (value) => {
    dispatch(setUserSearch({ ...searchUser, value }));
  };
  useEffect(() => {
    handleFilterTitleUser("");
  }, []);
  
  const columns = [
    { field: "id", headerName: "ID", width: 10 },
    {
      field: "avatar",
      headerName: "Avatar",
      width: 100,

      renderCell: (list) => {
        console.log(list.row);
        return (
          <img
            style={{ height: 70, width: 70 }}
            src={`http://localhost:8811/api/user/download/${list.row.avatar}`}
          />
        );
      },
    },
    {
      field: "fullname",
      headerName: "Họ tên",
      width: 150,
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      width: 120,
    },
    {
      field: "phoneNumber",
      headerName: "Số điện thoại",
      width: 150,
    },
    {
      field: "birthdate",
      headerName: "Ngày sinh",
      width: 100,
    },
    {
      field: "gender",
      headerName: "Giới tính",
      width: 80,
    },
    {
      field: "email",
      headerName: "Email",
      //type: 'number',
      width: 210,
    },
    {
      field: "role",
      headerName: "Role",
      type: "string",
      valueGetter: (params) => {
        return params.row.roles[0].name;
      },
      width: 140,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (list) => {
        //console.log("editing table", list.row)
        return (
          <Box>
            <IconButton
              aria-label="edit"
              color="primary"
              component={Link}
              to={`/dashboard/user/edit/${list.row.id}`}
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
            <IconButton
              aria-label="download"
              color="primary"
              onClick={() => downloadItem(list.row.avatar)}
            >
              {" "}
              <FileDownloadIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const rows = users;

  return (
    <Stack spacing={0} style={{marginTop: -10}}>
      <h2>Danh Sách Người Dùng</h2>
      <Stack direction={"row"} spacing={2} style={{marginTop: 0}} alignItems={"center"}>
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
            to={`/dashboard/user/new`}
            size="medium"
          >
            Add User
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
