import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './IconButton.module.css';

const IconButton = (props) => {
	// const buttonIcon = props.htmlCode
	//     ? <span>{props.htmlCode}</span>
	//     : <i className={`fas ${props.fontAwesomeCode}`}></i>

	const className = classNames(styles.button, styles[props.type], {[styles.wholeButton]: props.isWholeButton})

	return (
		<button className={className} onClick={props.onClick} title={props.title}>
			<i className={props.fontAwesomeCode}></i>
			{/* {props.children} */}
		</button>
	);
}

IconButton.propTypes = {
	// children: PropTypes.element.isRequired,
	type: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func
}

export default IconButton;