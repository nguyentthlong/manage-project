import { createSlice } from '@reduxjs/toolkit'
import { getEvaluationByIdAPI, searchEvaluationAPI } from '../service/evaluation.service'

const initialState = {
    recordsTotal: 0,
    recordsFiltered: 0,
    evaluations: [],
    evaluation: null,
    isLoading: false,
    error: null,
    search: {
        start: 0,
        length: 10,
        value: ''
    }
}

export const evaluationSlice = createSlice({
    name: 'evaluation',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.isLoading = true
        },
        setError: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        setEvaluations: (state, action) => {
            // map voi response trả về từ api
            state.evaluations = action.payload.data
            state.recordsFiltered = action.payload.recordsFiltered
            state.recordsTotal = action.payload.recordsTotal
            state.isLoading = false
            state.error = null
        },
        setEvaluation: (state, action) => {
            // map voi response trả về từ api theo id, 1 object
            state.evaluation = action.payload.data
            state.isLoading = false
            state.error = null
        },
        setEvaluationSearch: (state, action) => {
            state.search = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setEvaluationSearch } = evaluationSlice.actions

//redux thunk, là hàm trả về 1 hàm bên trong chưa 2 tham số dispatch để gọi khi có dữ liệu từ api trả về, getstate đọc dữ liệu sẵn từ store ra.
export function searchEvaluation() {
    return async (dispatch, getState) => {
        dispatch(evaluationSlice.actions.startLoading())

        const { evaluation } = getState() // doc tu store cua redux
        const { search } = evaluation

        const { code, result } = await searchEvaluationAPI({ ...evaluation.search, value: `%${evaluation.search.value}%` })

        if (code === 200)
            dispatch(evaluationSlice.actions.setEvaluations(result))
        else
            dispatch(evaluationSlice.actions.setError(code))
     };
    }

    export function getEvaluationIds() {
        return async (dispatch, getState) => {
          dispatch(evaluationSlice.actions.startLoading());
          // read state from rootReducer
          const { evaluation } = getState();
      
          const resp = await searchEvaluationAPI({ ...evaluation.search, value: `%${evaluation.search.value}%` });
      
          if (resp.code === 200) dispatch(evaluationSlice.actions.setEvaluations(resp.result));
          else dispatch(evaluationSlice.actions.setError(resp));
    
        };
      }

export const getEvaluationById = (id) =>
    async (dispatch) => {
        evaluationSlice.actions.startLoading()

        const { code, result } = await getEvaluationByIdAPI(id)

        if (code === 200)
            dispatch(evaluationSlice.actions.setEvaluation(result))
        else
            dispatch(evaluationSlice.actions.setError(code))
    }

export default evaluationSlice.reducer