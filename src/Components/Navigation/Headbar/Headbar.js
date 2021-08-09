import React, { Component } from 'react';
import AppLogo from '../../../assets/logo.png';
import Menu from '../Menu/Menu';
import Avatar from '../../UI/Avatar/Avatar';

import styles from './Headbar.module.css';
import { connect } from 'react-redux';

class Headbar extends Component {
    render() {
        return (
            <div className={styles.container}>
                <Menu isOpen={this.props.isOpen} sidebarToggler={this.props.sidebarToggler} />
                <div className={styles.logo}>
                    <img src={AppLogo} alt="app logo" />
                </div>
                <div className={styles.user}>
                    <Avatar image={this.props.image} fullName={this.props.fullName} isCurrentUser='true'/>
                    <span className={styles.fullName}>{this.props.fullName}</span>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        fullName: state.auth.userDetails.fullName,
        image: state.auth.userDetails.image
    }
}

export default connect(mapStateToProps, null)(Headbar);