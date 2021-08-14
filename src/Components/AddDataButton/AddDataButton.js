import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AddDataButton.module.css'

const AddDataButton = (props) => {
	return (
		<Link className={styles.addButton} to={props.path}>
			<i className="fas fa-plus"></i>
			<span>{props.title}</span>
		</Link>
	);
}

export default AddDataButton;
