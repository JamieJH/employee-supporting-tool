import React, { Component } from 'react';
import Spinner from '../../../../Components/UI/Spinner/Spinner';
import PageHeader from '../../../../Components/UI/PageHeader/PageHeader';
import AddDataButton from '../../../../Components/UI/AddDataButton/AddDataButton';
import PageMainContainer from '../../../../Components/UI/PageMainContainer/PageMainContainer';
import OneUser from './OneUser/OneUser';
import firebase from 'firebase/app';
import 'firebase/database';

import styles from './AllUsers.module.css';
import CustomTable from '../../../../Components/CustomTable/CustomTable';

class AllUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employees: null,
            isAllChecked: false,
        }

        this.tableRef = React.createRef();

        this.checkAllHandler = this.checkAllHandler.bind(this);
        this.getUsersContentToDisplay = this.getUsersContentToDisplay.bind(this);
    }

    componentDidMount() {
        const usersDbRef = firebase.database().ref('/users');

        usersDbRef.orderByChild('role').equalTo('employee').once('value')
            .then(snapshot => {
                return snapshot.val();
            })
            .then(users => {
                const employees = [];
                for (const [id, userDetails] of Object.entries(users)) {
                    userDetails.id = id;
                    employees.push(userDetails);
                }

                this.setState({
                    employees: employees
                })
            })
    }

    checkAllHandler() {
        const tableElement = this.tableRef.current;
        const checkboxes = tableElement.querySelectorAll("input[type='checkbox']");

        let togglerMethod = (this.state.isAllChecked)
            ? (input) => { input.removeAttribute("checked") }
            : (input) => { input.setAttribute("checked", true) };

        checkboxes.forEach(checkbox => {
            togglerMethod(checkbox);
        })

        this.setState(state => {
            return {
                isAllChecked: !state.isAllChecked
            }
        });
    }


    getUsersContentToDisplay() {
        const employeesList = this.state.employees

        if (employeesList && employeesList.length === 0) {
            return <tr><td colSpan="5">There are currently no employee</td></tr>;
        }

        return employeesList.map(employee => {
            return <OneUser key={employee.id} details={employee} />;
        })
    }

    render() {
        return (!this.state.employees)
            ? <Spinner />
            : (
                <React.Fragment>
                    <PageHeader
                        title="Employee List"
                        description="Review, remove an employee"
                    />
                    <AddDataButton title="New User" path="/add-user" />
                    <PageMainContainer >
                        <CustomTable>
                            <thead>
                                <tr>
                                    <th className={styles.name}>Name</th>
                                    <th className={styles.role}>user type</th>
                                    <th className={styles.position}>Position</th>
                                    <th className={styles.date}>Date Started</th>
                                    <th className={styles.actions}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.getUsersContentToDisplay()}
                            </tbody>
                        </CustomTable>

                    </PageMainContainer>
                </React.Fragment>
            );
    }
}

export default AllUsers;