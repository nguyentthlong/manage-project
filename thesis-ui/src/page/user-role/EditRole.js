import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Input, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { createRoleAPI, updateRoleAPI } from '../../service/role.service';
import {React,useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { useSelector } from 'react-redux';


export default function EditRole() {
    let navigate = useNavigate()
      //tim role tu list lay ra tu redux store 
    const { showError } = useError()
    
    let { id } = useParams();
    const { roles } = useSelector((state) => state.role)
    const currentRole = roles.find(c => c.id === parseInt(id))

    const NewItemSchema = Yup.object().shape({

        name: Yup.string().required("Required, please enter."),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(NewItemSchema),
        defaultValues: currentRole
    });

    const save = async (role) => {
        let { code } = await createRoleAPI(role)

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
                        Update Role
                    </Typography>
                    <form onSubmit={handleSubmit(save)}>
                        <Stack spacing={3}>
                            <TextField label="ID" variant="outlined" size="small"
                                {...register("id")}
                                error={errors.name}
                                disabled
                                helperText={errors.id?.message}
                            />
                             <TextField label="Role" variant="outlined" size="small"
                                {...register("name")}
                                error={errors.name}
                                helperText={errors.name?.message}
                            />                 
                            <Button variant="outlined" type='submit' >Update</Button>
                        </Stack>
                    </form>
                    

                </Stack>
            </Grid>
        </Grid>
    )
}