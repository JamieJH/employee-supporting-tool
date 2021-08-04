import React, { Component } from 'react';
import userImg from '../../../assets/user.jpg'
import styles from './Avatar.module.css';

class Avatar extends Component {
    render() {
        return (
            <img className={styles.userImg} src={userImg} alt="" />
        );
    }
}

export default Avatar;