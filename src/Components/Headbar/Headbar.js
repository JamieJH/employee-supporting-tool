import React from 'react';
import AppLogo from '../../assets/logo.png';
import Menu from '../Menu/Menu';
import Avatar from '../Avatar/Avatar';
import { useSelector } from 'react-redux';

import styles from './Headbar.module.css';

const Headbar = (props) => {
    const fullName = useSelector(state => state.auth.userDetails.fullName);
    const image = useSelector(state => state.auth.userDetails.image);

    return (
        <div className={styles.container}>
            <Menu isOpen={props.isOpen} sidebarToggler={props.sidebarToggler} />
            <div className={styles.logo}>
                <img src={AppLogo} alt="app logo" />
            </div>
            <div className={styles.user}>
                <Avatar image={image} fullName={fullName} isCurrentUser={true} />
                <span className={styles.fullName}>{fullName}</span>
            </div>
        </div>
    );
    
}

export default Headbar;