import React, { Component } from 'react';

import styles from './PageHeader.module.css'

class PageHeader extends Component {

    render() {
        return (
            <div className={styles.pageHeader}>
                <h2>{this.props.title}</h2>
                <p>{this.props.description}</p>
            </div>
        );
    }
}

export default PageHeader;