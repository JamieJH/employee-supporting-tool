import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dateStringToTimestampSecs, timestampMsToInputDate } from '../../../utils/commonMethods';
import 'firebase/database';

import styles from '../../FormStyles.module.css';

class AbsenceFormAdmin extends Component {
    constructor(props) {
        super(props);
        this.todayDate = new Date().toISOString().split("T")[0];
        this.state = {
            isLoading: false,
            employeeEmail: this.getDetailFromProps('employeeEmail'),
            reason: this.getDetailFromProps('reason'),
            toDate: this.getDetailFromProps('toDate', '', true),
            fromDate: this.getDetailFromProps('fromDate', '', true),
            status: this.getDetailFromProps('status', 'pending'),
            processorComment: this.getDetailFromProps('processorComment', ''),
        }

        this.formRef = React.createRef();

        this.processorFullName = this.getDetailFromProps('processorFullName', this.props.adminFullName);

        this.enableEditing = this.enableEditing.bind(this);
        this.formSubmitHandler = this.formSubmitHandler.bind(this);
        this.reasonChangeHandler = this.reasonChangeHandler.bind(this);
        this.toDateChangeHandler = this.toDateChangeHandler.bind(this);
        this.statusChangeHandler = this.statusChangeHandler.bind(this);
        this.fromDateChangeHandler = this.fromDateChangeHandler.bind(this);
        this.employeeEmailChangeHandler = this.employeeEmailChangeHandler.bind(this);
        this.processorCommentChangeHandler = this.processorCommentChangeHandler.bind(this);
    }

    getDetailFromProps(key, defaultValue = '', isDate = false) {
        if (isDate) {
            return this.props.requestDetails
                ? timestampMsToInputDate(this.props.requestDetails[key])
                : defaultValue;
        }
        return this.props.requestDetails ? this.props.requestDetails[key] : defaultValue;
    }

    componentDidMount() {
        if (this.props.action === 'edit') {
            this.toggleFormInputsDisabled(true);
        }
    }

    toggleFormInputsDisabled(isDisabled) {
        if (isDisabled) {
            this.formRef.current.querySelectorAll('input, select')
                .forEach(node => node.setAttribute('disabled', true));
        }
        else {
            this.formRef.current.querySelectorAll('input:not(#email, #processor), select')
                .forEach(node => node.removeAttribute('disabled'));
        }
    }


    formSubmitHandler(e) {
        e.preventDefault();
        const absenceRequest = {
            reason: this.state.reason,
            fromDate: dateStringToTimestampSecs(this.state.fromDate),
            toDate: dateStringToTimestampSecs(this.state.toDate),
            status: this.state.status,
            processorId: this.props.adminId,
            processorComment: this.state.processorComment,
        }
        if (this.props.action === 'add') {
            this.props.onSubmitHandler(absenceRequest, this.state.employeeEmail);
        }
        else {
            absenceRequest.employeeId = this.props.requestDetails.employeeId;
            this.props.onSubmitHandler(absenceRequest, this.props.requestDetails.id);
        }
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

    statusChangeHandler(e) {
        this.setState({
            status: e.target.value
        })
    }

    toDateChangeHandler(e) {
        this.setState({
            toDate: e.target.value
        })
    }

    fromDateChangeHandler(e) {
        this.setState({
            fromDate: e.target.value
        })
    }

    processorCommentChangeHandler(e) {
        this.setState({
            processorComment: e.target.value
        })
    }

    enableEditing(e) {
        e.preventDefault();
        this.setState({
            isEditing: true
        })
        this.toggleFormInputsDisabled(false);
    }

    getFunctionButton() {
        if (this.props.action === 'add' || this.state.isEditing) {
            return <button type="submit" className={styles.saveButton}>Save</button>
        }
        else {
            return <button type="button" onClick={this.enableEditing} className={styles.editButton}>Edit</button>
        }
    }


    render() {
        return (
            <React.Fragment>
                <form className={styles.form} onSubmit={this.formSubmitHandler} ref={this.formRef}>
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
                        <input type="date" id="fromDate"
                            value={this.state.fromDate}
                            max={this.state.toDate}
                            onChange={this.fromDateChangeHandler}
                            required
                        />
                    </div>
                    <div className={styles.formInput}>
                        <label htmlFor="toDate">To</label>
                        <input type="date" id="toDate"
                            value={this.state.toDate}
                            min={this.state.fromDate}
                            onChange={this.toDateChangeHandler}
                            required
                        />
                    </div>
                    <div className={styles.formInput}>
                        <label htmlFor="status">Status</label>
                        <select required id="status"
                            onChange={this.statusChangeHandler}
                            value={this.state.status}>
                            <option value="pending">pending</option>
                            <option value="approved">approved</option>
                            <option value="denied">denied</option>
                        </select>
                    </div>

                    <div className={styles.formInput}>
                        <label htmlFor="processor">Processor</label>
                        <input type="text" id="processor"
                            style={{ textTransform: 'capitalize' }}
                            value={this.processorFullName}
                            readOnly
                            required disabled />
                        <p className={styles.inputFootnote}>
                            Adding this request or changing its original details will list you as the Processor.
                        </p>
                    </div>
                    <div className={styles.formInput}>
                        <label htmlFor="processorComment">processor comment</label>
                        <input type="text" id="processorComment"
                            placeholder="Example: reason for denial, encouragement, etc"
                            onChange={this.processorCommentChangeHandler}
                            value={this.state.processorComment} />
                    </div>

                    {this.getFunctionButton()}
                </form>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        adminId: state.auth.userId,
        adminFullName: state.auth.userDetails.fullName
    }
}

export default connect(mapStateToProps, null)(AbsenceFormAdmin);