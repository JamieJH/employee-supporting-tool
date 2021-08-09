import React, { Component } from 'react';
import styles from './Avatar.module.css';

class Avatar extends Component {

    constructor(props) {
        super(props);
        this.getImageToDisplay = this.getImageToDisplay.bind(this);
    }

    getImageToDisplay() {
        const className = this.props.isCurrentUser ? styles.currentUser : '';

        if (this.props.image) {
            return <img
                className={`${styles.profileImage} ${className}`}
                src={this.props.image}
                alt={`${this.props.fullName} profile`} />
        }
        else {
            const nameWords = this.props.fullName.split(" ");
            const nameInitials = nameWords[0][0] + nameWords[nameWords.length - 1][0];
            return <div className={`${styles.nameInitials} ${className}`}>
                <span>{nameInitials}</span>
            </div>
        }
    }

    render() {
        return this.getImageToDisplay();
    }
}


export default Avatar;