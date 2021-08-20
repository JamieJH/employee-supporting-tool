import React from 'react';
import classNames from 'classnames';
import styles from './Menu.module.css';
import PropTypes from 'prop-types';


const Menu = (props) => {
	const className = classNames(styles.container, { [styles.open]: props.isOpen });
	return (
		<div className={className} onClick={props.sidebarToggler}>
			<span className={classNames(styles.bar, styles.barOne)}></span>
			<span className={classNames(styles.bar, styles.barTwo)}></span>
			<span className={classNames(styles.bar, styles.barThree)}></span>
		</div>
	);

}

Menu.propTypes = {
	isOpen: PropTypes.bool.isRequired
};

export default Menu;
