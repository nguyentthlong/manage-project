import { createSlice } from '@reduxjs/toolkit'
import { getThesisByIdAPI, searchThesisAPI } from '../service/thesis.service'

const initialState = {
    recordsTotal: 0,
    recordsFiltered: 0,
    theses: [],
    thesis: null,
    isLoading: false,
    error: null,
    search: {
        start: 0,
        length: 10,
        value: ''
    }
}

export const thesisSlice = createSlice({
    name: 'thesis',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.isLoading = true
        },
        setError: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        setTheses: (state, action) => {
            // map voi response trả về từ api
            state.theses = action.payload.data
            state.recordsFiltered = action.payload.recordsFiltered
            state.recordsTotal = action.payload.recordsTotal
            state.isLoading = false
            state.error = null
        },
        setThesis: (state, action) => {
            // map voi response trả về từ api theo id, 1 object
            state.thesis = action.payload.data
            state.isLoading = false
            state.error = null
        },
        setThesisSearch: (state, action) => {
            state.search = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setThesisSearch } = thesisSlice.actions

//redux thunk, là hàm trả về 1 hàm bên trong chưa 2 tham số dispatch để gọi khi có dữ liệu từ api trả về, getstate đọc dữ liệu sẵn từ store ra.
export function searchThesis() {
    return async (dispatch, getState) => {
        dispatch(thesisSlice.actions.startLoading())

        const { thesis } = getState() // doc tu store cua redux
        const { search } = thesis

        const { code, result } = await searchThesisAPI({ ...thesis.search, value: `%${thesis.search.value}%` })

        if (code === 200)
            dispatch(thesisSlice.actions.setTheses(result))
        else
            dispatch(thesisSlice.actions.setError(code))
    };
    }

    export function getThesisIds() {
        return async (dispatch, getState) => {
          dispatch(thesisSlice.actions.startLoading());
          // read state from rootReducer
          const { thesis } = getState();
      
          const resp = await searchThesisAPI({ ...thesis.search, value: `%${thesis.search.value}%` });
      
          if (resp.code === 200) dispatch(thesisSlice.actions.setTheses(resp.result));
          else dispatch(thesisSlice.actions.setError(resp));
    
        };
      }

export const getThesisById = (id) =>
    async (dispatch) => {
        thesisSlice.actions.startLoading()

        const { code, result } = await getThesisByIdAPI(id)

        if (code === 200)
            dispatch(thesisSlice.actions.setThesis(result))
        else
            dispatch(thesisSlice.actions.setError(code))
    }

export default thesisSlice.reducer