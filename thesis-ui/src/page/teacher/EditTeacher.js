import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, Button, Chip, Grid, Stack, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { updateTeacherAPI } from '../../service/teacher.service';
import { getUserIds, setUserSearch } from '../../redux/userSlice';
import { useEffect } from 'react';
import { getFacultyIds, setFacultySearch } from '../../redux/facultySlice';


export default function EditTeacher() {
    const { showError } = useError();
    let navigate = useNavigate();
    let dispatch = useDispatch();

    let { id } = useParams();
    const { teachers } = useSelector((state) => state.teacher)
    const { users, search: searchUser, isLoading: isLoadingUser,} = useSelector((state) => state.user);
  const { faculties, search: searchFaculty, isLoading: isLoadingFaculty,} = useSelector((state) => state.faculty);

    const handleFilterTitleUser = (value) => {
        if (value !== searchUser.value)
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
          dispatch(getFacultyIds());
        }, 500);
        return () => clearTimeout(timeout);
      }, [dispatch, searchFaculty]);
    
      const handleFilterTitleFaculty = (value) => {
        if (value !== searchFaculty.value)
        dispatch(setFacultySearch({ ...searchFaculty, value }));
      };
    //tim teacher tu list lay ra tu redux store 
    const currentTeacher = teachers.find(c => c.id === parseInt(id))

    const NewItemSchema = Yup.object().shape({
        // name: Yup.string().required("Required, please enter."),
        // id: Yup.number().moreThan(0, "Required number, please enter."),
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { isSubmitting },
      } = useForm({
        resolver: yupResolver(NewItemSchema),
        defaultValues: currentTeacher,
      });


    const save = async (teacher) => {
        let { code } = await updateTeacherAPI(teacher)

        if (code === 200) {
            toast("Thanh cong!!", { position: toast.POSITION.TOP_RIGHT, type: 'success', theme: 'colored' })
            navigate("/dashboard/teacher/search")
        }
        else
            showError(code)
    } 

    return (
        <Grid container >
            <Grid item xs={12} sm={6}>
                <Stack spacing={3}>
                    <h2>Update Teacher</h2>

                    <form onSubmit={handleSubmit(save)}>
                        <Stack spacing={3}>
                        <TextField
                label="ID giáo viên"
                disabled
                variant="outlined"
                size="small"
                {...register("id")}
              />
              <TextField
                label="Mã giáo viên"
                variant="outlined"
                size="small"
                {...register("teacherCode")}
              />
              
              <Controller
                name="user"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    disabled
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
              <Button variant="outlined" type="submit">
                Update
              </Button>
                        </Stack>
                    </form>

                </Stack>
            </Grid>
        </Grid>
    )
}