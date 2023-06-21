import * as React from 'react';
import { DataGrid,GridValueGetterParams  } from '@mui/x-data-grid';
import { Alert, Box, Button, IconButton, MenuItem, Select, Stack, TextField } from "@mui/material"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'
import { useError } from "../../hooks/useError"
import { searchRole, setRoleSearch } from "../../redux/roleSlice"
import { deleteRoleAPI, downloadDocumentRoleAPI } from "../../service/role.service"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default function SearchRole() {
    const { showError } = useError()

    const { roles, recordsFiltered, search, error, role } = useSelector((state) => state.role)
    console.log("roles: ",JSON.stringify(roles));
    const dispatch = useDispatch()

    useEffect(() => {
        const timeout = setTimeout(() => {
            find()
        }, 500)
        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]) // khi redux seearch thay doi, thi se dc goi lai find

    const find = async () => {
        dispatch(searchRole())
    }

    const handleChange = (e) => {
        let newSearch = {
            ...search,
            start: 0,// reset lai trang dau
            [e.target.name]: e.target.value
        }

        //update thay doi redux search
        dispatch(setRoleSearch(newSearch))
    }

    const deleteItem = async (id) => {
        //console.log("delete id",id);
        let { code } = await deleteRoleAPI(id)

        if (code === 200) {
    toast.success("Thanh cong!!", {className: 'toast-message', position: toast.POSITION.BOTTOM_RIGHT, type: 'success', theme: 'colored' })
            find()
        } else {
            showError(code)
        }
    }


    const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
        field: 'name',
        headerName: 'Role',
        //type: 'number',
        width: 150,
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        renderCell: (list) => {
          //console.log("editing table", list.row)
          return ( <div><IconButton aria-label="edit" color="primary" component={Link} to={`/dashboard/role/edit/${list.row.id}`}><EditIcon /></IconButton>
                    <IconButton aria-label="delete" color="primary" onClick={() => deleteItem(list.row.id)}> <DeleteIcon /></IconButton>

          </div>)
        }
  
      },
    ];

const rows = roles;
console.log(roles);

  return (
    <Stack spacing={0} style={{marginTop: -10}}>
      <h2>Danh Sách Phân Quyền</h2>
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
            to={`/dashboard/role/new`}
            size="medium"
          >
            Add Role
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