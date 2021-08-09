import React, { Component } from 'react';
import { connect } from 'react-redux';
import Avatar from '../../UI/Avatar/Avatar';
import AppLogo from '../../../assets/logo.png';
import NavItem from '../NavItem/NavItem';

import styles from './Sidebar.module.css';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.closeSidebarHandler = this.closeSidebarHandler.bind(this)
        this.sidebarRef = React.createRef()
    }

    closeSidebarHandler(e) {
        const navItemList = this.sidebarRef.current;
        if (navItemList.contains(e.target)) {
            this.props.closeSidebarHandler()
        }
    }

    render() {
        const className = `${styles.container} ${(this.props.isOpen && styles.open)}`;
        const navItems = this.props.pages;

        return (
            <div className={className}>
                <div className={styles.head}>
                    <div className={styles.user}>
                        <div className={styles.avatar}>
                            <Avatar image={this.props.image} fullName={this.props.fullName} isCurrentUser='true' />
                        </div>
                        <span>Hi, {this.props.fullName}</span>
                    </div>

                    <div className={styles.logo}>
                        <img src={AppLogo} alt="app logo" />
                    </div>
                </div>
                <ul className={styles.navItems} onClick={this.closeSidebarHandler} ref={this.sidebarRef}>
                    {navItems.map(item => {
                        return <NavItem
                            key={item.title}
                            nav={item}
                            isOpen={this.props.isOpen}></NavItem>
                    })}
                </ul>

                <NavItem
                    key="logout"
                    isOpen={this.props.isOpen}
                    isLogoutBtn={true}
                    nav={{
                        link: '/logout',
                        icon: "fa-sign-out-alt",
                        title: "Logout"
                    }}
                ></NavItem>

            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        pages: state.auth.pages,
        fullName: state.auth.userDetails.fullName,
        image: state.auth.userDetails.image
    }
}


export default connect(mapStateToProps, null)(Sidebar);