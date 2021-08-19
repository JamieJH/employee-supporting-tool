import React, { useEffect, useState } from 'react';
import { MainContentLayout } from '../../../Components';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import { showSpinner, hideSpinner } from '../../../redux/actions/actionCreators';
import { getApprovedAbsenceDaysCurrentYear, getOTHoursInTimePeriod } from '../../../utils/commonMethods';
import { useDispatch, useSelector } from 'react-redux';

import styles from './WorkCalendar.module.css'
import './FullCalendar.css';

const WorkCalendar = () => {

  const [events, setEvents] = useState(null);
  const userId = useSelector(state => state.auth.userId);
  const dispatch = useDispatch();

  // console.log(events);

  useEffect(() => {
    dispatch(showSpinner());

    const promises = [
      getApprovedAbsenceDaysCurrentYear(userId, false),
      getOTHoursInTimePeriod(userId, false, 'year')
    ]

    Promise.all(promises)
      .then(([absenceDays, otLogs]) => {
        const userEvents = [];

        console.log(absenceDays, otLogs);

        absenceDays.forEach(absenceDay => {
          userEvents.push({
            id: absenceDay.id,
            start: absenceDay.fromDate,
            end: absenceDay.toDate,
            title: absenceDay.reason,
            tooltipData: absenceDay.reason,
            classNames: [styles.absenceDay, styles.tooltip]
          })
        })

        otLogs.forEach(log => {
          const [fromTimeHour, fromTimeMinute] = log.fromTime.split(':');
          let endMinutes = parseFloat(fromTimeMinute) + (log.duration - Math.floor(log.duration)) * 60;
          let spareMinutes = endMinutes % 60;
          const endHour = parseFloat(fromTimeHour) + Math.floor(log.duration) + Math.floor(endMinutes / 60);
          const startDateTime = `${log.date}T${log.fromTime}`;
          const endDateTime = `${log.date}T${endHour}:${spareMinutes}`;

          userEvents.push({
            id: log.id,
            start: startDateTime,
            end: endDateTime,
            title: log.workSummary,
            tooltipData: `From: ${log.fromTime}, ${log.duration} hours - ${log.workSummary}`,
            classNames: [styles.otLog, styles.tooltip]
          })
        })

        setEvents(userEvents);
        dispatch(hideSpinner());
      })

  }, [dispatch, userId])


  const addTooltipData = (info) => {
    info.el.setAttribute("data-tooltip", info.event.extendedProps.tooltipData);
  }

  return (
    <MainContentLayout
      title='Work Calendar'
      description='See Absence Days, OT logged on your work calendar'
      applyMaxWidth={true}>
      {events && <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        initialEvents={events}
        eventDidMount={addTooltipData}
      />
      }

      <div className={styles.calendarLegends}>
        <h3>Legends</h3>
        <div className={styles.legendItem}>
          <div className={styles.legendAbsence}></div>
          <p>Absence Days</p>
        </div>

        <div className={styles.legendItem}>
          <div className={styles.legendOT}></div>
          <p>Approved OT Logged</p>
        </div>

      </div>

    </MainContentLayout>
  );
}

export default WorkCalendar;