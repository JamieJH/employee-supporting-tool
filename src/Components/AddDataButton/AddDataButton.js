import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AddDataButton.module.css'
import PropTypes from 'prop-types';

const AddDataButton = (props) => {
	return (
		<Link className={styles.addButton} to={props.path}>
			<i className="fas fa-plus"></i>
			<span>{props.title}</span>
		</Link>
	);
}

AddDataButton.propTypes = {
	title: PropTypes.string.isRequired,
	path: PropTypes.string.isRequired
};

export default AddDataButton;
