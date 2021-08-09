import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dateStringToTimestampSecs } from '../../../utils/commonMethods'

import styles from '../../FormStyles.module.css';

class AbsenceFormEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reason: '',
            toDate: '',
            fromDate: '',
        }

        this.formSubmitHandler = this.formSubmitHandler.bind(this);
        this.reasonChangeHandler = this.reasonChangeHandler.bind(this);
        this.toDateChangeHandler = this.toDateChangeHandler.bind(this);
        this.fromDateChangeHandler = this.fromDateChangeHandler.bind(this);
    }


    formSubmitHandler(e) {
        e.preventDefault();     
        const requestDetails = {
            employeeId: this.props.employeeId,
            reason: this.state.reason,
            toDate: dateStringToTimestampSecs(this.state.toDate),
            fromDate: dateStringToTimestampSecs(this.state.fromDate),
            status: 'pending'
        }
        this.props.onSubmitHandler(requestDetails)   
    }

    reasonChangeHandler(e) {
        this.setState({
            reason: e.target.value
        })
    }

    fromDateChangeHandler(e) {
        this.setState({
            fromDate: e.target.value
        })
    }

    toDateChangeHandler(e) {
        this.setState({
            toDate: e.target.value
        })
    }

    render() {
        return (
            <React.Fragment>
                <form onSubmit={this.formSubmitHandler} ref={this.formRef}>
                    <div className={styles.formInput}>
                        <label htmlFor="reason">Reason</label>
                        <input type="text" id="reason"
                            value={this.state.reason}
                            placeholder="Example: high fever, got in accident and now in hospital,..."
                            onChange={this.reasonChangeHandler}
                            required
                        />
                    </div>
                    <div className={styles.formInput}>
                        <label htmlFor="fromDate">From </label>
                        <input type="date" id="reason"
                            value={this.state.fromDate}
                            max={this.state.toDate}
                            onChange={this.fromDateChangeHandler}
                            required
                        />
                    </div>
                    <div className={styles.formInput}>
                        <label htmlFor="toDate">To</label>
                        <input type="date" id="reason"
                            value={this.state.toDate}
                            min={this.state.fromDate}
                            onChange={this.toDateChangeHandler}
                            required
                        />
                    </div>

                    <button className={styles.saveButton}>Submit</button>
                </form>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        employeeId: state.auth.userId
    }
}

export default connect(mapStateToProps, null)(AbsenceFormEmployee);