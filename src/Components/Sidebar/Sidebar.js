import React, { useRef } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Avatar, NavItem } from '../index';
import { logout } from '../../redux/actions/authActions';
import AppLogo from '../../assets/logo.png';
import firebase from 'firebase/app';
import 'firebase/auth';

import styles from './Sidebar.module.css';

const Sidebar = (props) => {

	const pages = useSelector(state => state.auth.pages);
	const fullName = useSelector(state => state.auth.userDetails.fullName);
	const image = useSelector(state => state.auth.userDetails.image);
	const dispatch = useDispatch();
	const history = useHistory();

	const sidebarRef = useRef();

	const closeSidebarHandler = (e) => {
		const navItemList = sidebarRef.current;
		if (navItemList.contains(e.target)) {
			props.closeSidebarHandler()
		}
	}

	const logOutHandler = () => {
		firebase.auth().signOut();
		dispatch(logout);
		history.replace('/login');
	}

	// const className = `${styles.container} ${(props.isOpen && styles.open)}`;
	const className = classNames(styles.container, { [styles.open]: props.isOpen });
	const navItems = pages;

	return (
		<div className={className}>
			<div className={styles.head}>
				<div className={styles.user}>
					<div className={styles.avatar}>
						<Avatar image={image} fullName={fullName} isCurrentUser='true' />
					</div>
					<span>Hi, {fullName}</span>
				</div>

				<div className={styles.logo}>
					<img src={AppLogo} alt="app logo" />
				</div>
			</div>
			<ul className={styles.navItems} onClick={closeSidebarHandler} ref={sidebarRef}>
				{navItems.map(item => {
					return <NavItem
						key={item.title}
						nav={item}
						isOpen={props.isOpen}></NavItem>
				})}
			</ul>

			<NavItem
				key="logout"
				isOpen={props.isOpen}
				isLogoutBtn={true}
				onClick={logOutHandler}
			></NavItem>

		</div>
	);

}


export default Sidebar;