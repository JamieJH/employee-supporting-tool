import React from 'react';

import styles from './PageMainContainer.module.css';

const PageMainContainer = (props) => {
    return (
        <div className={styles.container}>
            {props.children}
        </div>
    );
}
 
export default PageMainContainer;