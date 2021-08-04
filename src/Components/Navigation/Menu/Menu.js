import React, { Component } from 'react';
import styles from './Menu.module.css';


class Menu extends Component {

    render() {
        const className = `${styles.container} ${(this.props.isOpen && styles.open)}`;
        return (
            <div className={className} onClick={this.props.sidebarToggler}>
                <span className={`${styles.bar} ${styles.barOne}`}></span>
                <span className={`${styles.bar} ${styles.barTwo}`}></span>
                <span className={`${styles.bar} ${styles.barThree}`}></span>
            </div>
        );
    }
}

export default Menu;
