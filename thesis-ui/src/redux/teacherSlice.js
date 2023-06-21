import { createSlice } from '@reduxjs/toolkit'
import { getTeacherByIdAPI, searchTeacherAPI } from '../service/teacher.service'

const initialState = {
    recordsTotal: 0,
    recordsFiltered: 0,
    teachers: [],
    teacher: null,
    isLoading: false,
    error: null,
    search: {
        start: 0,
        length: 10,
        value: ''
    }
}

export const teacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.isLoading = true
        },
        setError: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        setTeachers: (state, action) => {
            // map voi response trả về từ api
            state.teachers = action.payload.data
            state.recordsFiltered = action.payload.recordsFiltered
            state.recordsTotal = action.payload.recordsTotal
            state.isLoading = false
            state.error = null
        },
        setTeacher: (state, action) => {
            // map voi response trả về từ api theo id, 1 object
            state.teacher = action.payload.data
            state.isLoading = false
            state.error = null
        },
        setTeacherSearch: (state, action) => {
            state.search = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setTeacherSearch } = teacherSlice.actions

//redux thunk, là hàm trả về 1 hàm bên trong chưa 2 tham số dispatch để gọi khi có dữ liệu từ api trả về, getstate đọc dữ liệu sẵn từ store ra.
export function searchTeacher() {
    return async (dispatch, getState) => {
        dispatch(teacherSlice.actions.startLoading())

        const { teacher } = getState() // doc tu store cua redux
        const { search } = teacher

        const { code, result } = await searchTeacherAPI({ ...teacher.search, value: `%${teacher.search.value}%` })

        if (code === 200)
            dispatch(teacherSlice.actions.setTeachers(result))
        else
            dispatch(teacherSlice.actions.setError(code))
    };
    }

    export function getTeacherIds() {
        return async (dispatch, getState) => {
          dispatch(teacherSlice.actions.startLoading());
          // read state from rootReducer
          const { teacher } = getState();
      
          const resp = await searchTeacherAPI({ ...teacher.search, value: `%${teacher.search.value}%` });
      
          if (resp.code === 200) dispatch(teacherSlice.actions.setTeachers(resp.result));
          else dispatch(teacherSlice.actions.setError(resp));
    
        };
      }

export const getTeacherById = (id) =>
    async (dispatch) => {
        teacherSlice.actions.startLoading()

        const { code, result } = await getTeacherByIdAPI(id)

        if (code === 200)
            dispatch(teacherSlice.actions.setTeacher(result))
        else
            dispatch(teacherSlice.actions.setError(code))
    }

export default teacherSlice.reducer