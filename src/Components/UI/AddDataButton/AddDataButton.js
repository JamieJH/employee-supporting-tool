import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './AddDataButton.module.css'

class AddDataButton extends Component {
    render() {
        return (
            <Link className={styles.addButton} to={this.props.path}>
                <i className="fas fa-plus"></i>
                <span>{this.props.title}</span>
            </Link>
        );
    }
}

export default AddDataButton;