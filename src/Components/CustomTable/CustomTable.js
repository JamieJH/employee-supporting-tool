import React from 'react';
import PropTypes from 'prop-types';

import styles from './CustomTable.module.css';

const CustomTable = (props) => {
	return (
		<div className={styles.container}>
			<table className={styles.table}>
				{props.children}
			</table>
		</div>
	);
}

// export const getListContentToDisplay = (maxCol, list, SubComponent) => {
// 	if (list && list.length === 0) {
// 		return <tr><td colSpan={maxCol}>There are currently data for this section</td></tr>;
// 	}

// 	return list.map(item => {
// 		return <SubComponent key={item.id} details={item} />;
// 	})
// }

CustomTable.propTypes = {
	children: PropTypes.array.isRequired
};

export default CustomTable;