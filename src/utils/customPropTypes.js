import PropTypes from 'prop-types';


export const userDetailsPropTypes = PropTypes.exact({
    dateStarted: PropTypes.string.isRequired,
    dob: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    employeeType: PropTypes.oneOf(["fresher", "probation", "official"]),
    fullName: PropTypes.string.isRequired,
    gender: PropTypes.oneOf(['female', 'male', 'other']).isRequired,
    id: PropTypes.string.isRequired,
    image: PropTypes.string,
    position: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['employee', 'admin', 'superadmin']).isRequired,
    grossSalary: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    dependents: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    maxAbsenceDays: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    externalSalary: PropTypes.bool.isRequired,
    leaderId: PropTypes.string,
})

export const absenceRequestDetailsPropTypes = PropTypes.exact({
    processorId: PropTypes.string,
    employeeId: PropTypes.string.isRequired,
    fromDate: PropTypes.string.isRequired,
    id: PropTypes.string,
    reason: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["approved", "pending", "denied"]).isRequired,
    toDate: PropTypes.string.isRequired,
    processorComment: PropTypes.string
})

export const OTLogDetailsPropTypes = PropTypes.exact({
    id: PropTypes.string,
    processorId: PropTypes.string,
    employeeId: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    fromTime: PropTypes.string.isRequired,
    // toTime: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["approved", "pending", "denied"]).isRequired,
    processorComment: PropTypes.string,
    workSummary: PropTypes.string,
    files: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
})

export const SalaryFormulaFormPropTypes = {
	formula: PropTypes.object.isRequired,
	isInputsDisabled: PropTypes.bool.isRequired,
    saveEditHandler: PropTypes.func.isRequired
}