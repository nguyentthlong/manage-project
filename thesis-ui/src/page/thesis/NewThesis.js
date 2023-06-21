import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, Button, Chip, Grid, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { createThesisAPI } from "../../service/thesis.service";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getStudentIds, setStudentSearch } from '../../redux/studentSlice';
import { getTeacherIds, setTeacherSearch } from '../../redux/teacherSlice';


export default function NewThesis() {
    let navigate = useNavigate()
    const { showError } = useError()
    let dispatch = useDispatch();
    const { students, search: searchStudent, isLoading: isLoadingStudent,} = useSelector((state) => state.student);
    const { teachers, search: searchTeacher, isLoading: isLoadingTeacher,} = useSelector((state) => state.teacher);

    const NewItemSchema = Yup.object().shape({
        title: Yup.string().required("Required, please enter."),
        description: Yup.string().required("Required, please enter."),
        student: Yup.object().nullable().required("Required, please enter."),
        teacher: Yup.object().nullable().required("Required, please enter."),
    });


    const handleFilterTitleStudent = (value) => {
        dispatch(setStudentSearch({ ...searchStudent, value }));
      };
    
      useEffect(() => {
        const timeout = setTimeout(() => {
          dispatch(getStudentIds());
        }, 500);
    
        return () => clearTimeout(timeout);
      }, [dispatch, searchStudent]);


      const handleFilterTitleTeacher = (value) => {
        dispatch(setTeacherSearch({ ...searchTeacher, value }));
      };
    
      useEffect(() => {
        const timeout = setTimeout(() => {
          dispatch(getTeacherIds());
        }, 500);
    
        return () => clearTimeout(timeout);
      }, [dispatch, searchTeacher]);

    const {
        register,
        handleSubmit,
        control,
        formState: { isSubmitting },
      } = useForm({
        resolver: yupResolver(NewItemSchema),
      });

    const addNew = async (thesis) => {
        let { code } = await createThesisAPI(thesis)

        if (code === 200) {
            toast("Thanh cong!!", { position: toast.POSITION.TOP_RIGHT, type: 'success', theme: 'colored' })
            navigate("/dashboard/thesis/search")
        }
        else
            showError(code)
    }

    // const handleChangeName = (e) => setThesis({
    //     ...thesis,
    //     name: e.target.value
    // })

    return (
        <Grid container alignItems={"center"} justifyContent={"center"}>
            <Grid item xs={12} sm={6}>
                <Stack spacing={3}>
                    <Typography variant="h6">
                        Create Thesis
                    </Typography>
                    <form onSubmit={handleSubmit(addNew)}>
                        <Stack spacing={3}>
                            <TextField label="Tên luận án" variant="outlined" size="small"
                                {...register("title")}
                            />
                            <TextField label="Mô tả luận án" variant="outlined" size="small"
                                {...register("description")}
                            />
                            <Controller
                name="student"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={students}
                    getOptionLabel={(option) => option?.user?.fullname}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    loading={isLoadingStudent}
                    onInputChange={(event, value) => {
                      handleFilterTitleStudent(value);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option.id}
                          size="small"
                          label={option.user.fullname}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        label="Tên sinh viên"
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
              <Controller
                name="teacher"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={teachers}
                    getOptionLabel={(option) => option?.user?.fullname}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    loading={isLoadingTeacher}
                    onInputChange={(event, value) => {
                      handleFilterTitleTeacher(value);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option.id}
                          size="small"
                          label={option.user.fullname}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        label="Tên giảng viên"
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