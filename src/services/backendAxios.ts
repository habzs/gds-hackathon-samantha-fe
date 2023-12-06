import axios from "axios";

const backendAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_BASEURL}`,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    Authorization:
      "Bearer 00000000-0000-0000-a2f0-0ac7e3b0ac15.9188040d-6c67-4c5b-b112-36a304b66dad",
  },
  //   withCredentials: true,
});

/*
Axios interceptors are in WithAxios
*/

export { backendAxios };
