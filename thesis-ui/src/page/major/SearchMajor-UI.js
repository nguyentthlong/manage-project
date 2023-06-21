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
import { searchMajor, setMajorSearch } from "../../redux/majorSlice";
import { deleteMajorAPI } from "../../service/major.service";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

export default function SearchMajor() {
  const navigate = useNavigate();
  const { showError } = useError();

  const { majors, recordsFiltered, search, error } = useSelector(
    (state) => state.major
  );

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(majors.map);

    const timeout = setTimeout(() => {
      find();
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]); // khi redux seearch thay doi, thi se dc goi lai find

  const handleChange = (e) => {
    let newSearch = {
      ...search,
      start: 0, // reset lai trang dau
      [e.target.name]: e.target.value,
    };

    //update thay doi redux search
    dispatch(setMajorSearch(newSearch));
  };

  const find = async () => {
    dispatch(searchMajor());
  };

  const handleFilterTitleMajor = (value) => {
    dispatch(setMajorSearch({ ...searchMajor, value }));
  };
  useEffect(() => {
    handleFilterTitleMajor("");
  }, []);

  const deleteItem = async (id) => {
    let { code } = await deleteMajorAPI(id);

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
  const handleEdit = (id) => {
    navigate(`/dashboard/major/edit/${id}`);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      //type: 'number',
      width: 90,
    },
    {
      field: "title",
      headerName: "Tên Ngành",
      //type: 'number',
      width: 200,
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
      field: "faculty",
      headerName: "Tên Khoa",
      type: "string",
      valueGetter: (params) => {
        return params.row.faculty.name;
      },
      width: 200,
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: (list) => {
        //console.log("editing table", list.row)
        return (
          <div>
            {/* <IconButton aria-label="edit" color="primary"  component={Link} to={`/dashboard/major/edit/${list.row.id}`}><EditIcon /></IconButton> */}
            <IconButton
              aria-label="edit"
              color="primary"
              onClick={() => handleEdit(list.row.id)}
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

  const rows = majors;

  return (
    <Stack spacing={0} style={{ marginTop: -10 }}>
      <h2>Danh Sách Ngành</h2>
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
            to={`/dashboard/major/new`}
            size="medium"
          >
            Add Major
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
