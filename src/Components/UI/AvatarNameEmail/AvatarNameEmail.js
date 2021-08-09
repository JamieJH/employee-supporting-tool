import React, { Component } from 'react';
import Avatar from '../Avatar/Avatar';

import styles from './AvatarNameEmail.module.css';

class AvatarNameEmail extends Component {
    render() {
        return (
            <div className={styles.container}>
                <Avatar image={this.props.image} fullName={this.props.fullName} />
                <div className={styles.nameEmailText}>
                    <p className={styles.nameText}>{this.props.fullName}</p>
                    <p className={styles.emailText}>{this.props.email}</p>
                </div>
            </div>
        );
    }
}

export default AvatarNameEmail;