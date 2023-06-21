import { createSlice } from '@reduxjs/toolkit'
import { getDocumentByIdAPI, searchDocumentAPI } from '../service/document.service'

const initialState = {
    recordsTotal: 0,
    recordsFiltered: 0,
    documents: [],
    document: null,
    isLoading: false,
    error: null,
    search: {
        start: 0,
        length: 10,
        value: ''
    }
}

export const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.isLoading = true
        },
        setError: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        setDocuments: (state, action) => {
            // map voi response trả về từ api
            state.documents = action.payload.data
            state.recordsFiltered = action.payload.recordsFiltered
            state.recordsTotal = action.payload.recordsTotal
            state.isLoading = false
            state.error = null
        },
        setDocument: (state, action) => {
            // map voi response trả về từ api theo id, 1 object
            state.document = action.payload.data
            state.isLoading = false
            state.error = null
        },
        setDocumentSearch: (state, action) => {
            state.search = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setDocumentSearch } = documentSlice.actions

//redux thunk, là hàm trả về 1 hàm bên trong chưa 2 tham số dispatch để gọi khi có dữ liệu từ api trả về, getstate đọc dữ liệu sẵn từ store ra.
export function searchDocument() {
    return async (dispatch, getState) => {
        dispatch(documentSlice.actions.startLoading())

        const { document } = getState() // doc tu store cua redux

        const { code, result } = await searchDocumentAPI({ ...document.search, value: `%${document.search.value}%` })

        if (code === 200)
            dispatch(documentSlice.actions.setDocuments(result))
        else
            dispatch(documentSlice.actions.setError(code))
     };
    }



export const getDocumentById = (id) =>
    async (dispatch) => {
        documentSlice.actions.startLoading()

        const { code, result } = await getDocumentByIdAPI(id)

        if (code === 200)
            dispatch(documentSlice.actions.setDocument(result))
        else
            dispatch(documentSlice.actions.setError(code))
    }

export default documentSlice.reducer