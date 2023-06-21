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
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { updateDocumentAPI } from "../../service/document.service";
import { useEffect, useState } from "react";
import { getUserIds, setUserSearch } from "../../redux/userSlice";

export default function EditDocument() {
  const { showError } = useError();
  let navigate = useNavigate();

  let { id } = useParams();
  const { documents } = useSelector((state) => state.document);
  const [selectedFile, setSelectedFile] = useState();

  function handleChange(event) {
    //console.log("file up ",event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  }
  let dispatch = useDispatch();
  //tim document tu list lay ra tu redux store
  const currentDocument = documents.find((c) => c.id === parseInt(id));

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
    defaultValues: currentDocument,
  });

  const {
    users,
    search: searchUser,
    isLoading: isLoadingUser,
  } = useSelector((state) => state.user);

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

  const save = async (document) => {
    //console.log("user add new; ",JSON.stringify(user.birthdate));
    let formData = new FormData();
    formData.append("id", `${document.id}`);
    formData.append("title", `${document.title}`);
    formData.append("file", selectedFile);
    formData.append("user.id", document.user.id);
    console.log(formData);
    let { code } = await updateDocumentAPI(formData);
    // console.log(typeof(formData));
    if (code === 200) {
      toast("Thanh cong!!", {
        position: toast.POSITION.TOP_RIGHT,
        type: "success",
        theme: "colored",
      });
      navigate("/dashboard/document/search");
    } else showError(code);
  };

  return (
    <Grid container alignItems={"center"} justifyContent={"center"}>
      <Grid item xs={12} sm={6}>
        <Stack spacing={3}>
          <Typography variant="h6">Update Document</Typography>
          <form onSubmit={handleSubmit(save)}>
            <Stack spacing={3}>
              <TextField
                label="ID tài liệu"
                disabled
                variant="outlined"
                size="small"
                {...register("id")}
              />
              <TextField
                label="Tên tài liệu"
                variant="outlined"
                size="small"
                {...register("title")}
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
                    options={users.map(({ id, fullname }) => ({
                      id,
                      fullname,
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
              <Button variant="contained" component="label">
                <input
                  accept="image/*"
                  multiple
                  type="file"
                  name="file"
                  onChange={handleChange}
                />
              </Button>
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
