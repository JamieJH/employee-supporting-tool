import React, { Component } from 'react';
import { timestampMsToInputDate, dateStringToTimestampSecs } from '../../../utils/commonMethods';

import styles from '../../FormStyles.module.css';
import AbsenceFormCommon from '../AbsenceFormInputsCommon/AbsenceFormInputsCommon';

class AbsenceFormAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            generalInfo: null,
        }

        this.formRef = React.createRef();
        this.positionRef = React.createRef();
        this.emailRef = React.createRef();

        this.generalInfoFormSubmitHandler = this.generalInfoFormSubmitHandler.bind(this);
        this.statusFormSubmitHandler = this.statusFormSubmitHandler.bind(this);
    }

    componentDidMount() {
        this.toggleStatusFormDisable(true)
    }

    generalInfoFormSubmitHandler(generalInfo) {
        this.setState({
            generalInfo: { ...generalInfo }
        })
    }


    statusFormSubmitHandler(e) {
        e.preventDefault()
        console.log("hi");
    }

    toggleStatusFormDisable(isDisabled) {
        const nodes = this.formRef.current.querySelectorAll('select, input, button');
        if (isDisabled) {
            nodes.forEach(node => node.setAttribute('disabled', true));
        }
        else {
            nodes.forEach(node => node.removeAttribute('disabled'));
        }
    }

    render() {
        console.log(this.state);

        return (
            <div className={styles.formContainer}>
                <AbsenceFormCommon onSubmit={this.generalInfoFormSubmitHandler} />
                <div className={styles.statusInfo}>
                    <h3>Status Information (Optional)</h3>
                    <form onSubmit={this.statusFormSubmitHandler} ref={this.formRef}>
                        <div className={styles.formInput}>
                            <label htmlFor="status">Status</label>
                            <select required ref={this.roleRef} id="user-role"
                                onChange={this.onStatusChange}
                                defaultValue={this.userDetailsForEditing ? this.userDetailsForEditing.status : ''}>
                                <option value="pending">pending</option>
                                <option value="approved">approved</option>
                                <option value="denied">denied</option>
                            </select>
                        </div>
                        <div className={styles.formInput}>
                            <label htmlFor="processor">Processed By</label>
                            <input type="text" id="reason"
                                defaultValue={this.userDetailsForEditing ? timestampMsToInputDate(this.userDetailsForEditing.dob) : ''}
                                max={this.todayDate}
                                placeholder="adminemailaddress@domain.com"
                                ref={this.dobRef}
                                required
                            />
                        </div>
                        <button
                            className={styles.saveButton}
                            onClick={this.statusFormSubmitHandler}>Save Status</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default AbsenceFormAdmin;