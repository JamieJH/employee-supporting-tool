import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import { timestampMsToInputDate, dateStringToTimestampSecs } from '../../../utils/commonMethods';


import styles from '../../FormStyles.module.css';

class AbsenceFormCommon extends Component {
    constructor(props) {
        super(props);

        this.requestDetails = this.props.requestDetails;

        this.state = {
            employeeEmail: this.requestDetails ? this.requestDetails.email : '',
            reason: this.requestDetails ? this.requestDetails.reason : '',
            fromDate: this.requestDetails ? timestampMsToInputDate(this.requestDetails.fromDate) : '',
            toDate: this.requestDetails ? timestampMsToInputDate(this.requestDetails.toDate) : '',
        }

        this.formRef = React.createRef();

        this.formSubmitHandler = this.formSubmitHandler.bind(this);
        this.reasonChangeHandler = this.reasonChangeHandler.bind(this);
        this.toDateChangeHandler = this.toDateChangeHandler.bind(this);
        this.fromDateChangeHandler = this.fromDateChangeHandler.bind(this);
        this.checkEmployeeEmailExist = this.getUserFromEmployeeEmail.bind(this);
        this.employeeEmailChangeHandler = this.employeeEmailChangeHandler.bind(this);
    }

    employeeEmailChangeHandler(e) {
        this.setState({
            employeeEmail: e.target.value
        })
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

    async getUserFromEmployeeEmail() {
        try {
            const snapshot = await firebase.database().ref('/users')
                .orderByChild('email')
                .equalTo(this.state.employeeEmail)
                .once('value');
            return snapshot.val();
        } catch (err) {
            return console.log(err);
        }
    }


    formSubmitHandler(e) {
        e.preventDefault();
        const user = this.getUserFromEmployeeEmail();
        if (user) {
            // this.props.onSubmit({
            //     employeeEmail: this.state.employeeEmail,
            //     reason: this.state.reason,
            //     fromDate: this.state.fromDate,
            //     toDate: this.state.toDate
            // });

            console.log("has user");
        }
        else {
            // show error Modal
            console.log("no user");
        }
    }

    render() {
        return (
            <div className={styles.generalInfo}>
                <h3>General Information</h3>
                <form onSubmit={this.formSubmitHandler} ref={this.formRef}>
                    <div className={styles.formInput}>
                        <label htmlFor="email">Employee Email</label>
                        <input type="text" id="email"
                            value={this.state.employeeEmail}
                            placeholder="lastname.firstname@company.com"
                            title="Must be in format emailadress@domain.abc"
                            pattern="^[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                            onChange={this.employeeEmailChangeHandler}
                            required
                        />
                    </div>
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

                    <button className={styles.saveButton}>Save</button>
                </form>
            </div>
        );
    }
}

export default AbsenceFormCommon;