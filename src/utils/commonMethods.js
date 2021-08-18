import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";


// input: yyyy-mm-dd
// output: dd/mm/yyyy
export const inputDateToDateString = (inputDate) => {
	return new Date(inputDate).toLocaleDateString('en-uk');
}

export const getUserAssociatedWithEmail = (email) => {
	return firebase.database().ref('/users')
		.orderByChild('email')
		.equalTo(email)
		.once('value')
		.then(snapshot => {
			const [id, userDetails] = Object.entries(snapshot.val())[0];
			userDetails.id = id;
			return userDetails;
		})
		.catch(() => {
			return null
		})
}

export const getUserAssociatedWithId = (id) => {
	return firebase.database().ref('/users/' + id)
		.once('value')
		.then(snapshot => {
			const userDetails = snapshot.val();
			userDetails.id = id;
			return userDetails;
		})
		.catch(() => {
			return null
		})
}

export const uploadImageAndGetURL = (imageFile, imageName) => {
	const storageRef = firebase.storage().ref('profile-images/' + imageName);
	return storageRef.put(imageFile)
		.then(() => {
			return storageRef.getDownloadURL()
				.then(url => {
					return url;
				})
		}).catch(() => {
			return null;
		})
}

export const uploadMultipleFilesAndGetURLs = (files, filesNames) => {
	const promises = files.map((file, index) => {
		return firebase.storage().ref('ot-files/' + filesNames[index]).put(file)
			.then(snapshot => {
				return snapshot.ref.getDownloadURL();
			})
			.then(url => {
				return {
					name: file.name,
					url: url
				};
			})
			.catch(() => {
				return null;
			})
	})

	return Promise.all(promises);
}

export const deleteMultipleFiles = (fileNames) => {
	return fileNames.map(fileName => {
		return firebase.storage().ref('ot-files').child(fileName).delete();
	})
}

export const camelCaseToRegularString = (name) => {
	return name.replace(/([a-z])([A-Z])/g, '$1 $2');
}

export const addCommasToNumber = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const getDateLimitsAsString = (type, day = null, month = null, year = null) => {
	const today = new Date();
	let startDate;
	let endDate
	const limitYear = year || today.getFullYear();
	const limitDay = day || 27;
	if (type === 'ot') {
		const limitMonth = month ? month - 1 : today.getMonth();  	// minus 1 because month start at 0
		startDate = new Date(limitYear, limitMonth - 1, limitDay).toLocaleDateString('en-uk');
		endDate = new Date(limitYear, limitMonth, limitDay).toLocaleDateString('en-uk');
	}
	// start and end date to calculate total absence date
	else {
		const limitMonth = month ? month - 1 : 11;  	// minus 1 because month start at 0
		startDate = new Date(limitYear - 1, limitMonth, limitDay).toLocaleDateString('en-uk');
		endDate = new Date(limitYear, limitMonth, limitDay).toLocaleDateString('en-uk');
	}

	// format: "yyyy-mm-dd"
	startDate = startDate.split('/').reverse().join('-');
	endDate = endDate.split('/').reverse().join('-');

	return { startDate, endDate };
}


// if getTotal is true, get total hours only, else get the ot logs objects
export const getOTHoursInTimePeriod = async (userId, getTotal = true, period = 'month', month = null) => {
	const { startDate, endDate } = (period === 'month')
		? getDateLimitsAsString('ot', null, month)
		: getDateLimitsAsString();

	return firebase.database().ref('/ot-logs')
		.orderByChild('date').startAt(startDate).endAt(endDate)
		.once('value')
		.then(snapshot => snapshot.val())
		.then(otLogs => {
			if (!getTotal) {
				if (!otLogs) {
					return [];
				}
				const approvedLogs = [];

				Object.keys(otLogs).forEach(id => {
					if (otLogs[id].employeeId === userId && otLogs[id].status === "approved") {
						otLogs[id].id = id;
						approvedLogs.push(otLogs[id]);
					}
				})

				return approvedLogs;
			}
			else {
				if (!otLogs) {
					return 0;
				}
				const totalOtHours = Object.values(otLogs).reduce((accumulated, log) => {
					if (log.employeeId === userId && log.status === "approved") {
						accumulated += parseFloat(log.duration)
					}
					return accumulated;
				}, 0);
				return totalOtHours;
			}
		})
}

// if getTotal is true, get total days only, else get the absence objects
export const getApprovedAbsenceDaysCurrentYear = async (userId, getTotal = true) => {
	const { startDate, endDate } = getDateLimitsAsString();

	// the consideration limits is [startDate, endDate], 
	return firebase.database().ref('/absence-requests')
		.orderByChild('employeeId').equalTo(userId)
		.once('value')
		.then(snapshot => snapshot.val())
		.then(requests => {

			if (!getTotal) {
				if (!requests) {
					return [];
				}
				const absenceDays = [];

				Object.keys(requests).forEach(id => {
					const { fromDate, toDate } = requests[id];

					if (requests[id].status === "approved" && (
						(fromDate >= startDate && fromDate <= endDate)
						|| (toDate >= startDate && toDate <= endDate))) {
						requests[id].id = id;
						absenceDays.push(requests[id]);
					}
				})

				return absenceDays;
			}
			else {
				if (!requests) {
					return 0;
				}
				const totalAbsenceDays = Object.values(requests).reduce((accumulated, request) => {
					const { fromDate, toDate } = request;

					// if request is approved and either fromDate or toDate is within limits
					if (request.status === "approved" && (
						(fromDate >= startDate && fromDate <= endDate)
						|| (toDate >= startDate && toDate <= endDate))) {
						const toDateTimestamp = new Date(toDate).getTime();
						const endDateTimestamp = new Date(endDate).getTime();
						const fromDateTimestamp = new Date(fromDate).getTime();
						const startDateTimestamp = new Date(startDate).getTime();

						// there are 3 cases: 
						// - both fromDate and toDate is within limits     => days = toDate - fromDate
						// - fromDate < startDate, toDate is within limits => days = toDate - startDate
						// - toDate > endDate, startDate is within limits  => days = endDate - fromDate

						const lastDayTimestamp = Math.min(toDateTimestamp, endDateTimestamp);
						const firstDayTimestamp = Math.max(fromDateTimestamp, startDateTimestamp);
						const durationInMillisecs = lastDayTimestamp - firstDayTimestamp;
						const durationInDays = (durationInMillisecs / 24 / 60 / 60 / 1000) + 1;

						return accumulated += durationInDays;
					}
					return accumulated;
				}, 0);
				return totalAbsenceDays;
			}
		})
}
