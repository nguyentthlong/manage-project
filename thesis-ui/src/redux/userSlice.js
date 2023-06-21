import { createSlice } from '@reduxjs/toolkit'
import { searchUserAPI, getUserByIdAPI } from '../service/user.service'

const initialState = {
    recordsTotal: 0,
    recordsFiltered: 0,
    users: [],
    user: null,
    isLoading: false,
    error: null,
    search: {
        start: 0,
        length: 10,
        value: ''
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.isLoading = true
        },
        setError: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        setUsers: (state, action) => {
            // map voi response trả về từ api
            state.users = action.payload.data
            state.recordsFiltered = action.payload.recordsFiltered
            state.recordsTotal = action.payload.recordsTotal
            state.isLoading = false
            state.error = null
        },
        setUser: (state, action) => {
            // map voi response trả về từ api theo id, 1 object
            state.user = action.payload.data
            state.isLoading = false
            state.error = null
        },
        setUserSearch: (state, action) => {
            state.search = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setUserSearch } = userSlice.actions

//redux thunk, là hàm trả về 1 hàm bên trong chưa 2 tham số dispatch để gọi khi có dữ liệu từ api trả về, getstate đọc dữ liệu sẵn từ store ra.
export function searchUser() {
    return async (dispatch, getState) => {
        dispatch(userSlice.actions.startLoading());

        const { user } = getState() // doc tu store cua redux
        // const { search } = user

        const { code, result } = await searchUserAPI({ ...user.search, value: `%${user.search.value}%` })
        console.log(result)
        if (code === 200)
            dispatch(userSlice.actions.setUsers(result))
        else
            dispatch(userSlice.actions.setError(code))
    };
}

export function getUserIds() {
    return async (dispatch, getState) => {
      dispatch(userSlice.actions.startLoading());
      // read state from rootReducer
      const { user } = getState();
  
      const resp = await searchUserAPI({ ...user.search, value: `%${user.search.value}%` });
  
      if (resp.code === 200) dispatch(userSlice.actions.setUsers(resp.result));
      else dispatch(userSlice.actions.setError(resp));

    };
  }

export const getUserById = (id) =>
    async (dispatch) => {
        userSlice.actions.startLoading()

        const { code, result } = await getUserByIdAPI(id)

        if (code === 200)
            dispatch(userSlice.actions.setUser(result))
        else
            dispatch(userSlice.actions.setError(code))
    }

export default userSlice.reducer