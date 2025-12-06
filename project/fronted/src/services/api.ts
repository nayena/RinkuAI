// src/services/api.ts
import axios from "axios";
import { BASE_URL } from "../config";

export const API = axios.create({ baseURL: BASE_URL, timeout: 10000 });