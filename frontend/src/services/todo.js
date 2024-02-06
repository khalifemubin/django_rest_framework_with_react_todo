import axios from 'axios';

class TodoDataService {
    getAll(token) {
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.get('http://localhost:8000/api/todos/');
    }
    createTodo(data, token) {
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.post("http://localhost:8000/api/todos/create", data);
    }
    updateTodo(id, data, token) {
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.put(`http://localhost:8000/api/todos/${id}`, data);
    }
    deleteTodo(id, token) {
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.delete(`http://localhost:8000/api/todos/${id}`);
    }
    completeTodo(id, token) {
        axios.defaults.headers.common["Authorization"] = "Token " + token;
        return axios.put(`http://localhost:8000/api/todos/${id}/complete`);
    }
    login(data) {
        return axios.post("http://localhost:8000/api/login", data, { headers: { 'Content-Type': 'application/json' }, method: "POST" });
    }
    signup(data) {
        return axios.post("http://localhost:8000/api/signup", data);
    }
}

const TodoDataServiceInstance = new TodoDataService();
export default TodoDataServiceInstance;