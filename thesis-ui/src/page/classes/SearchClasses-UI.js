import * as React from 'react';
import { DataGrid,GridValueGetterParams  } from '@mui/x-data-grid';
import { Alert, Box, Button, IconButton, MenuItem, Select, Stack, TextField } from "@mui/material"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { toast } from 'react-toastify'
import { useError } from "../../hooks/useError"
import { deleteClassesAPI } from "../../service/classes.service"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { searchClass, setClasssSearch } from '../../redux/classesSlice';


export default function SearchClasses() {  
    const { showError } = useError()

    const { classes, recordsFiltered, search, error } = useSelector((state) => state.classs)
    // console.log(classes, JSON.stringify(classes));
    const dispatch = useDispatch()

    useEffect(() => {
        const timeout = setTimeout(() => {
            find()
        }, 500)
        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]) // khi redux seearch thay doi, thi se dc goi lai find

    const find = async () => {
        dispatch(searchClass())
    }

    const handleChange = (e) => {
        let newSearch = {
            ...search,
            start: 0,// reset lai trang dau
            [e.target.name]: e.target.value
        }

        //update thay doi redux search
        dispatch(setClasssSearch(newSearch))
    }

    const handleFilterTitleClasses = (value) => {
      dispatch(setClasssSearch({ ...searchClass, value }));
    };
    useEffect(() => {
      handleFilterTitleClasses("");
    }, []);

    const deleteItem = async (id) => {
        let { code } = await deleteClassesAPI(id)

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
            width: 10,
        },
        {
            field: 'name',
            headerName: 'Tên lớp',
            width: 200,
        },{
          field: 'major',
          headerName: 'Chuyên ngành',
          type: 'string',
          valueGetter: (params1) => {
              return params1.row.major.title;
          },
          width: 200,
      },{
        field: 'teacher.user',
        headerName: 'Giáo Viên Chủ Nhiệm',
        type: 'string',
        valueGetter: (params1) => {
            return params1.row.teacher.user.fullname;
        },
        width: 200,
    },
    {
      field: 'teacher.faculty',
      headerName: 'Khoa',
      type: 'string',
      valueGetter: (params1) => {
          return params1.row.teacher.faculty.name;
      },
      width: 200,
  },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (list) => {
              return ( <div><IconButton aria-label="edit" color="primary" component={Link} to={`/dashboard/classes/edit/${list.row.id}`}><EditIcon /></IconButton>
                        <IconButton aria-label="delete" color="primary" onClick={() => deleteItem(list.row.id)}> <DeleteIcon /></IconButton>
              </div>)
            }
      
          },
        ];
    
    const rows = classes;
    
      return (
        <Stack spacing={0} style={{marginTop: -10}}>
      <h2>Danh Sách Lớp</h2>
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
            to={`/dashboard/classes/new`}
            size="medium"
          >
            Add Class
          </Button>
        </Box>
      </Stack>
      <DataGrid
        sx={{ minHeight: 500 , maxHeight: 500 }}
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </Stack>
      );
    }