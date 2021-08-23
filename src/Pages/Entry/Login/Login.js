import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { hideSpinner, showSpinner, login } from '../../../redux/actions/actionCreators';
import { useDispatch } from 'react-redux';
import AppLogo from '../../../Components/AppLogo/AppLogo';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import styles from './Login.module.css';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const dispatch = useDispatch();
	const history = useHistory();

	// dispatch(hideSpinner());

	const logginHandler = async (e) => {
		e.preventDefault();
		const userIdEmail = {};
		let isLoggedIn = false;

		if (!email && !password) {
			setMessage('Please enter email and password');
			return
		}

		dispatch(showSpinner());
		await firebase.auth().signInWithEmailAndPassword(email, password)
			.then(userCredentials => {
				const user = userCredentials.user;
				userIdEmail.id = user.uid;
				userIdEmail.email = user.email;
				isLoggedIn = true;
			})
			.catch((error) => {
				if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
					dispatch(hideSpinner());
					setMessage('Incorrect Email or Password.');
				}
				else {
					dispatch(hideSpinner());
					setMessage('Something went wrong, please try again later!');
				}
			});

		if (isLoggedIn) {
			const userDbRef = firebase.database().ref('/users/' + userIdEmail.id);
			const teamMembers = {};

			const user = await userDbRef.once('value')
				.then(snapshot => {
					return snapshot.val();
				})

			if (user.role === 'admin') {
				// an object containg this admin's team member
				await firebase.database().ref('/users/')
					.orderByChild('leaderId').equalTo(userIdEmail.id).once('value')
					.then(snapshot => snapshot.val())
					.then(members => {
						Object.keys(members).forEach(userId => {
							teamMembers[userId] = true;
						})
					})
			}

			console.log(teamMembers);
			const role = user.role;

			dispatch(login({
				id: userIdEmail.id,
				role,
				teamMembers,
				details: user
			}))
			dispatch(hideSpinner());
			history.push('/');

		}
	}

	const emailOnChangeHandler = (e) => {
		setEmail(e.target.value);
	}

	const passwordOnChangeHandler = (e) => {
		setPassword(e.target.value);
	}


	return (
		<div className={styles.loginBackground}>
			{!message ? ''
				: <div className={styles.errorContainer}>
					<p>{message}</p>
				</div>
			}
			<div className={styles.formContainer}>
				<div className={styles.logo}>
					{/* <img src={Logo} alt="" /> */}
					<AppLogo size="64px" />
				</div>
				<h2>Login</h2>
				<form className={styles.form}>
					<div className={styles.inputPair}>
						<input type="text" placeholder="Email" name="email"
							value={email}
							pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
							title="Example: something@domain.com"
							onChange={emailOnChangeHandler}
							required
						/>
						<span className={styles.inputIcon}>
							<i className="fas fa-envelope"></i>
						</span>
					</div>
					<div className={styles.inputPair}>
						<input type="password" placeholder="Password" name="password" id="login-pw"
							value={password}
							pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
							title="Must contain: at least one number, one uppercase and lowercase letter, and at least 8 characters"
							onChange={passwordOnChangeHandler}
							required />
						<span className={styles.inputIcon}>
							<i className="fas fa-lock"></i>
						</span>
					</div>
					{/* <div className={`${styles.inputPair} ${styles.rememberMe}`}>
                            <input type="checkbox" name="remember" id="remember"
                                value={state.isRememberMe}
                                onChange={rememberMeOnChangeHandler} />
                            <label htmlFor="remember" onClick={rememberMeOnChangeHandler}>Remember Me</label>
                        </div> */}
					<button className={styles.loginBtn} onClick={logginHandler}>Login</button>
				</form>
			</div>
		</div>
	);

}


export default Login;