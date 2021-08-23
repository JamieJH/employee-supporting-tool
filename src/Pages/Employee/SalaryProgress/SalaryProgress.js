import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { hideSpinner, openModal, showSpinner } from '../../../redux/actions/actionCreators';
import { camelCaseToRegularString, addCommasToNumber, getOTHoursInTimePeriod, getApprovedAbsenceDaysCurrentYear } from '../../../utils/commonMethods';
import { MainContentLayout, CustomTable } from '../../../Components';
import firebase from 'firebase/app';
import 'firebase/database';

import styles from './SalaryProgress.module.css';

const SalaryProgress = () => {

	const userId = useSelector(state => state.auth.userId);
	const gross = useSelector(state => state.auth.userDetails.grossSalary);
	const maxAbsenceDays = useSelector(state => state.auth.userDetails.maxAbsenceDays);
	const [salaryHistory, setSalaryHistory] = useState([]);
	const [totalOTHours, setTotalOTHours] = useState(null);
	const [totalAbsenceDays, setTotalAbsenceDays] = useState(null);
	const [year, setYear] = useState(new Date().getFullYear());
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(showSpinner());

		firebase.database().ref('/salary-histories').child(userId).orderByKey()
			.startAt(year.toString() + "-")
			.endAt(year.toString() + "-\uf8ff")
			.once('value')
			.then(snapshot => snapshot.val())
			.then(history => {
				if (!history) {
					setSalaryHistory([]);
				}
				else {
					setSalaryHistory(history);
				}
				dispatch(hideSpinner());
			})
			.catch(() => {
				dispatch(openModal({
					content: 'Something went wrong, cannot get salary history at this time!'
				}))
			})

	}, [userId, dispatch, year])

	useEffect(() => {
		dispatch(showSpinner());

		const promises = [
			getOTHoursInTimePeriod(userId),
			getApprovedAbsenceDaysCurrentYear(userId)
		]

		Promise.all(promises)
			.then(([otHours, absenceDays]) => {
				setTotalOTHours(otHours);
				setTotalAbsenceDays(absenceDays);
				dispatch(hideSpinner());
			})
			.catch(() => {
				dispatch(openModal({
					content: 'Something went wrong, cannot get current progress at this time!'
				}))
			})
	}, [userId, dispatch])

	const getOrCreateTooltip = (chart) => {
		let tooltipEl = chart.canvas.parentNode.querySelector('div');

		if (!tooltipEl) {
			tooltipEl = document.createElement('div');
			tooltipEl.className = styles.customTooltip
			chart.canvas.parentNode.appendChild(tooltipEl);
		}

		return tooltipEl;
	};

	const externalTooltipHandler = (context) => {
		const { chart, tooltip } = context;
		const tooltipEl = getOrCreateTooltip(chart);

		// Hide if no tooltip
		if (tooltip.opacity === 0) {
			tooltipEl.style.opacity = 0;
			return;
		}

		if (tooltip.body) {
			const title = tooltip.title[0];
			const tooltipLabel = document.createElement('p');
			tooltipLabel.className = styles.tooltipLabel;
			tooltipLabel.innerText = title;

			const tooltipBody = document.createElement('div');
			tooltipBody.className = styles.tooltipBody;

			Object.keys(salaryHistory[title]).forEach(section => {
				const content = document.createElement('p');
				content.textContent = `${camelCaseToRegularString(section)}: ${addCommasToNumber(salaryHistory[title][section])}`;
				tooltipBody.appendChild(content);
			})

			// tooltipBody.innerText = "something";

			// Remove old tooltip
			while (tooltipEl.firstChild) {
				tooltipEl.firstChild.remove();
			}

			// Add new tooltip
			tooltipEl.appendChild(tooltipLabel);
			tooltipEl.appendChild(tooltipBody);
		}

		const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
	
		tooltipEl.style.opacity = 0.9;
		tooltipEl.style.left = positionX + tooltip.caretX + 'px';

		// display tooltip below the data point if there's enough space, display above otherwise
		// because too long tooltip will clash with the table below
		if (tooltip.caretY + tooltipEl.clientHeight > chart.canvas.clientHeight) {
			tooltipEl.style.top = 'auto';
			tooltipEl.style.bottom = (chart.canvas.clientHeight - tooltip.caretY) + 'px';
		}
		else {
			tooltipEl.style.top = positionY + tooltip.caretY + 'px';
			tooltipEl.style.bottom = 'auto';
		}
	};

	const getChartData = () => {
		const labels = [];
		const data = [];
		const styleVariables = getComputedStyle(document.body);

		Object.keys(salaryHistory).forEach(time => {
			labels.push(time);
			data.push(salaryHistory[time].netSalary)
		})

		const chartData = {
			labels: labels,
			datasets: [
				{
					label: 'Net Salary',
					data: data,
					fill: false,
					borderColor: styleVariables.getPropertyValue('--theme-dark-bg'),
					backgroundColor: styleVariables.getPropertyValue('--theme-dark-bg'),
				},
			],
		};

		return chartData;

	}

	const showProgressData = () => {
		if (totalAbsenceDays !== null && totalOTHours !== null) {
			const progressData = {
				grossSalary: addCommasToNumber(gross),
				overtimeRate: addCommasToNumber(Math.round(gross / 22 / 8)),
				OTHoursLoggedThisMonth: totalOTHours,
				absenceDaysTakenThisYear: totalAbsenceDays + " (Max: " + maxAbsenceDays + ")"
			}
			return Object.keys(progressData).map(item => {
				return (
					<tr key={item}>
						<td>{camelCaseToRegularString(item)}</td>
						<td>{progressData[item]}</td>
					</tr>
				)
			})
		}
		return <tr><td></td></tr>
	}

	const onYearInputChange = (e) => {
		setYear(e.target.value);
	}

	const options = {
		interaction: {
			mode: 'index',
			intersect: false,
		},
		plugins: {
			title: {
				display: true,
				text: 'Salary History'
			},
			tooltip: {
				enabled: false,
				position: 'nearest',
				external: externalTooltipHandler
			}
		},
		scales: {
			yAxis: {
				// min: 0,
				maxTicksLimit: 6
			}
		},
		maintainAspectRatio: false
	};


	return (

		<MainContentLayout
			title='Salary Progress'
			description='See salary history of the most recent 12 months and review current month/year progress'
			applyMaxWidth={true}>

			<form className={styles.yearFilter}>
				<div className='formInput'>
					<label htmlFor="year">Year</label>
					<input type="number" value={year} min='2010' max={new Date().getFullYear()} onChange={onYearInputChange} />
					{/* <button>Show</button> */}
				</div>
			</form>

			<div className={styles.historyChart}>
				<Line height={'100%'} data={getChartData()} options={options} />
				{salaryHistory.length === 0 && (
					<div className={styles.noData}>
						<p>There is no salary history for this year</p>
					</div>
				)}
			</div>


			<div className={styles.progress}>
				<h3>Current progress</h3>

				<CustomTable>
					<thead>
						<tr>
							<th align="left" className={styles.section}>Section</th>
							<th align="left" className={styles.amount}>Amount</th>
						</tr>
					</thead>
					<tbody>
						{showProgressData()}
					</tbody>
				</CustomTable>
			</div>


		</MainContentLayout>

	);
}

export default SalaryProgress;