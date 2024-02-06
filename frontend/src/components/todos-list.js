import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TodoDataService from '../services/todo';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import moment from 'moment';

const TodosList = props => {
    const [todos, setTodos] = useState([]);
    const navigate = useNavigate();

    const retrieveTodos = () => {
        const token = localStorage.getItem("token");
        TodoDataService.getAll(token)
            .then(response => {
                setTodos(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login")
        } else {
            retrieveTodos();
        }
    }, [navigate])

    const deleteTodo = (todoId) => {
        const token = localStorage.getItem("token");
        TodoDataService.deleteTodo(todoId, token)
            .then(response => {
                retrieveTodos();
            })
            .catch(e => {
                console.log(e);
            });
    }

    const completeTodo = (todoId) => {
        const token = localStorage.getItem("token");
        TodoDataService.completeTodo(todoId, token)
            .then(response => {
                retrieveTodos();
                console.log("completeTodo", todoId);
            })
            .catch(e => {
                console.log(e);
            })
    }

    return (<Container>
        {
            localStorage.getItem("token") && todos.length === 0 &&
            <Alert key="danger" variant="danger" className='mt-4'>
                You've not created any todo
            </Alert>
        }

        {localStorage.getItem("token") &&
            <Link to={"/todos/create"}>
                <Button variant="outline-info" className="mt-3 mb-3">
                    Add To-do </Button>
            </Link>
        }

        {todos.map((todo) => {
            return (
                <Card key={todo.id} className="mb-3"> <Card.Body>
                    <div className={`${todo.completed ? "text-decoration-line-through" : ""} mb-3`}>
                        <Card.Title>{todo.title}</Card.Title>
                        <Card.Text><b>Memo:</b> {todo.memo}</Card.Text>
                        <Card.Text>Date created: {moment(todo.created).format("Do MMMM YYYY")}</Card.Text> </div>
                    {/* <Link to={{ pathname: "/todos/" + todo.id, state: { currentTodo: todo } }}> */}
                    {!todo.completed &&
                        <Link to={`/todos/${todo.id}`} state={{ currentTodo: todo }}>
                            <Button variant="outline-info" className="me-2">
                                Edit </Button>
                        </Link>
                    }
                    <Button variant="outline-danger" className='me-2' onClick={() => deleteTodo(todo.id)}>
                        Delete </Button>
                    <Button variant="outline-success" onClick={() => completeTodo(todo.id)}>
                        Complete </Button>
                </Card.Body> </Card>
            )
        })}
    </Container>
    );
}


export default TodosList;