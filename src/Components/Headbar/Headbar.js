import React from 'react';
import AppLogo from '../AppLogo/AppLogo';
import Menu from '../Menu/Menu';
import Avatar from '../Avatar/Avatar';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './Headbar.module.css';
import { Link } from 'react-router-dom';

const Headbar = (props) => {
	const fullName = useSelector(state => state.auth.userDetails.fullName);
	const image = useSelector(state => state.auth.userDetails.image);

	return (
		<div className={styles.container}>
			<Menu isOpen={props.isOpen} sidebarToggler={props.sidebarToggler} />
			<div className={styles.logo}>
				{/* <img src={AppLogo} alt="app logo" /> */}
				<Link to="/">
					<AppLogo size="50px" />
				</Link>
			</div>
			<div className={styles.user}>
				<Avatar image={image} fullName={fullName} isCurrentUser={true} />
				<span className={styles.fullName}>{fullName}</span>
			</div>
		</div>
	);

}

Headbar.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	sidebarToggler: PropTypes.func.isRequired
};

export default Headbar;