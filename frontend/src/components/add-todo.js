import React, { useEffect, useRef, useState } from 'react';
import TodoDataService from '../services/todo';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

const AddTodo = props => {
    const location = useLocation();
    const [title, setTitle] = useState("");
    const [memo, setMemo] = useState(""); // keeps track if todo is submitted
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const titleRef = useRef();
    const memoRef = useRef();
    const [editing, setEditing] = useState(false);

    const onChangeTitle = e => {
        const newTitle = e.target.value;
        console.log('New Title:', newTitle);
        setTitle(newTitle);
    }
    const onChangeMemo = e => {
        const memo = e.target.value; setMemo(memo);
    }
    const saveTodo = () => {
        if (title.trim().length === 0) {
            return titleRef.current.focus();
        }

        if (memo.trim().length === 0) {
            return memoRef.current.focus();
        }

        var data = {
            title: titleRef.current.value, memo: memoRef.current.value, completed: false,
        }

        const token = localStorage.getItem("token");

        if (editing) {
            const token = localStorage.getItem("token");
            TodoDataService.updateTodo(
                location.state.currentTodo.id, data, token)
                .then(response => {
                    setSubmitted(true);
                    console.log(response.data)
                })
                .catch(e => {
                    console.log(e);
                })
        } else {
            TodoDataService.createTodo(data, token).then(response => {
                setSubmitted(true);
            })
                .catch(e => {
                    console.log(e);
                });
        }
    }

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login")
        }

        if (location.state && location.state.currentTodo) {
            setEditing(true);
            setTitle(location.state.currentTodo.title);
            setMemo(location.state.currentTodo.memo);
        }
    }, [title, memo, location.state, navigate])

    const detectEnterPress = (e) => {
        if (e.key === 'Enter') {
            saveTodo();
        }
    }

    return (<Container>
        {submitted ? (<div>
            <h4>Todo submitted successfully</h4> <Link to={"/todos/"}>
                Back to Todos </Link>
        </div>) : (
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>{editing ? "Edit" : "Create"} Todo</Form.Label> <Form.Control ref={titleRef} onKeyDown={detectEnterPress}
                        type="text"
                        required
                        placeholder="e.g. buy gift tomorrow" defaultValue={title} onChange={onChangeTitle}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label> <Form.Control ref={memoRef}
                        as="textarea" rows={3}
                        defaultValue={memo}
                        onChange={onChangeMemo} />
                </Form.Group>
                <Button variant="info" onClick={saveTodo}>
                    {editing ? "Edit" : "Add"} To-do </Button>
            </Form>)}
    </Container>)
}
export default AddTodo;
