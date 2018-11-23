import getPeriodDays from './getPeriodDays';
import moment from 'moment';

export default function getChartData(data, mode, period) {
  let dominantColor = data[0].info.dominant_color.hex;
  console.log(data);

  let chartData = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: mode,
          data: [],
          backgroundColor: [dominantColor],
          borderColor: ['#000'],
          borderWidth: 3,
          lineTension: 0,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              padding: 0,
            },
          },
        ],
      },
    },
  };

  if (period === 'day') {
    let days = getPeriodDays(moment(), 'week');

    // set x-Axis label
    days.forEach(day => {
      // set x-Axis label
      let hasData = false;
      let formatedDay = moment(day).format('dd. DD.MMM');
      day = moment(day).format('YYYY-MM-DD');
      chartData.data.labels.push(formatedDay);

      for (let i = 0; i < data.length; i++) {
        if (data[i].date === day) {
          if (mode === 'time') {
            chartData.data.datasets[0].data.push(data[i].info.time);
          } else if (mode === 'views') {
            chartData.data.datasets[0].data.push(data[i].info.count);
          } else if (mode === 'clicks') {
            chartData.data.datasets[0].data.push(data[i].info.clicks);
          } else if (mode === 'scroll') {
            chartData.data.datasets[0].data.push(data[i].info.scroll);
          }
          hasData = true;
        }
      }

      if (!hasData) {
        chartData.data.datasets[0].data.push(0);
      }
    });
    console.log(chartData.data.datasets[0].data);
  } else if (period === 'week') {
    chartData.data.labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  }

  return chartData;
}
