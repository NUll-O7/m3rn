import axios from "axios";

const NotesAPI = axios.create({
  baseURL: "http://localhost:5001/api",
});

export default NotesAPI;