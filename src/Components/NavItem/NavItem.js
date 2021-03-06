import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './NavItem.module.css';


const NavItem = (props) => {
	const navItem = props.details;

	const getLogoutButtonToDisplay = () => {
		const className = classNames(styles.logoutButton, styles.navItem, { [styles.open]: props.isOpen });
		return <button className={ className } onClick={props.onClick}>
			<span className={styles.icon}>
				<i className={`fas fa-sign-out-alt`}></i>
			</span>
			<span className={styles.navTitle}>Logout</span>
		</button>
	}

	return props.isLogoutBtn
		? getLogoutButtonToDisplay()
		: (
			<li className={classNames(styles.navItem, { [styles.open]: props.isOpen })}>
				<NavLink activeClassName={styles.active} to={navItem.link} exact>
					<span className={styles.icon}>
						{/* {props.children} */}
						<i className={`fas ${navItem.icon}`}></i>
					</span>
					<span className={styles.navTitle}>{navItem.title}</span>
				</NavLink>
			</li>
		);

}

NavItem.propTypes = {
	details: PropTypes.object,
	isOpen: PropTypes.bool.isRequired,
	onClick: PropTypes.func,
	isLogoutBtn: PropTypes.bool
};

export default NavItem;