import React from 'react';

import Login from './Entry/Login/Login';

const HomePage = React.lazy(() => import('./Home/Home'));
const AllUsers = React.lazy(() => import('./Admin/UserTasks/AllUsers/AllUsers'));
const AddUser = React.lazy(() => import('./Admin/UserTasks/AddUser/AddUser'));
const EditUser = React.lazy(() => import('./Admin/UserTasks/EditUser/EditUser'));
const AbsenceRequestsAdmin = React.lazy(() => import('./Admin/AbsenceTasks/AbsenceRequests/AbsenceRequestsAdmin'));
const AbsenceRequestsEmployee = React.lazy(() => import('./Employee/AbsenceTasks/AbsenceRequestsEmployee/AbsenceRequestsEmployee'));
const AddAbsenceRequestAdmin = React.lazy(() => import('./Admin/AbsenceTasks/AddAbsenceRequest/AddAbsenceRequest'));
const AddAbsenceRequestEmployee = React.lazy(() => import('./Employee/AbsenceTasks/AddAbsenceRequestEmployee/AddAbsenceRequestEmployee'));
const EditAbsenceRequest = React.lazy(() => import('./Admin/AbsenceTasks/EditAbsenceRequest/EditAbsenceRequest'));
const AllOTLogsAdmin = React.lazy(() => import('./Admin/OTTasks/AllOTLogsAdmin/AllOTLogsAdmin'));
const AllOTLogsEmployee = React.lazy(() => import('./Employee/OTTasks/AllOTLogs/AllOTLogsEmployee'));
const LogOTAdmin = React.lazy(() => import('./Admin/OTTasks/LogOT/LogOTAdmin'));
const LogOTEmployee = React.lazy(() => import('./Employee/OTTasks/LogOT/LogOTEmployee'));
const EditOTLog = React.lazy(() => import('./Admin/OTTasks/EditOTLog/EditOTLog'));

export { 
    HomePage, Login, AllUsers, AddUser, EditUser,
    AbsenceRequestsAdmin, AbsenceRequestsEmployee, AddAbsenceRequestAdmin,
    AddAbsenceRequestEmployee, EditAbsenceRequest, AllOTLogsAdmin,
    AllOTLogsEmployee, LogOTAdmin, LogOTEmployee, EditOTLog,
    
}