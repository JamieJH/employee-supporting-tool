import React, { Component } from 'react';

import styles from './UsersAvatar.module.css';


class UsersAvatar extends Component {

    getImageToDisplay() {
        if (this.props.url) {
            return <img className={styles.profileImage} src={this.props.url} alt={`${this.props.fullName} profile`} />
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
            <React.Fragment>
                {this.getImageToDisplay()}
            </React.Fragment>
        );
    }
}

export default UsersAvatar;