import React from 'react';
import Avatar from '../Avatar/Avatar';

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

export default AvatarNameEmail;