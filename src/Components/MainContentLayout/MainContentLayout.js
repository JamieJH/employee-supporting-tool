import React from 'react';

import styles from './MainContentLayout.module.css';

const MainContentLayout = (props) => {
  return (
    <React.Fragment>
      <div className={styles.pageHeader}>
        <h2>{props.title}</h2>
        <p>{props.description}</p>
      </div>
      <div className={styles.mainContent}>
        {props.children}
      </div>
    </React.Fragment>
  );
}

export default MainContentLayout;