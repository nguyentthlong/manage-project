import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { createFacultyAPI } from "../../service/faculty.service";


export default function NewFaculty() {
    let navigate = useNavigate()
    const { showError } = useError()

    const NewItemSchema = Yup.object().shape({

        name: Yup.string().required("Required, please enter."),
    });

    //ham hook
    // let [faculty, setFaculty] = useState({
    //     name: ""
    // });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(NewItemSchema)
    });

    const addNew = async (faculty) => {
        let { code } = await createFacultyAPI(faculty)

        if (code === 200) {
            toast("Thanh cong!!", { position: toast.POSITION.TOP_RIGHT, type: 'success', theme: 'colored' })
            navigate("/dashboard/faculty/search")
        }
        else
            showError(code)
    }

    return (
        <Grid container alignItems={"center"} justifyContent={"center"}>
            <Grid item xs={12} sm={6}>
                <Stack spacing={3}>
                    <Typography variant="h6">
                        Create Faculty
                    </Typography>
                    <form onSubmit={handleSubmit(addNew)}>
                        <Stack spacing={3}>
                            <TextField label="Tên Khoa/Viện" variant="outlined" size="small"
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