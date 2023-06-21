import { createSlice } from "@reduxjs/toolkit";
import {
  getFacultyByIdAPI,
  searchFacultyAPI,
} from "../service/faculty.service";

const initialState = {
  recordsTotal: 0,
  recordsFiltered: 0,
  faculties: [],
  faculty: null,
  isLoading: false,
  error: null,
  search: {
    start: 0,
    length: 10,
    value: "",
  },
};

export const facultySlice = createSlice({
  name: "faculty",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    setError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setFaculties: (state, action) => {
      // map voi response trả về từ api
      state.faculties = action.payload.data;
      state.recordsFiltered = action.payload.recordsFiltered;
      state.recordsTotal = action.payload.recordsTotal;
      state.isLoading = false;
      state.error = null;
    },
    setFaculty: (state, action) => {
      // map voi response trả về từ api theo id, 1 object
      state.faculty = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setFacultySearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFacultySearch } = facultySlice.actions;

//redux thunk, là hàm trả về 1 hàm bên trong chưa 2 tham số dispatch để gọi khi có dữ liệu từ api trả về, getstate đọc dữ liệu sẵn từ store ra.
export function searchFaculty() {
  return async (dispatch, getState) => {
    dispatch(facultySlice.actions.startLoading());
    const { faculty } = getState(); // doc tu store cua redux
    const { search } = faculty;

    const { code, result } = await searchFacultyAPI({
      ...faculty.search,
      value: `%${faculty.search.value}%`,
    });
    if (code === 200) dispatch(facultySlice.actions.setFaculties(result));
    else dispatch(facultySlice.actions.setError(code));
  };
}

export function getFacultyIds() {
  return async (dispatch, getState) => {
    dispatch(facultySlice.actions.startLoading());
    // read state from rootReducer
    const { faculty } = getState();

    const resp = await searchFacultyAPI({
      ...faculty.search,
      value: `%${faculty.search.value}%`,
    });
    if (resp.code === 200)
      dispatch(facultySlice.actions.setFaculties(resp.result));
    else dispatch(facultySlice.actions.setError(resp));
  };
}

export const getFacultyById = (id) => async (dispatch) => {
  facultySlice.actions.startLoading();

  const { code, result } = await getFacultyByIdAPI(id);

  if (code === 200) dispatch(facultySlice.actions.setFaculty(result));
  else dispatch(facultySlice.actions.setError(code));
};

export default facultySlice.reducer;
