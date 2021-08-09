import PropTypes from 'prop-types';


export const userDetailsPropTypes = PropTypes.exact({
    dateStarted: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    dob: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    email: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    gender: PropTypes.oneOf(['female', 'male', 'other']).isRequired,
    id: PropTypes.string.isRequired,
    image: PropTypes.string,
    position: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['employee', 'admin', 'superadmin']).isRequired,
})

export const absenceRequestDetailsPropTypes = PropTypes.exact({
    processorId: PropTypes.string,
    employeeId: PropTypes.string.isRequired,
    fromDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    id: PropTypes.string,
    reason: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["approved", "pending", "denied"]).isRequired,
    toDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    processorComment: PropTypes.string
})

export const OTLogDetailsPropTypes = PropTypes.exact({
    id: PropTypes.string,
    processorId: PropTypes.string,
    employeeId: PropTypes.string.isRequired,
    date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    fromTime: PropTypes.string.isRequired,
    toTime: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["approved", "pending", "denied"]).isRequired,
    processorComment: PropTypes.string,
    workSummary: PropTypes.string,
    files: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
})