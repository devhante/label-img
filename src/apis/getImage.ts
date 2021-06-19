import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/photos'
});

export const getImage = (id: number) => {
  return axiosInstance.get(`/${id}`);
}