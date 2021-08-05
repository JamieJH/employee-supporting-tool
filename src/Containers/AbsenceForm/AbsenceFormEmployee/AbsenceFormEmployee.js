import React, { Component } from 'react';
import firebase from 'firebase';
import 'firebase/database';

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
        this.checkEmployeeEmailExist = this.getUserFromEmployeeEmail.bind(this);
    }


    formSubmitHandler(e) {
        e.preventDefault();        
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

    async getUserFromEmployeeEmail() {
        return firebase.database().ref('/users')
            .orderByChild('email')
            .equalTo(this.state.employeeEmail)
            .once('value')
            .then(snapshot => {
                return snapshot.val();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    toDateChangeHandler(e) {
        this.setState({
            toDate: e.target.value
        })
    }

    render() {
        console.log(this.state);
        return (
            <div className={styles.formContainer}>
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
            </div>
        );
    }
}

export default AbsenceFormEmployee;