import React from 'react';
import styles from './Avatar.module.css';
import PropTypes from 'prop-types';

const Avatar = (props) => {

	const getImageToDisplay = () => {
		const className = props.isCurrentUser ? styles.currentUser : '';

		if (props.image) {
			return <img
				className={`${styles.profileImage} ${className}`}
				src={props.image}
				alt={`${props.fullName} profile`} />
		}
		else {
			const nameWords = props.fullName.split(" ");
			const nameInitials = nameWords[0][0] + nameWords[nameWords.length - 1][0];
			return <div className={`${styles.nameInitials} ${className}`}>
				<span>{nameInitials}</span>
			</div>
		}
	}

	return getImageToDisplay();
}

Avatar.propTypes = {
	fullName: PropTypes.string.isRequired,
	isCurrentUser: PropTypes.bool,
	image: PropTypes.string 
};

export default Avatar;