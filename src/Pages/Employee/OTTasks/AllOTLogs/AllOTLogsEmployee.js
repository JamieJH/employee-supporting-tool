import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from '../../../../Components/UI/Spinner/Spinner';
import PageHeader from '../../../../Components/UI/PageHeader/PageHeader';
import PageMainContainer from '../../../../Components/UI/PageMainContainer/PageMainContainer';
import AddDataButton from '../../../../Components/UI/AddDataButton/AddDataButton';
import CustomTable from '../../../../Components/CustomTable/CustomTable';
import firebase from 'firebase/app';
import 'firebase/database';
import OneOTLog from './OneOTLog/OneOTLog';

import styles from './AllOTLogsEmployee.module.css';

class AllOTLogsEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            logs: null
        }

        this.getLogsContentToDisplay = this.getLogsContentToDisplay.bind(this);

    }

    componentDidMount() {
        firebase.database().ref('/ot-logs').orderByChild('employeeId').equalTo(this.props.employeeId)
            .once('value')
            .then(snapshot => {
                return snapshot.val();
            })
            .then(data => {
                const logs = [];
                for (const [id, details] of Object.entries(data)) {
                    details.id = id;
                    logs.push(details);
                }

                this.setState({
                    isLoading: false,
                    logs: logs
                })
            })
    }


    getLogsContentToDisplay() {
        const logs = this.state.logs;

        if (logs && logs.length === 0) {
            return <tr><td colSpan="6">There are currently no logs</td></tr>;
        }

        return logs.map(log => {
            return <OneOTLog key={log.id} details={log} />;
        })
    }

    render() {
        return (!this.state.logs)
            ? <Spinner />
            : (
                <React.Fragment>
                    <PageHeader
                        title="OT Logs"
                        description="Review the status of all logs you have made."
                    />
                    <AddDataButton title="Log OT" path="/log-ot" />
                    <PageMainContainer>
                        <CustomTable>
                            <thead>
                                <tr>
                                    <th className={styles.workSummary}>Work summary</th>
                                    <th className={styles.dateTime}>Date & Time</th>
                                    <th className={styles.status}>Status</th>
                                    <th className={styles.processor}>processor</th>
                                    <th className={styles.processorComment}>Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.getLogsContentToDisplay()}
                            </tbody>
                        </CustomTable>

                    </PageMainContainer>
                </React.Fragment>
            );
    }
}

const mapStateToProps = (state) => {
    return {
        employeeId: state.auth.userId
    }
}

export default connect(mapStateToProps, null)(AllOTLogsEmployee);