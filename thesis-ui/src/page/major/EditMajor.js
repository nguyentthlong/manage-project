import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Button,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
// import { Box } from "@mui/system";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { updateMajorAPI } from "../../service/major.service";
import { useDispatch, useSelector } from "react-redux";
import { getFacultyIds, setFacultySearch } from "../../redux/facultySlice";
import { useEffect, useMemo } from "react";

export default function EditMajor() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const { showError } = useError();

  let { id } = useParams();
  const { majors } = useSelector((state) => state.major);
  const currentMajor = majors.find((c) => c.id === parseInt(id));

  const {
    faculties,
    search: searchFaculty,
    isLoading: isLoadingFaculty,
  } = useSelector((state) => state.faculty);

  //tim major tu list lay ra tu redux store
  const NewItemSchema = Yup.object().shape({
    // title: Yup.string().required("Required, please enter."),
    // description: Yup.string().required("Required, please enter."),
    // faculty: Yup.object().nullable().required("Required, please enter."),
  });

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

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues: currentMajor,
  });

  const save = async (major) => {
    let { code } = await updateMajorAPI(major);
    if (code === 200) {
      toast("Thanh cong!!", {
        position: toast.POSITION.TOP_RIGHT,
        type: "success",
        theme: "colored",
      });
      navigate("/dashboard/major/search");
    } else showError(code);
  };

  return (
    <Grid container alignItems={"center"} justifyContent={"center"}>
      <Grid item xs={12} sm={6}>
        <Stack spacing={3}>
          <Typography variant="h6">Update Major</Typography>
          <form onSubmit={handleSubmit(save)}>
            <Stack spacing={3}>
              <TextField
                label="ID ngành học"
                variant="outlined"
                disabled
                size="small"
                {...register("id")}
              />
              <TextField
                label="Tên ngành học"
                variant="outlined"
                size="small"
                {...register("title")}
              />
              <TextField
                label="Mô tả ngành học"
                variant="outlined"
                size="small"
                {...register("description")}
              />
              <TextField
                label="Ảnh mô tả"
                variant="outlined"
                size="small"
                {...register("image")}
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
                      id,
                      name,
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
  );
}
