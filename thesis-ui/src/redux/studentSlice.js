import { createSlice } from '@reduxjs/toolkit'
import { getStudentByIdAPI, searchStudentAPI } from '../service/student.service'

const initialState = {
    recordsTotal: 0,
    recordsFiltered: 0,
    students: [],
    student: null,
    isLoading: false,
    error: null,
    search: {
        start: 0,
        length: 10,
        value: ''
    }
}

export const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.isLoading = true
        },
        setError: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        setStudents: (state, action) => {
            // map voi response trả về từ api
            state.students = action.payload.data
            state.recordsFiltered = action.payload.recordsFiltered
            state.recordsTotal = action.payload.recordsTotal
            state.isLoading = false
            state.error = null
        },
        setStudent: (state, action) => {
            // map voi response trả về từ api theo id, 1 object
            state.student = action.payload.data
            state.isLoading = false
            state.error = null
        },
        setStudentSearch: (state, action) => {
            state.search = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setStudentSearch } = studentSlice.actions

//redux thunk, là hàm trả về 1 hàm bên trong chưa 2 tham số dispatch để gọi khi có dữ liệu từ api trả về, getstate đọc dữ liệu sẵn từ store ra.
export function searchStudent() {
    return async (dispatch, getState) => {
        dispatch(studentSlice.actions.startLoading())

        const { student } = getState() // doc tu store cua redux
        const { search } = student

        const { code, result } = await searchStudentAPI({ ...student.search, value: `%${student.search.value}%` })

        if (code === 200)
            dispatch(studentSlice.actions.setStudents(result))
        else
            dispatch(studentSlice.actions.setError(code))
    };
    }

    export function getStudentIds() {
        return async (dispatch, getState) => {
          dispatch(studentSlice.actions.startLoading());
          // read state from rootReducer
          const { student } = getState();
      
          const resp = await searchStudentAPI({ ...student.search, value: `%${student.search.value}%` });
      
          if (resp.code === 200) dispatch(studentSlice.actions.setStudents(resp.result));
          else dispatch(studentSlice.actions.setError(resp));
    
        };
      }

export const getStudentById = (id) =>
    async (dispatch) => {
        studentSlice.actions.startLoading()

        const { code, result } = await getStudentByIdAPI(id)

        if (code === 200)
            dispatch(studentSlice.actions.setStudent(result))
        else
            dispatch(studentSlice.actions.setError(code))
    }

export default studentSlice.reducer