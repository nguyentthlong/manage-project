import { createSlice } from '@reduxjs/toolkit'
import { getMajorByIdAPI, searchMajorAPI } from '../service/major.service'

const initialState = {
    recordsTotal: 0,
    recordsFiltered: 0,
    majors: [],
    major: null,
    isLoading: false,
    error: null,
    search: {
        start: 0,
        length: 10,
        value: ''
    }
}

export const majorSlice = createSlice({
    name: 'major',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.isLoading = true
        },
        setError: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        setMajors: (state, action) => {
            // map voi response trả về từ api
            state.majors = action.payload.data
            state.recordsFiltered = action.payload.recordsFiltered
            state.recordsTotal = action.payload.recordsTotal
            state.isLoading = false
            state.error = null
        },
        setMajor: (state, action) => {
            // map voi response trả về từ api theo id, 1 object
            state.major = action.payload.data
            state.isLoading = false
            state.error = null
        },
        setMajorSearch: (state, action) => {
            state.search = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setMajorSearch } = majorSlice.actions

//redux thunk, là hàm trả về 1 hàm bên trong chưa 2 tham số dispatch để gọi khi có dữ liệu từ api trả về, getstate đọc dữ liệu sẵn từ store ra.
export function searchMajor() {
    return async (dispatch, getState) => {
        dispatch(majorSlice.actions.startLoading())
        console.log({getState});

        const { major } = getState() // doc tu store cua redux
        const { search } = major

        const { code, result } = await searchMajorAPI({ ...major.search, value: `%${major.search.value}%` })

        if (code === 200)
            dispatch(majorSlice.actions.setMajors(result))
        else
            dispatch(majorSlice.actions.setError(code))
    };
    }

    export function getMajorIds() {
        return async (dispatch, getState) => {
          dispatch(majorSlice.actions.startLoading());
          // read state from rootReducer
          const { major } = getState();
      
          const resp = await searchMajorAPI({ ...major.search, value: `%${major.search.value}%` });
      
          if (resp.code === 200) dispatch(majorSlice.actions.setMajors(resp.result));
          else dispatch(majorSlice.actions.setError(resp));
    
        };
      }

export const getMajorById = (id) =>
    async (dispatch) => {
        majorSlice.actions.startLoading()

        const { code, result } = await getMajorByIdAPI(id)

        if (code === 200)
            dispatch(majorSlice.actions.setMajor(result))
        else
            dispatch(majorSlice.actions.setError(code))
    }

export default majorSlice.reducer