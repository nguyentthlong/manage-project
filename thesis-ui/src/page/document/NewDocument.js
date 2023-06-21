import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, Button, Chip, Grid, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { createDocumentAPI } from "../../service/document.service";
import { useDispatch, useSelector } from 'react-redux';
import { getUserIds, setUserSearch } from '../../redux/userSlice';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';


export default function NewDocument() {
    let navigate = useNavigate()
    const { showError } = useError();
    const [selectedFile, setSelectedFile] = useState();
    let {user} = useAuth();
    function handleChange(event) {
        //console.log("file up ",event.target.files[0]);
		setSelectedFile(event.target.files[0]);
    }
    let dispatch = useDispatch();

    const NewItemSchema = Yup.object().shape({
      
    });

    const { users, search: searchUser, isLoading: isLoadingUser,} = useSelector((state) => state.user);

    const handleFilterTitleUser = (value) => {
        dispatch(setUserSearch({ ...searchUser, value }));
      };
    
      useEffect(() => {
        const timeout = setTimeout(() => {
          dispatch(getUserIds());
        }, 500);
    
        return () => clearTimeout(timeout);
      }, [dispatch, searchUser]);

      const {
        register,
        handleSubmit,
        control,
        formState: { isSubmitting },
      } = useForm({
        resolver: yupResolver(NewItemSchema),
      });

      const addNew = async (document) => {
        //console.log("user add new; ",JSON.stringify(user.birthdate));
        let formData = new FormData();
        formData.append('title',`${document.title}`)
        formData.append('file', selectedFile)
        formData.append('user.id', user.id)
        console.log(formData);
        let { code } = await createDocumentAPI(formData)
        if (code === 200) {
            toast("Thanh cong!!", { position: toast.POSITION.TOP_RIGHT, type: 'success', theme: 'colored' })
            navigate("/dashboard/document/search")
        }
        else
            showError(code)
    }

    return (
        <Grid container alignItems={"center"} justifyContent={"center"}>
            <Grid item xs={12} sm={6}>
                <Stack spacing={3}>
                    <Typography variant="h6">
                        Create Document
                    </Typography>
                    <form onSubmit={handleSubmit(addNew)}>
                        <Stack spacing={3}>
                            <TextField label="Tên tài liệu" variant="outlined" size="small"
                                {...register("title")}
                            />
                            {/* <Controller
                  name="user"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      fullWidth
                      {...field}
                      onChange={(event, newValue) => field.onChange(newValue)}
  
                      options={users.map(({ id , username}) => ({
                        id,username
                      }))}
                      getOptionLabel={(option) => option.username}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      loading={isLoadingUser}
                      onInputChange={(event, value) => {
                        handleFilterTitleUser(value);
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option.id}
                            size="small"
                            label={option.username}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          label="Tên người dùng"
                          {...params}
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                /> */}
                            <Button variant="contained" component="label">       
                                <input accept="*" multiple type="file" name="file" onChange={handleChange}/>
                            </Button>
                            <Button variant="outlined" type='submit' >Create</Button>
                        </Stack>
                    </form>
                </Stack>
            </Grid>
        </Grid>
    )
}