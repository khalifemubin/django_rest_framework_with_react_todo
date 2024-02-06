import React, { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from "react-router-dom";

const Login = props => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const usernameFieldRef = useRef();
    const [password, setPassword] = useState("");
    const passwordFieldRef = useRef();


    const onChangeUsername = e => {
        const username = e.target.value;
        setUsername(username);
    }

    const onChangePassword = e => {
        const password = e.target.value;
        setPassword(password);
    }

    const login = async () => {
        if (username.trim().length === 0) {
            usernameFieldRef.current.focus();
            return;
        }

        if (password.trim().length === 0) {
            passwordFieldRef.current.focus();
            return;
        }

        await props.login({ username: username, password: password })
    }

    useEffect(() => {
        if (props.loginSuccess === true) {
            navigate("/")
        }

        if (localStorage.getItem('token') && localStorage.getItem('user')) {
            navigate("/")
        }

    }, [props.loginSuccess, navigate])

    const detectEnterPress = (e) => {
        if (e.key === 'Enter') {
            login();
        }
    }

    return (<Container>
        {
            props.error &&
            <Alert key="danger" variant="danger">
                {props.error}
            </Alert>
        }
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control ref={usernameFieldRef} onKeyDown={detectEnterPress}
                    type="text" placeholder="Enter username" value={username} required
                    onChange={onChangeUsername} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control ref={passwordFieldRef} onKeyDown={detectEnterPress} required
                    type="password" placeholder="Enter password" value={password}
                    onChange={onChangePassword} />
            </Form.Group>
            <Button variant="primary" onClick={login}>
                Login </Button>
        </Form> </Container>
    )
}
export default Login;