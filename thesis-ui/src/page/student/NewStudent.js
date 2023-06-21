import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, Button, Chip, Grid, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { createStudentAPI } from "../../service/student.service";
import { useDispatch, useSelector } from 'react-redux';
import { getUserIds, setUserSearch } from '../../redux/userSlice';
import { useEffect } from 'react';
import { getMajorIds, searchMajor, setMajorSearch } from '../../redux/majorSlice';
import { getClassesIds, setClasssSearch } from '../../redux/classesSlice';


export default function NewStudent() {
    let navigate = useNavigate()
    let dispatch = useDispatch();
    const { showError } = useError()

    const NewItemSchema = Yup.object().shape({
        
    });

    const { users, search: searchUser, isLoading: isLoadingUser,} = useSelector((state) => state.user);
    const { majors, search: searchMajor, isLoading: isLoadingMajor,} = useSelector((state) => state.major);
    const {classes, search: searchClasss, isLoading: isLoadingClasses} = useSelector((state) => state.classs);

    const handleFilterTitleUser = (value) => {
      dispatch(setUserSearch({ ...searchUser, value }));
    };
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        dispatch(getUserIds());
      }, 500);
  
      return () => clearTimeout(timeout);
    }, [dispatch, searchUser]);
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        dispatch(getClassesIds());
      }, 500);
  
      return () => clearTimeout(timeout);
    }, [dispatch, searchMajor]);
  
    const handleFilterTitleClasses = (value) => {
      dispatch(setClasssSearch({ ...searchClasss, value }));
    };
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        dispatch(getMajorIds());
      }, 500);
  
      return () => clearTimeout(timeout);
    }, [dispatch, searchMajor]);
  
    const handleFilterTitleMajor = (value) => {
      dispatch(setMajorSearch({ ...searchMajor, value }));
    };

    const {
      register,
      handleSubmit,
      control,
      formState: { isSubmitting },
    } = useForm({
      resolver: yupResolver(NewItemSchema),
    });
  
    const addNew = async (student) => {
      let { code } = await createStudentAPI(student);
  
      if (code === 200) {
        toast("Thanh cong!!", {
          position: toast.POSITION.TOP_RIGHT,
          type: "success",
          theme: "colored",
        });
        navigate("/dashboard/student/search");
      } else showError(code);
    };
  
    return (
      <Grid container alignItems={"center"} justifyContent={"center"}>
        <Grid item xs={12} sm={6}>
          <Stack spacing={3}>
            <Typography variant="h6">Create Student</Typography>
            <form onSubmit={handleSubmit(addNew)}>
              <Stack spacing={3}>
                <TextField
                  label="ID sinh viên"
                  variant="outlined"
                  size="small"
                  {...register("id")}
                />
                <TextField
                  label="Mã sinh viên"
                  variant="outlined"
                  size="small"
                  {...register("studentCode")}
                />
                
                <Controller
                  name="user"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      fullWidth
                      {...field}
                      onChange={(event, newValue) => field.onChange(newValue)}
  
                      options={users.map(({ id , fullname}) => ({
                        id,fullname
                      }))}
                      getOptionLabel={(option) => option.fullname}
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
                            label={option.fullname}
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
                />
                <Controller
                  name="major"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      fullWidth
                      {...field}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={majors?.map(({ id, title }) => ({
                        id, title
                      }))}
                      getOptionLabel={(option) => option.title}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      loading={isLoadingMajor}
                      onInputChange={(event, value) => {
                        handleFilterTitleMajor(value);
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option.id}
                            size="small"
                            label={option.title}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          label="Tên ngành học"
                          {...params}
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="studentClass"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      fullWidth
                      {...field}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={classes?.map(({ id, name }) => ({
                        id, name
                      }))}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      loading={isLoadingMajor}
                      onInputChange={(event, value) => {
                        handleFilterTitleClasses(value);
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
                          label="Tên lớp học"
                          {...params}
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  )}
                />
                <Button variant="outlined" type="submit">
                  Create
                </Button>
              </Stack>
            </form>
          </Stack>
        </Grid>
      </Grid>
    )
}