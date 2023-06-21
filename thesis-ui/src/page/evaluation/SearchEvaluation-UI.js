import * as React from 'react';
import { DataGrid,GridValueGetterParams  } from '@mui/x-data-grid';
import { Alert, Box, Button, IconButton, MenuItem, Select, Stack, TextField } from "@mui/material"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { toast } from 'react-toastify'
import { useError } from "../../hooks/useError"
import { deleteEvaluationAPI } from "../../service/evaluation.service"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { searchEvaluation, setEvaluationSearch } from '../../redux/evaluationSlice';

export default function SearchEvaluation() {  
    const { showError } = useError()

    const { evaluations, recordsFiltered, search, error } = useSelector((state) => state.evaluation)

    console.log("evaluations: ",JSON.stringify(evaluations));
    const dispatch = useDispatch()

    useEffect(() => {
        const timeout = setTimeout(() => {
            find()
        }, 500)
        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]) // khi redux seearch thay doi, thi se dc goi lai find

    const find = async () => {
        dispatch(searchEvaluation())
    }

    const handleChange = (e) => {
        let newSearch = {
            ...search,
            start: 0,// reset lai trang dau
            [e.target.name]: e.target.value
        }

        //update thay doi redux search
        dispatch(setEvaluationSearch(newSearch))
    }

    const deleteItem = async (id) => {
        let { code } = await deleteEvaluationAPI(id)

        if (code === 200) {
            toast("Thanh cong!!", { position: toast.POSITION.TOP_RIGHT, type: 'success', theme: 'colored' })
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
            field: 'description',
            headerName: 'Nhận xét',
            //type: 'number',
            width: 200,
            editable: true
        },

        {
            field: 'thesis',
            headerName: 'Tên luận án',
            type: 'string',
            valueGetter: (params1) => {
                return params1.row.thesis.title;
            },
            width: 150,
        },
        {
            field: 'mark',
            headerName: 'Điểm',
            //type: 'number',
            width: 100,
            editable: true
        },
        {
            field: 'student.user.fullname',
            headerName: 'Tên sinh viên',
            type: 'string',
            valueGetter: (params1) => {
                return params1.row?.student?.user?.fullname;
            },
            width: 150,
        },
        {
            field: 'teacher.user.fullname',
            headerName: 'Tên giảng viên',
            type: 'string',
            valueGetter: (params1) => {
                return params1.row?.teacher?.user?.fullname;
            },
            width: 150,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 130,
            renderCell: (list) => {
              //console.log("editing table", list.row)
              return ( <div><IconButton aria-label="edit" color="primary" component={Link} to={`/dashboard/evaluation/edit/${list.row.id}`}><EditIcon /></IconButton>
                        <IconButton aria-label="delete" color="primary" onClick={() => deleteItem(list.row.id)}> <DeleteIcon /></IconButton>
              </div>)
            }
      
          },
        ];
    
    const rows = evaluations;
    
      return (
        <Stack spacing={0} style={{marginTop: -10}}>
      <h2>Danh Sách Đánh Giá Đồ Án</h2>
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
            to={`/dashboard/evaluation/new`}
            size="medium"
          >
            Add Evaluation
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