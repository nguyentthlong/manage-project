import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Input, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { createRoleAPI } from '../../service/role.service';
import {React,useState } from 'react';
import IconButton from '@mui/material/IconButton';


export default function NewRole() {
    let navigate = useNavigate()
    const { showError } = useError();

    const NewItemSchema = Yup.object().shape({
        name: Yup.string().required("Required, please enter."),      
    });
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(NewItemSchema)
    });

    const addNew = async (faculty) => {
        let { code } = await createRoleAPI(faculty)

        if (code === 200) {
            toast("Thanh cong!!", { position: toast.POSITION.TOP_RIGHT, type: 'success', theme: 'colored' })
            navigate("/dashboard/role/search")
        }
        else
            showError(code)
    }

    return (
        <Grid container alignItems={"center"} justifyContent={"center"}>
            <Grid item xs={12} sm={6}>
                <Stack spacing={3}>
                    <Typography variant="h6">
                        Create Role
                    </Typography>
                    <form onSubmit={handleSubmit(addNew)}>
                        <Stack spacing={3}>
                             <TextField label="Role" variant="outlined" size="small"
                                {...register("name")}
                                error={errors.name}
                                helperText={errors.name?.message}
                            />
                            <Button variant="outlined" type='submit' >Create</Button>
                        </Stack>
                    </form>
                    

                </Stack>
            </Grid>
        </Grid>
    )
}