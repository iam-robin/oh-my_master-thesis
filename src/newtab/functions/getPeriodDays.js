import cloneDeep from 'lodash/cloneDeep';

export default function getPeriodDays(version, currentDate, activePeriod) {
  let date = cloneDeep(currentDate);
  let period = activePeriod;
  let startOfPeriod;
  let endOfPeriod;
  let currentPeriod = []; // complete period data in array

  if (version === 'current') {
    if (period === 'day') {
      startOfPeriod = cloneDeep(date);
      endOfPeriod = cloneDeep(date);
    } else if (period === 'week') {
      startOfPeriod = cloneDeep(date).startOf('isoWeek');
      endOfPeriod = cloneDeep(date).endOf('isoWeek');
    } else if (period === 'month') {
      startOfPeriod = cloneDeep(date).startOf('month');
      endOfPeriod = cloneDeep(date).endOf('month');
    }
  } else if (version === 'prev') {
    if (period === 'day') {
      startOfPeriod = cloneDeep(date).subtract(1, 'days');
      endOfPeriod = cloneDeep(date).subtract(1, 'days');
    } else if (period === 'week') {
      startOfPeriod = cloneDeep(date)
        .startOf('isoWeek')
        .subtract(1, 'weeks');
      endOfPeriod = cloneDeep(date)
        .endOf('isoWeek')
        .subtract(1, 'weeks');
    } else if (period === 'month') {
      startOfPeriod = cloneDeep(date)
        .startOf('month')
        .subtract(1, 'months');
      endOfPeriod = cloneDeep(date)
        .endOf('month')
        .subtract(1, 'months');
    }
  }

  let day = startOfPeriod;

  // get the period days
  while (day <= endOfPeriod) {
    currentPeriod.push(day.toDate());
    day = day.clone().add(1, 'd');
  }

  return currentPeriod;
}
