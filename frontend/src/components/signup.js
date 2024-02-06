import React, { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

const Signup = props => {
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

    const signup = () => {
        props.signup({ username: username, password: password });
    }

    const detectEnterPress = (e) => {
        if (e.key === 'Enter') {
            signup();
        }
    }

    useEffect(() => {
        if (props.signupSuccess === true) {
            navigate("/")
        }

        if (localStorage.getItem('token') && localStorage.getItem('user')) {
            navigate("/")
        }

    }, [props.signupSuccess, navigate])

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
                <Form.Label>Password</Form.Label> <Form.Control ref={passwordFieldRef} onKeyDown={detectEnterPress}
                    type="password" placeholder="Enter password" value={password} required
                    onChange={onChangePassword} />
            </Form.Group>
            <Button variant="primary" onClick={signup}>
                Sign Up </Button> </Form>
    </Container>)
}
export default Signup;