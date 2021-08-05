import React, { Component } from 'react';

import styles from './CustomTable.module.css';

class CustomTable extends Component {
    render() {
        return (
            <div className={styles.container}>
                <table className={styles.table}>
                    {this.props.children}
                </table>
            </div>
        );
    }
}

export default CustomTable;