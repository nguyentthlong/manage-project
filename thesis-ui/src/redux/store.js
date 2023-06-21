import { configureStore } from '@reduxjs/toolkit'
import facultyReducer from './facultySlice'
import majorReducer from './majorSlice'
import thesisReducer from './thesisSlice'
import userReducer from './userSlice'
import evaluationReducer from './evaluationSlice'
import documentReducer from './documentSlice'
import studentReducer from './studentSlice'
import teacherReducer from './teacherSlice'
import roleReducer from './roleSlice'
import classsReducer from './classesSlice'

export const store = configureStore({
    reducer: {
        faculty: facultyReducer,
        classs: classsReducer,
        major: majorReducer,
        thesis: thesisReducer,
        evaluation: evaluationReducer,
        document: documentReducer,
        student: studentReducer,
        teacher: teacherReducer,
        role: roleReducer,
        user: userReducer
    },
})