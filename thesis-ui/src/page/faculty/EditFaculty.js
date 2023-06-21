import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { useError } from "../../hooks/useError";
import { updateFacultyAPI } from '../../service/faculty.service';


export default function EditFaculty() {
    const { showError } = useError()
    let navigate = useNavigate()

    let { id } = useParams();
    const { faculties } = useSelector((state) => state.faculty)

    //tim faculty tu list lay ra tu redux store 
    const currentFaculty = faculties.find(c => c.id === parseInt(id))

    const NewItemSchema = Yup.object().shape({
        name: Yup.string().required("Required, please enter."),
        id: Yup.number().moreThan(0, "Required number, please enter."),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(NewItemSchema),
        defaultValues: currentFaculty
    });


    const save = async (faculty) => {
        let { code } = await updateFacultyAPI(faculty)

        if (code === 200) {
            toast("Thanh cong!!", { position: toast.POSITION.TOP_RIGHT, type: 'success', theme: 'colored' })
            
            navigate("/dashboard/faculty/search")
        }
        else
            showError(code)
    }

    // const handleChange = (e) => setFaculty({
    //     ...faculty,
    //     [e.target.name]: e.target.value
    // })

    return (
        <Grid container >
            <Grid item xs={12} sm={6}>
                <Stack spacing={3}>
                    <h2>Update Faculty</h2>

                    <form onSubmit={handleSubmit(save)}>
                        <Stack spacing={3}>
                            <TextField label="ID Khoa/Viện" {...register("id")} disabled
                                error={errors.id}
                                helperText={errors.id?.message} />

                            <TextField label="Tên Khoa/Viện" {...register("name")}
                                error={errors.name}
                                helperText={errors.name?.message} />

                            <Button type='submit' >Update</Button>
                        </Stack>
                    </form>

                </Stack>
            </Grid>
        </Grid>
    )
}