import axios from 'axios';
import { getSession } from '../context/AuthenContext';
// ----------------------------------------------------------------------
export const axiosBlog = axios.create({
  baseURL: 'http://localhost:8811',
  // headers: { Authorization: `Bearer ${getSession()}` },
  timeout: 0,
});

export const axiosBlog1 = axios.create({
  baseURL: 'http://localhost:8811',
  headers: {},
  timeout: 0,
});
