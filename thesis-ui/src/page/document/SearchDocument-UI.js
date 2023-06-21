import * as React from 'react';
import { DataGrid,GridValueGetterParams  } from '@mui/x-data-grid';
import { Alert, Box, Button, IconButton, MenuItem, Select, Stack, TextField } from "@mui/material"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { toast } from 'react-toastify'
import { useError } from "../../hooks/useError"
import { searchDocument, setDocumentSearch } from "../../redux/documentSlice"
import { deleteDocumentAPI, downloadDocumentFileAPI } from "../../service/document.service"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default function SearchDocument() {  
    const { showError } = useError()

    const { documents, recordsFiltered, search, error } = useSelector((state) => state.document)
    console.log(documents, JSON.stringify(documents));
    const dispatch = useDispatch()

    useEffect(() => {
        const timeout = setTimeout(() => {
            find()
        }, 500)
        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]) // khi redux seearch thay doi, thi se dc goi lai find

    const find = async () => {
        dispatch(searchDocument())
    }

    const handleChange = (e) => {
        let newSearch = {
            ...search,
            start: 0,// reset lai trang dau
            [e.target.name]: e.target.value
        }

        //update thay doi redux search
        dispatch(setDocumentSearch(newSearch))
    }

    const deleteItem = async (id) => {
        let { code } = await deleteDocumentAPI(id)

        if (code === 200) {
            toast("Thanh cong!!", { position: toast.POSITION.TOP_RIGHT, type: 'success', theme: 'colored' })
            find()
        } else {
            showError(code)
        }
    }
 
    const downloadItem = async (document) => {
        //console.log("delete id",id);
        await downloadDocumentFileAPI(document)
    }


    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            //type: 'number',
            width: 20,
        },
        {
            field: 'title',
            headerName: 'Tên tài liệu',
            type: 'string',
            width: 200,
        }
        // ,
        // {
        //     field: 'document',
        //     headerName: 'File',
        //     width: 300,
        //     renderCell: (list) => {
        //         console.log(list.row);
        //         if(list.row.document.endsWith(".jpg")) {
        //             return (              
        //                 <img style={{height: 100, width: 100}} src={`http://localhost:8811/api/document/download/${list.row.document}`}/>
        //             )
        //         }  else if(list.row.document.endsWith(".png")) {
        //             return (              
        //                 <img style={{height: 100, width: 100}} src={`http://localhost:8811/api/document/download/${list.row.document}`}/>
        //             )
        //         }  
        //         else {
        //             return (              
        //                 `${list.row.document}`
        //             )
        //         }
        //       }
        // }
        ,{
            field: 'user',
            headerName: 'Chủ sở hữu',
            type: 'string',
            valueGetter: (params1) => {
                return params1.row.user.fullname;
            },
            width: 150,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (list) => {
              //console.log("editing table", list.row)

              return ( 
              <div>
                <IconButton aria-label="edit" color="primary" component={Link} to={`/dashboard/document/edit/${list.row.id}`}><EditIcon /></IconButton>
                <IconButton aria-label="delete" color="primary" onClick={() => deleteItem(list.row.id)}> <DeleteIcon /></IconButton>
                <IconButton aria-label="download" color="primary" onClick={() => downloadItem(list.row.document)}> <FileDownloadIcon /></IconButton>
              </div>)
            }
      
          },
        ];
    
    const rows = documents;
    
      return (
        <Stack spacing={0} style={{marginTop: -10}}>
      <h2>Danh Sách Tài Liệu</h2>
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
            to={`/dashboard/document/new`}
            size="medium"
          >
            Add Document
          </Button>
        </Box>
      </Stack>
      <DataGrid
        sx={{ minHeight: 500 , maxHeight: 500}}
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </Stack>
      );
    }