<template>
<div class="component">

  <div class="left" :style="{ 'background-color': getCurrentColor()}">
    <MainHeader 
      :links="[{name: 'all websites', to: '/ratio'}]"
      state="close"/>
    <h1>{{ data[0].info.domain }}</h1>
    <footer></footer>
  </div>

  <div class="right">
    <main>

      <!-- CHART -->

      <div class="settings">

        <div class="period">
          <div class="prev" v-on:click="prevDate()"></div>
          <div class="value">{{ formatedDate }}</div>
          <div class="next" v-on:click="nextDate()"></div>
        </div>

        <div class="menus">
          <div class="select-container icon" :class="activeMode">
            <select v-model="activeMode" v-on:change="setMode(activeMode)">
              <option value="time">time</option>
              <option value="views">views</option>
              <option value="clicks">clicks</option>
              <option value="scroll">scroll</option>
            </select>
          </div>

          <div class="select-container">
            <select v-model="activePeriod" v-on:change="setPeriod(activePeriod)">
              <option value="week">week</option>
              <option value="month">month</option>
              <option value="year">year</option>
            </select>
          </div>

        </div>

      </div>

      <canvas id="usage-chart"></canvas>

      <div class="stat-container">

        <h1>total</h1>
        <div class="stat-overview">

          <div class="box">
            <h2>time spent</h2>
            <p v-if="periodSum.time != 0">{{formatMS(periodSum.time, true)}}</p>
            <p v-else>–</p>
          </div>

          <div class="box">
            <h2>site views</h2>
            <p v-if="periodSum.views != 0">{{periodSum.views}} views</p>
            <p v-else>–</p>
          </div>

          <div class="box">
            <h2>clicks</h2>
            <p v-if="periodSum.clicks != 0">{{periodSum.clicks}} clicks</p>
            <p v-else>–</p>
          </div>

          <div class="box">
            <h2>scroll distance</h2>
            <p v-if="periodSum.scroll > 1000000">{{parseInt(periodSum.scroll/ 1000000)}}M px</p>
            <p v-else-if="periodSum.scroll > 1000">{{parseInt(periodSum.scroll / 1000)}}K px</p>
            <p v-else-if="periodSum.scroll > 0">{{periodSum.scroll}} px</p>
            <p v-else>–</p>
          </div>

        </div>

        <h1>average per day</h1>
        <div class="stat-overview">

          <div class="box">
            <h2>Ø time spent</h2>
            <p v-if="periodSum.time != 0">{{formatMS(periodSum.time / periodSum.dataCount, true)}}</p>
            <p v-else>–</p>
          </div>

          <div class="box">
            <h2>Ø site views</h2>
            <p v-if="periodSum.views != 0">{{Number((periodSum.views / periodSum.dataCount).toFixed(1))}} views</p>
            <p v-else>–</p>
          </div>

          <div class="box">
            <h2>Ø clicks</h2>
            <p v-if="periodSum.clicks != 0">{{Number((periodSum.clicks / periodSum.dataCount).toFixed(1))}} clicks</p>
            <p v-else>–</p>
          </div>

          <div class="box">
            <h2>Ø scroll distance</h2>
            <p v-if="periodSum.scroll != 0">{{Number((periodSum.scroll / periodSum.dataCount).toFixed(1))}} px</p>
            <p v-else>–</p>
          </div>

        </div>

        <h1>average per site view</h1>
        <div class="stat-overview">

          <div class="box">
            <h2>Ø time per site view</h2>
            <p v-if="periodSum.time != 0 && periodSum.views != 0">{{formatMS(periodSum.time / periodSum.views, true)}}</p>
            <p v-else>–</p>
          </div>

          <div class="box">
            <h2>Ø clicks per site view</h2>
            <p v-if="periodSum.clicks != 0">{{Math.round((periodSum.clicks/periodSum.views) * 100) / 100}} clicks</p>
            <p v-else>–</p>
          </div>

          <div class="box">
            <h2>Ø scroll distance per site view</h2>
            <p v-if="periodSum.scroll != 0">{{parseInt(Math.round((periodSum.scroll/periodSum.views) * 100) / 100)}} px</p>
            <p v-else>–</p>
          </div>

          <div class="box">
            <h2>Ø scroll speed</h2>
            <p v-if="periodSum.scroll != 0">{{getScrollSpeed()}} px/sec</p>
            <p v-else>–</p>
          </div>
        </div>
      </div>
    </main>

  </div>

