import React, { Component } from 'react';
import styles from './CustomCheckbox.module.css';

class CustomCheckbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false
        };
        this.checkHandler = this.checkHandler.bind(this);
    }

    checkHandler() {
        this.setState((state) => {
            return { isChecked: !state.isChecked }
        });
    }

    render() {
        const className = `${styles.customCheckbox} ${this.state.isChecked && styles.checked}`;

        return (
            <React.Fragment>
                <input className={className}
                    onClick={this.checkHandler}
                    type="checkbox"
                    id={`checkbox-${this.props.id}`} />
                <label htmlFor={`checkbox-${this.props.id}`}></label>
            </React.Fragment>
        );
    }
}

export default CustomCheckbox;