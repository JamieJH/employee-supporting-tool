import classNames from 'classnames';
import React from 'react';

import styles from './MainContentLayout.module.css';

const MainContentLayout = (props) => {
  return (
    <React.Fragment>
      <div className={styles.pageHeader}>
        <h1>{props.title}</h1>
        <p>{props.description}</p>
      </div>
      <div className={classNames(styles.mainContentContainer)}>
        <div className={classNames(styles.mainContent, {[styles.maxWidth]: props.applyMaxWidth} )}>
          {props.children}
        </div>
      </div>
    </React.Fragment>
  );
}

export default MainContentLayout;