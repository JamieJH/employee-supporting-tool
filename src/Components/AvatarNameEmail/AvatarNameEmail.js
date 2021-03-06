import React from 'react';
import Avatar from '../Avatar/Avatar';
import PropTypes from 'prop-types';

import styles from './AvatarNameEmail.module.css';

const AvatarNameEmail = (props) => {
	return (
		<div className={styles.container}>
			<Avatar image={props.image} fullName={props.fullName} />
			<div className={styles.nameEmailText}>
				<p className={styles.nameText}>{props.fullName}</p>
				<p className={styles.emailText}>{props.email}</p>
			</div>
		</div>
	);

}

AvatarNameEmail.propTypes = {
	fullName: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
	image: PropTypes.string 
};

export default AvatarNameEmail;