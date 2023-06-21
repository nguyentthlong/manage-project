import * as React from 'react';
import { DataGrid,GridValueGetterParams  } from '@mui/x-data-grid';
import { Alert, Box, Button, IconButton, MenuItem, Select, Stack, TextField } from "@mui/material"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { toast } from 'react-toastify'
import { useError } from "../../hooks/useError"
import { searchFaculty, setFacultySearch } from "../../redux/facultySlice"
import { deleteFacultyAPI } from "../../service/faculty.service"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';


export default function SearchFaculty() {  
    const { showError } = useError()

    const { faculties, recordsFiltered, search, error } = useSelector((state) => state.faculty)
    console.log(faculties, JSON.stringify(faculties));
    const dispatch = useDispatch()

    useEffect(() => {
        const timeout = setTimeout(() => {
            find()
        }, 500)
        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]) // khi redux seearch thay doi, thi se dc goi lai find

    const find = async () => {
        dispatch(searchFaculty())
    }

    const handleChange = (e) => {
        let newSearch = {
            ...search,
            start: 0,// reset lai trang dau
            [e.target.name]: e.target.value
        }

        //update thay doi redux search
        dispatch(setFacultySearch(newSearch))
    }

    const handleFilterTitleFaculty = (value) => {
      dispatch(setFacultySearch({ ...searchFaculty, value }));
    };
    useEffect(() => {
      handleFilterTitleFaculty("");
    }, []);

    const deleteItem = async (id) => {
        let { code } = await deleteFacultyAPI(id)

        if (code === 200) {
            toast("Thanh cong!!", {className: 'toast-message', position: toast.POSITION.TOP_RIGHT, type: 'success', theme: 'colored' })
            find()
        } else {
            showError(code)
        }
    }
 

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            //type: 'number',
            width: 90,
        },
        {
            field: 'name',
            headerName: 'Tên Khoa',
            width: 200,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 130,
            renderCell: (list) => {
              //console.log("editing table", list.row)
              return ( <div><IconButton aria-label="edit" color="primary" component={Link} to={`/dashboard/faculty/edit/${list.row.id}`}><EditIcon /></IconButton>
                        <IconButton aria-label="delete" color="primary" onClick={() => deleteItem(list.row.id)}> <DeleteIcon /></IconButton>
              </div>)
            }
      
          },
        ];
    
    const rows = faculties;
    
      return (
        <Stack spacing={0} style={{marginTop: -10}}>
      <h2>Danh Sách Khoa</h2>
      <Stack direction={"row"} spacing={2} style={{marginTop: -15}} alignItems={"center"}>
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
            to={`/dashboard/faculty/new`}
            size="medium"
          >
            Add Faculty
          </Button>
        </Box>
      </Stack>
      <DataGrid
        sx={{minHeight: 500 , maxHeight: 500 }}
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </Stack>
      );
    }