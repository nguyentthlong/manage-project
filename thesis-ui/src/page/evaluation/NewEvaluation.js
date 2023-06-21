import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, Button, Chip, Grid, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { createEvaluationAPI } from "../../service/evaluation.service";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getStudentIds, setStudentSearch } from '../../redux/studentSlice';
import { getTeacherIds, setTeacherSearch } from '../../redux/teacherSlice';
import { getThesisIds, setThesisSearch } from '../../redux/thesisSlice';
import SearchThesis from '../thesis/SearchThesis-UI';


export default function NewEvaluation() {
    let navigate = useNavigate()
    const { showError } = useError()
    let dispatch = useDispatch();
    const { students, search: searchStudent, isLoading: isLoadingStudent,} = useSelector((state) => state.student);
    const { teachers, search: searchTeacher, isLoading: isLoadingTeacher,} = useSelector((state) => state.teacher);
    const { theses, search: searchThesis, isLoading: isLoadingThesis,} = useSelector((state) => state.thesis);

    const NewItemSchema = Yup.object().shape({      
      description: Yup.string().required("Required, please enter."),
      student: Yup.object().nullable().required("Required, please enter."),
      teacher: Yup.object().nullable().required("Required, please enter."),
      thesis: Yup.object().nullable().required("Required, please enter."),
    });

    const handleFilterTitleStudent = (value) => {
        dispatch(setStudentSearch({ ...searchStudent, value }));
      };
    
      useEffect(() => {
        const timeout = setTimeout(() => {
          dispatch(getStudentIds());
        }, 200);
    
        return () => clearTimeout(timeout);
      }, [dispatch, searchStudent]);


      const handleFilterTitleTeacher = (value) => {
        dispatch(setTeacherSearch({ ...searchTeacher, value }));
      };
    
      useEffect(() => {
        const timeout = setTimeout(() => {
          dispatch(getTeacherIds());
        }, 200);
    
        return () => clearTimeout(timeout);
      }, [dispatch, searchTeacher]);

      const handleFilterTitleThesis = (value) => {
        dispatch(setThesisSearch({ ...searchThesis, value }));
      };
    
      useEffect(() => {
        const timeout = setTimeout(() => {
          dispatch(getThesisIds());
        }, 200);
    
        return () => clearTimeout(timeout);
      }, [dispatch, searchThesis]);

    const {
        register,
        handleSubmit,
        control,
        formState: { isSubmitting },
      } = useForm({
        resolver: yupResolver(NewItemSchema),
      });




    const addNew = async (evaluation) => {
        let { code } = await createEvaluationAPI(evaluation)

        if (code === 200) {
            toast("Thanh cong!!", { position: toast.POSITION.TOP_RIGHT, type: 'success', theme: 'colored' })
            navigate("/dashboard/evaluation/search")
        }
        else
            showError(code)
    }

    // const handleChangeName = (e) => setEvaluation({
    //     ...evaluation,
    //     name: e.target.value
    // })

    return (
        <Grid container alignItems={"center"} justifyContent={"center"}>
            <Grid item xs={12} sm={6}>
                <Stack spacing={3}>
                    <Typography variant="h6">
                        Create Evaluation
                    </Typography>
                    <form onSubmit={handleSubmit(addNew)}>
                        <Stack spacing={3}>
                            <TextField label="Nhận xét" variant="outlined" size="small"
                                {...register("description")}
                            />
                            <TextField label="Điểm" variant="outlined" size="small"
                                {...register("mark")}
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
              <Controller
                name="thesis"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={theses}
                    getOptionLabel={(option) => option?.title}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    loading={isLoadingThesis}
                    onInputChange={(event, value) => {
                      handleFilterTitleThesis(value);
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
                        label="Tên luận án"
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