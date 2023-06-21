import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, Button, Chip, Grid, Stack, TextField, Typography } from "@mui/material";
// import { Box } from "@mui/system";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { createMajorAPI } from "../../service/major.service";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFacultyIds, setFacultySearch } from '../../redux/facultySlice';


export default function NewMajor() {
    let navigate = useNavigate()
    let dispatch = useDispatch();
    const { showError } = useError()

    const NewItemSchema = Yup.object().shape({
        title: Yup.string().required("Required, please enter."),
        description: Yup.string().required("Required, please enter."),
        faculty: Yup.object().nullable().required("Required, please enter."),
    });

    const { faculties, search: searchFaculty, isLoading: isLoadingFaculty,} = useSelector((state) => state.faculty);

    useEffect(() => {
        const timeout = setTimeout(() => {
          dispatch(getFacultyIds());
        }, 500);
    
        return () => clearTimeout(timeout);
      }, [dispatch, searchFaculty,]);
    
      const handleFilterTitleFaculty = (value) => {
        dispatch(setFacultySearch({ ...searchFaculty, value }));
      };

      const {
        register,
        handleSubmit,
        control,
        formState: { isSubmitting },
      } = useForm({
        resolver: yupResolver(NewItemSchema),
        
      });

    const addNew = async (major) => {
        console.log(major);
        let { code } = await createMajorAPI(major)
        if (code === 200) {
            toast("Thanh cong!!", { position: toast.POSITION.TOP_RIGHT, type: 'success', theme: 'colored' })
            navigate("/dashboard/major/search")
        }
        else
            showError(code)
    }

    return (
        <Grid container alignItems={"center"} justifyContent={"center"}>
            <Grid item xs={12} sm={6}>
                <Stack spacing={3}>
                    <Typography variant="h6">
                        Create Major
                    </Typography>
                    <form onSubmit={handleSubmit(addNew)}>
                        <Stack spacing={3}>
                            <TextField label="Tên ngành học" variant="outlined" size="small"
                                {...register("title")}
                                minLength={6}
                            />
                            <TextField label="Mô tả ngành học" variant="outlined" size="small"
                                {...register("description")}
                            />
                            {/* <TextField label="Ảnh mô tả" variant="outlined" size="small"
                                {...register("image")}
                            /> */}
                            <Controller
                name="faculty"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={faculties?.map(({ id, name }) => ({
                      id, name
                    }))}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    loading={isLoadingFaculty}
                    onInputChange={(event, value) => {
                      handleFilterTitleFaculty(value);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option.id}
                          size="small"
                          label={option.name}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        label="Tên Khoa/Viện"
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
                            <Button variant="outlined" type='submit' >Create</Button>
                        </Stack>
                    </form>
                </Stack>
            </Grid>
        </Grid>
    )
}