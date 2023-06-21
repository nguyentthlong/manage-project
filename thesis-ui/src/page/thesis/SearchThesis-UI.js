import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
import { searchThesis, setThesisSearch } from "../../redux/thesisSlice";
import { deleteThesisAPI } from "../../service/thesis.service";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { DataGrid } from "@mui/x-data-grid";
export default function SearchThesis() {
  const { showError } = useError();

  const { theses, recordsFiltered, search, error } = useSelector(
    (state) => state.thesis
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
    dispatch(searchThesis());
  };

  const handleChange = (e) => {
    let newSearch = {
      ...search,
      start: 0, // reset lai trang dau
      [e.target.name]: e.target.value,
    };

    //update thay doi redux search
    dispatch(setThesisSearch(newSearch));
  };

  const deleteItem = async (id) => {
    let { code } = await deleteThesisAPI(id);

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
      width: 20,
    },
    {
      field: "title",
      headerName: "Tên luận án",
      //type: 'number',
      width: 250,
      editable: true,
    },
    {
      field: "description",
      headerName: "Mô tả",
      //type: 'number',
      width: 200,
      editable: true,
    },
    {
      field: "teacher.user.fullname",
      headerName: "Giảng viên hướng dẫn",
      type: "string",
      valueGetter: (params) => {
        return params.row?.teacher?.user?.fullname;
      },
      width: 200,
    },
    {
      field: "teacher.teacherCode",
      headerName: "Mã giảng viên",
      type: "string",
      valueGetter: (params) => {
        return params.row?.teacher?.teacherCode;
      },
      width: 130,
    },
    {
      field: "student.user.fullname",
      headerName: "Tên sinh viên",
      type: "string",
      valueGetter: (params1) => {
        return params1.row?.student?.user?.fullname;
      },
      width: 200,
    },
    {
      field: "student.studentCode",
      headerName: "Mã sinh viên",
      type: "string",
      valueGetter: (params) => {
        return params.row?.student?.studentCode;
      },
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: (list) => {
        //console.log("editing table", list.row)
        return (
          <div>
            <IconButton
              aria-label="edit"
              color="primary"
              component={Link}
              to={`/dashboard/thesis/edit/${list.row.id}`}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              color="primary"
              onClick={() => deleteItem(list.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const rows = theses;

  return (
    <Stack spacing={0} style={{ marginTop: -10 }}>
      <h2>Danh Sách Đồ Án</h2>
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
            to={`/dashboard/thesis/new`}
            size="medium"
          >
            Add Thesis
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
