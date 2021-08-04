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
    acceptedBy: PropTypes.string,
    employeeId: PropTypes.string.isRequired,
    from: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    id: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["approved", "pending", "denied"]).isRequired,
    to: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
})