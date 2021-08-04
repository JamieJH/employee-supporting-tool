import React, { Component } from 'react';
import Headbar from '../../Navigation/Headbar/Headbar';
import Sidebar from '../../Navigation/Sidebar/Sidebar';

import styles from './Layout.module.css';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
        this.sidebarToggler = this.sidebarToggler.bind(this)
        this.closeSidebarHandler = this.closeSidebarHandler.bind(this)
    }

    sidebarToggler() {
        this.setState((state) => ({
            isOpen: !state.isOpen
        }))
    }

    closeSidebarHandler() {
        this.setState({
            isOpen: false
        })
    }
    render() {
        return (
            <div className={styles.layout}>
                <Sidebar isOpen={this.state.isOpen} closeSidebarHandler={this.closeSidebarHandler} />
                <main className={!this.state.isOpen ? styles.collapsed : ''}>
                    <Headbar isOpen={this.state.isOpen} sidebarToggler={this.sidebarToggler} />
                    <div className={styles.mainContent}>
                        {this.props.children}
                    </div>
                </main>
            </div>
        );
    }
}

export default Layout