</div>
</template>

<script>
import MainHeader from '../../components/MainHeader.vue';
import getChartData from '../../functions/getChartData.js';

import moment from 'moment';
import Chart from 'chart.js';
import formatMS from '../../functions/formatMS';

export default {
  name: 'detail-page',

  components: {
    MainHeader,
  },

  data: function() {
    return {
      domain: '',
      date: moment(),
      formatedDate: '',
      data: [],
      periodSum: {},
      activePeriod: 'month',
      activeMode: 'time',
      myChart: {},
      chartData: {},
    };
  },

  created: function() {
    this.domain = this.$route.params.domain;
    this.data = this.getDetailData();
    this.getPeriodSum();

    this.getChartDate();
    this.chartData = getChartData(this.data, this.activeMode, this.activePeriod, this.date);

    // send data to app.vue
    this.$emit('detailPageActive', true);
  },

  mounted() {
    this.createChart('usage-chart', this.chartData);
  },

  methods: {
    formatMS,

    getDetailData: function() {
      let storageKeys = Object.keys(localStorage);
      let data = [];
      for (let i = 0; i < storageKeys.length; i++) {
        let key = storageKeys[i];
        if (key !== 'limits') {
          let websites = JSON.parse(localStorage.getItem(key));
          for (let i = 0; i < websites.length; i++) {
            if (websites[i].domain === this.domain) {
              let object = {
                date: key,
                info: websites[i],
              };
              data.push(object);
            }
          }
        }
      }
      return data;
    },

    getPeriodSum: function() {
      let periodSum = {
        time: 0,
        views: 0,
        clicks: 0,
        scroll: 0,
        dataCount: 0,
      };

      for (let i = 0; i < this.data.length; i++) {
        periodSum.time += this.data[i].info.time;
        periodSum.views += this.data[i].info.count;
        periodSum.clicks += this.data[i].info.clicks;
        periodSum.scroll += this.data[i].info.scroll;
        periodSum.dataCount++;
      }
      this.periodSum = periodSum;
    },

    getCurrentColor: function() {
      let color;
      for (let i = 0; i < this.data.length; i++) {
        color = this.data[i].info.dominant_color.hex;
      }
      return color;
    },

    createChart: function(chartId, chartData) {
      const ctx = document.getElementById('usage-chart');
      this.myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });
    },

    getChartDate: function() {
      if (this.activePeriod === 'week') {
        let startOfWeek = moment(this.date).startOf('isoWeek');
        let endOfWeek = moment(this.date).endOf('isoWeek');
        this.formatedDate = startOfWeek.format('DD.MM') + ' - ' + endOfWeek.format('DD.MM.YYYY');
      } else if (this.activePeriod === 'month') {
        let month = moment(this.date).format('MMM YYYY');
        this.formatedDate = month;
      } else if (this.activePeriod === 'year') {
        let year = moment(this.date).format('YYYY');
        this.formatedDate = year;
      }
    },

    getScrollSpeed: function() {
      let scroll = this.periodSum.scroll;
      let timeInSec = parseInt(this.periodSum.time / 1000);
      let speed = scroll / timeInSec;
      speed = Math.round(speed * 100) / 100;

      return speed;
    },

    getPeriod: function(menuItem) {
      return this.activePeriod === menuItem;
    },

    setPeriod: function(menuItem) {
      this.activePeriod = menuItem;
      this.getPeriodSum();

      // reload chart
      this.myChart.destroy();
      this.getChartDate();
      this.chartData = getChartData(this.data, this.activeMode, this.activePeriod, this.date);
      this.createChart('usage-chart', this.chartData);
    },

    setMode: function(menuItem) {
      // reload chart
      this.myChart.destroy();
      this.chartData = getChartData(this.data, this.activeMode, this.activePeriod, this.date);
      this.createChart('usage-chart', this.chartData);
    },

    prevDate: function() {
      if (this.activePeriod === 'week') {
        this.date = this.date.subtract(1, 'weeks');
      } else if (this.activePeriod === 'month') {
        this.date = this.date.subtract(1, 'months');
      } else if (this.activePeriod === 'year') {
        this.date = this.date.subtract(1, 'year');
      }

      // reload chart
      this.myChart.destroy();
      this.getChartDate();
      this.chartData = getChartData(this.data, this.activeMode, this.activePeriod, this.date);
      this.createChart('usage-chart', this.chartData);
    },

    nextDate: function() {
      if (this.activePeriod === 'week') {
        this.date = this.date.add(1, 'weeks');
      } else if (this.activePeriod === 'month') {
        this.date = this.date.add(1, 'months');
      } else if (this.activePeriod === 'year') {
        this.date = this.date.add(1, 'year');
      }

      // reload chart
      this.myChart.destroy();
      this.getChartDate();
      this.chartData = getChartData(this.data, this.activeMode, this.activePeriod, this.date);
      this.createChart('usage-chart', this.chartData);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../scss/_colors.scss';

.left {
  display: flex;
  position: fixed;
  width: 40%;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-right: 3px solid $black;

  header {
    display: flex;
    width: 100%;
    height: 120px;
    background-color: $white;
    border-bottom: 3px solid $black;
    box-sizing: border-box;
    justify-content: space-between;
  }

  h1 {
    font-size: 32px;
    color: $white;
  }
}

.right {
  display: inline-block;
  margin-left: 40%;
  width: 60%;
  min-height: 100vh;
  padding: 40px 80px;
  box-sizing: border-box;
  background-color: $lightgrey;

  .settings {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;

    .period {
      font-size: 16px;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      margin-left: -8px;

      .next,
      .prev {
        cursor: pointer;
        height: 16px;
        width: 16px;
        padding: 8px;
        background-size: 16px 16px;
        background-position: center;
        background-repeat: no-repeat;
      }

      .next {
        margin-left: 8px;
        background-image: url('@~/icons/arrow-right.svg');
      }

      .prev {
        margin-right: 8px;
        background-image: url('@~/icons/arrow-right.svg');
        transform: rotate(180deg);
      }
    }

    .menus {
      .select-container {
        margin-left: 8px;
        position: relative;
        display: inline-block;
        border: 3px solid $black;

        /*  &.icon {
          padding-left: 20px;
        }
 */
        &:after {
          content: '';
          position: absolute;
          display: inline-block;
          height: 16px;
          width: 16px;
          background-image: url('@~/icons/arrow-down.svg');
          background-size: cover;
          background-repeat: no-repeat;
          right: 4px;
          top: 4px;
          z-index: 5;
          pointer-events: none;
        }

        /*  &:before {
          content: '';
          display: inline-block;
          position: absolute;
          left: 8px;
          top: 8px;
          height: 16px;
          width: 16px;
          background-size: 16px 16px;
          background-position: center;
          background-repeat: no-repeat;
        }

        &.time:before {
          background-image: url('@~/icons/time.svg');
        }
        &.views:before {
          background-image: url('@~/icons/views.svg');
        }
        &.clicks:before {
          background-image: url('@~/icons/clicks.svg');
        }
        &.scroll:before {
          background-image: url('@~/icons/scroll.svg');
        } */

        /*  &:before {
          content: '';
          display: inline-block;
          position: absolute;
          top: 0;
          right: 24px;
          height: 24px;
          width: 3px;
          background-color: $black;
        } */

        select {
          background-color: transparent;
          border: none;
          padding: 4px 32px 4px 8px;
          -webkit-appearance: none;
          -moz-appearance: none;
          text-indent: 1px;
          text-overflow: '';
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          cursor: pointer;
          z-index: 10;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }

  main {
    h1 {
      font-size: 18px;
    }

    .stat-container {
      margin-top: 160px;
    }

    .stat-overview {
      display: flex;
      flex-wrap: wrap;
      margin: 8px 0 80px;

      .box {
        width: 25%;
        display: inline-block;
        margin-bottom: 32px;

        h2 {
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          font-size: 12px;
          line-height: 1.5;
          width: 60%;
        }

        p {
          font-size: 16px;
          font-weight: 800;
          margin: 0;
        }
      }
    }
  }
}
</style>
