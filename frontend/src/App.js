import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import TodosList from './components/todos-list';
import Login from './components/login';
import Signup from './components/signup';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import AddToDo from './components/add-todo';
import TodoDataService from './services/todo';


export default function App() {
  // const user = null;
  const [user, setUser] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [error, setError] = React.useState('');
  const [loginSuccess, setLoginSuccess] = React.useState(false);
  const [signupSuccess, setSignupSuccess] = React.useState(false);

  async function login(user = null) { // default user to null setUser(user);
    TodoDataService.login(user).then(response => {
      setToken(response.data.token);
      setUser(user.username);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', user.username);
      setError('');
      setLoginSuccess(true)
      // return response;
    })
      .catch(e => {
        // console.log('login', e);
        // setError(e.toString());
        setError(e.response.data.error)
        setLoginSuccess(false)
      });
  }
  async function logout() {
    setToken('');
    setUser('');
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');

  }
  async function signup(user = null) {
    // default user to null setUser(user);
    TodoDataService.signup(user).then(response => {
      setToken(response.data.token);
      setUser(user.username);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', user.username);
      setSignupSuccess(true)
    })
      .catch(e => {
        console.log(e);
        // setError(e.toString());
        setError(e.response.data.error)
      })
  }

  useEffect(() => {
    if (localStorage.getItem('token') && localStorage.getItem('user')) {
      setUser(localStorage.getItem('user'));
    }
  }, [])


  return (
    <div className='App'>

      <div className="container mt-4">
        <Router>
          <Navbar bg="primary" variant="dark">
            <Container>
              <Navbar.Brand>TodosApp</Navbar.Brand>
              <Nav className="me-auto">
                <Link className="nav-link" to="/todos">Todos</Link>
                {user ? (
                  <Link className="nav-link" onClick={logout}>Logout ({user})</Link>) : (
                  <>
                    <Link className="nav-link" to="/login">Login</Link> <Link className="nav-link" to="/signup">Sign Up</Link>
                  </>)}
              </Nav>
            </Container>
          </Navbar>
          <Routes>
            <Route exact path='/' element={<TodosList token={token} />} />
            <Route exact path='/todos' element={<TodosList />} />
            <Route path="/todos/create" element={<AddToDo />} />
            <Route path="/todos/:id/" element={<AddToDo />} />
            <Route path="/login" element={<Login login={login} error={error} loginSuccess={loginSuccess} />} />
            <Route path="/signup" element={<Signup signup={signup} error={error} signupSuccess={signupSuccess} />} />
          </Routes>
        </Router>
      </div>


      <footer className="text-center text-lg-start bg-light text-muted mt-4">
        <div className="text-center p-4">
          &copy; Copyright - <a target="_blank" rel='noreferrer'
            className="text-reset fw-bold text-decoration-none" href="https://twitter.com/mubinkhalife"
          >
            Mubin
          </a>
        </div>
      </footer>
    </div>
  )
}