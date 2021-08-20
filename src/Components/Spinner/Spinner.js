import React from 'react';
import classNames from 'classnames';
import styles from './Spinner.module.css';
import { useSelector } from 'react-redux';

const Spinner = () => {
	const isSpinnerOpen = useSelector(state => state.modalSpinner.isSpinnerOpen);
	return (
		isSpinnerOpen &&
		<React.Fragment>
			<div className='backdrop'>
				<div className={styles.container}>
					<div className={classNames(styles.spinner, styles.spinnerOne)}>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default Spinner;