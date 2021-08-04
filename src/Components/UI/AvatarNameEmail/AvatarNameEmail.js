import React, { Component } from 'react';

import styles from './AvatarNameEmail.module.css';

class AvatarNameEmail extends Component {

    getImageToDisplay() {
        if (this.props.image) {
            return <img className={styles.profileImage} src={this.props.image} alt={`${this.props.fullName} profile`} />
        }
        else {
            const nameWords = this.props.fullName.split(" ");
            const nameInitials = nameWords[0][0] + nameWords[nameWords.length - 1][0];
            return <div className={styles.nameInitials}>
                <span>{nameInitials}</span>
            </div>
        }
    }

    render() {
        return (
            <div className={styles.container}>
                {this.getImageToDisplay()}
                <div className={styles.nameEmailText}>
                    <p className={styles.nameText}>{this.props.fullName}</p>
                    <p className={styles.emailText}>{this.props.email}</p>
                </div>
            </div>
        );
    }
}

export default AvatarNameEmail;