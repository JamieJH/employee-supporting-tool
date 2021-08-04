import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './NavItem.module.css';


class NavItem extends Component {
    state = {}
    render() {
        const navItem = this.props.nav;

        const className = `${styles.navItem} 
            ${(this.props.isLogoutBtn && styles.logout)} 
            ${(this.props.isOpen && styles.open)}`;

        return (
            <li className={className}>
                <NavLink activeClassName={styles.active} to={navItem.link} exact>
                    <span className={styles.icon}>
                        {/* {this.props.children} */}
                        <i className={`fas ${navItem.icon}`}></i>
                    </span>
                    <span className={styles.navTitle}>{navItem.title}</span>
                </NavLink>
            </li>
        );
    }
}

export default NavItem;