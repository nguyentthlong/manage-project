import { createSlice } from '@reduxjs/toolkit'
import { getClassesByIdAPI, searchClassesAPI } from '../service/classes.service'

const initialState = {
    recordsTotal: 0,
    recordsFiltered: 0,
    classes: [],
    classs: null,
    isLoading: false,
    error: null,
    search: {
        start: 0,
        length: 10,
        value: ''
    }
}

export const classsSlice = createSlice({
    name: 'classs',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.isLoading = true
        },
        setError: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        setClasses: (state, action) => {
            // map voi response trả về từ api
            state.classes = action.payload.data
            state.recordsFiltered = action.payload.recordsFiltered
            state.recordsTotal = action.payload.recordsTotal
            state.isLoading = false
            state.error = null
        },
        setClasss: (state, action) => {
            // map voi response trả về từ api theo id, 1 object
            state.classs = action.payload.data
            state.isLoading = false
            state.error = null
        },
        setClasssSearch: (state, action) => {
            state.search = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setClasssSearch } = classsSlice.actions

//redux thunk, là hàm trả về 1 hàm bên trong chưa 2 tham số dispatch để gọi khi có dữ liệu từ api trả về, getstate đọc dữ liệu sẵn từ store ra.
export function searchClass() {
    return async (dispatch, getState) => {
        dispatch(classsSlice.actions.startLoading())
        console.log({getState});

        const { classs } = getState() // doc tu store cua redux

        const { code, result } = await searchClassesAPI({ ...classs.search, value: `%${classs.search.value}%` })

        if (code === 200)
            dispatch(classsSlice.actions.setClasses(result))
        else
            dispatch(classsSlice.actions.setError(code))
    };
    }

    export function getClassesIds() {
        return async (dispatch, getState) => {
          dispatch(classsSlice.actions.startLoading());
          // read state from rootReducer
          const { classs } = getState();
      
          const resp = await searchClassesAPI({ ...classs.search, value: `%${classs.search.value}%` });
      
          if (resp.code === 200) dispatch(classsSlice.actions.setClasses(resp.result));
          else dispatch(classsSlice.actions.setError(resp));
    
        };
      }

export const getClassesById = (id) =>
    async (dispatch) => {
        classsSlice.actions.startLoading()

        const { code, result } = await getClassesByIdAPI(id)

        if (code === 200)
            dispatch(classsSlice.actions.setClasss(result))
        else
            dispatch(classsSlice.actions.setError(code))
    }

export default classsSlice.reducer