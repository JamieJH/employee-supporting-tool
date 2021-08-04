import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { login } from '../../../redux/actions/authActions';
import Spinner from '../../../Components/UI/Spinner/Spinner'
import { connect } from 'react-redux';
import Logo from '../../../assets/logo.png';
import firebase from 'firebase/app';
import 'firebase/auth';

import styles from './Login.module.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isLoading: false,
            message: '',
            isRememberMe: false,
            loginErrorMessage: ''
        }
        this.logginHandler = this.logginHandler.bind(this)
        this.emailOnChangeHandler = this.emailOnChangeHandler.bind(this)
        this.passwordOnChangeHandler = this.passwordOnChangeHandler.bind(this)
        // this.rememberMeOnChangeHandler = this.rememberMeOnChangeHandler.bind(this)
    }

    async logginHandler(e) {
        e.preventDefault();
        this.setState({ isLoading: true });
        const userIdEmail = {};
        let isCorrectLogin = false;
        await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(userCredentials => {
                const user = userCredentials.user;
                userIdEmail.id = user.uid;
                userIdEmail.email = user.email;
                isCorrectLogin = true;
            })
            .catch((error) => {
                console.log(error.code);
                if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                    this.setState({
                        isLoading: false,
                        loginErrorMessage: 'Incorrect Email or Password.'
                    })
                }
                else {
                    this.setState({
                        isLoading: false,
                        loginErrorMessage: 'Something went wrong, please try again later!'
                    })
                }
            });

        if (isCorrectLogin) {
            const userDbRef = firebase.database().ref('/users/' + userIdEmail.id);

            userDbRef.once('value')
                .then(snapshot => {
                    return snapshot.val();
                })
                .then(user => {
                    console.log(user);
                    const role = user.role;
                    delete user.role;

                    user.email = userIdEmail.email;

                    this.props.login({
                        id: userIdEmail.id, 
                        role: role,
                        details: user
                    });
                    this.props.history.push('/');
                });
        }

    }

    emailOnChangeHandler(e) {
        this.setState({
            email: e.target.value
        })
    }

    passwordOnChangeHandler(e) {
        this.setState({
            password: e.target.value
        })
    }

    rememberMeOnChangeHandler() {
        this.setState(state => {
            return {
                isRememberMe: !state.isRememberMe
            }
        })
    }

    render() {
        return (
            <div className={styles.loginBackground}>
                {!this.state.loginErrorMessage ? ''
                    : <div className={styles.errorContainer}>
                        <p>{this.state.loginErrorMessage}</p>
                    </div>
                }
                <div className={styles.formContainer}>
                    <div className={styles.logo}>
                        <img src={Logo} alt="" />
                    </div>
                    <h2>Login</h2>
                    <form className={styles.form}>
                        <div className={styles.inputPair}>
                            <input type="text" placeholder="Email" name="email"
                                value={this.state.email}
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                title="Example: something@domain.com"
                                onChange={this.emailOnChangeHandler}
                                required
                            />
                            <span className={styles.inputIcon}>
                                <i className="fas fa-envelope"></i>
                            </span>
                        </div>
                        <div className={styles.inputPair}>
                            <input type="password" placeholder="Password" name="password" id="login-pw"
                                value={this.state.password}
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="Must contain: at least one number, one uppercase and lowercase letter, and at least 8 characters"
                                onChange={this.passwordOnChangeHandler}
                                required />
                            <span className={styles.inputIcon}>
                                <i className="fas fa-lock"></i>
                            </span>
                        </div>
                        {/* <div className={`${styles.inputPair} ${styles.rememberMe}`}>
                            <input type="checkbox" name="remember" id="remember"
                                value={this.state.isRememberMe}
                                onChange={this.rememberMeOnChangeHandler} />
                            <label htmlFor="remember" onClick={this.rememberMeOnChangeHandler}>Remember Me</label>
                        </div> */}
                        <button className={styles.loginBtn} onClick={this.logginHandler}>Login</button>
                    </form>
                    {this.state.isLoading && <Spinner />}
                </div>
            </div>


        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (userData) => dispatch(login(userData))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));