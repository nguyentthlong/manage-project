import { createSlice } from '@reduxjs/toolkit'
import { searchRoleAPI, getRoleByIdAPI } from '../service/role.service'

const initialState = {
    recordsTotal: 0,
    recordsFiltered: 0,
    roles: [],
    role: null,
    isLoading: false,
    error: null,
    search: {
        start: 0,
        length: 10,
        value: ''
    }
}

export const roleSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.isLoading = true
        },
        setError: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        setRoles: (state, action) => {
            // map voi response trả về từ api
            state.roles = action.payload.data
            state.recordsFiltered = action.payload.recordsFiltered
            state.recordsTotal = action.payload.recordsTotal
            state.isLoading = false
            state.error = null
        },
        setRole: (state, action) => {
            // map voi response trả về từ api theo id, 1 object
            state.role = action.payload.data
            state.isLoading = false
            state.error = null
        },
        setRoleSearch: (state, action) => {
            state.search = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setRoleSearch } = roleSlice.actions

//redux thunk, là hàm trả về 1 hàm bên trong chưa 2 tham số dispatch để gọi khi có dữ liệu từ api trả về, getstate đọc dữ liệu sẵn từ store ra.
export function searchRole() {
    return async (dispatch, getState) => {
        dispatch(roleSlice.actions.startLoading());

        const { role } = getState() // doc tu store cua redux
        // const { search } = role

        const { code, result } = await searchRoleAPI({ ...role.search, value: `%${role.search.value}%` })
        if (code === 200)
            dispatch(roleSlice.actions.setRoles(result))
        else
            dispatch(roleSlice.actions.setError(code))
    };
}

export function getRoleIds() {
    return async (dispatch, getState) => {
      dispatch(roleSlice.actions.startLoading());
      // read state from rootReducer
      const { role } = getState();
  
      const resp = await searchRoleAPI({ ...role.search, value: `%${role.search.value}%` });
  
      if (resp.code === 200) dispatch(roleSlice.actions.setRoles(resp.result));
      else dispatch(roleSlice.actions.setError(resp));

    };
  }

export const getRoleById = (id) =>
    async (dispatch) => {
        roleSlice.actions.startLoading()

        const { code, result } = await getRoleByIdAPI(id)

        if (code === 200)
            dispatch(roleSlice.actions.setRole(result))
        else
            dispatch(roleSlice.actions.setError(code))
    }

export default roleSlice.reducer