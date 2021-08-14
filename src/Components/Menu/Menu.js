import React from 'react';
import classNames from 'classnames';
import styles from './Menu.module.css';


const Menu = (props) => {
    // const className = `${styles.container} ${(this.props.isOpen && styles.open)}`;
    const className = classNames(styles.container, { [styles.open]: props.isOpen });
    return (
        <div className={className} onClick={props.sidebarToggler}>
            {/* <span className={`${styles.bar} ${styles.barOne}`}></span>
            <span className={`${styles.bar} ${styles.barTwo}`}></span>
            <span className={`${styles.bar} ${styles.barThree}`}></span> */}
            <span className={classNames(styles.bar, styles.barOne)}></span>
            <span className={classNames(styles.bar, styles.barTwo)}></span>
            <span className={classNames(styles.bar, styles.barThree)}></span>
        </div>
    );

}

export default Menu;
