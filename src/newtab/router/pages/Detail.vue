<template>
<div class="component">

  <div class="left" :style="{ 'background-color': getCurrentColor()}">
    <MainHeader 
      :links="[{name: 'all websites', to: '/ratio'}]"
      state="close"/>
    <a :href="'https://' + data[0].info.domain" target="_blank">{{ data[0].info.domain }}</a>
    <footer></footer>
  </div>

  <div class="right">

    <!-- CHART -->
    <div class="chart-container">

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

    </div>

    <!-- VALUES -->
    <div class="value-container">
      <div class="box-container">
        <div class="box">
          <h2 class="title time">total time spent</h2>
          <p class="value" v-if="periodSum.time != 0">{{formatMS(periodSum.time, true)}}</p>
          <p class="value" v-else>–</p>
          <p class="value">{{formatMS(allWebsitesSum.totalTime)}}</p>
          <p class="value" v-if="places.totalTime <= 100">{{places.totalTime}}</p>
          <p class="value" v-else>> 100</p>
        </div>
      </div>

      <div class="box-container">
        <div class="box">
          <h2 class="title time">Ø daily usage time</h2>
          <p class="value" v-if="periodSum.time != 0">{{formatMS(periodSum.time / this.getDayAmount(), true)}}</p>
          <p class="value" v-else>–</p>
          <p class="value">{{formatMS(allWebsitesSum.dailyUsageTime, true)}}</p>
          <p class="value" v-if="places.dailyTime <= 100">{{places.dailyTime}}</p>
          <p class="value" v-else>> 100</p>
        </div>
      </div>

      <div class="box-container">
        <div class="box">
          <h2 class="title time">Ø time per site view</h2>
          <p class="value" v-if="periodSum.time != 0 && periodSum.views != 0">{{formatMS(periodSum.time / periodSum.views, true)}}</p>
          <p class="value" v-else>–</p>
          <p class="value">{{formatMS(allWebsitesSum.timePerView, true)}}</p>
          <p class="value" v-if="places.timePerView <= 100">{{places.timePerView}}</p>
          <p class="value" v-else>> 100</p>
        </div>
      </div>

      <div class="box-container">
        <div class="box">
          <h2 class="title views">total site views</h2>
          <p class="value" v-if="periodSum.views != 0">{{periodSum.views}} views</p>
          <p class="value" v-else>–</p>
          <p class="value">{{allWebsitesSum.totalViews}} views</p>
          <p class="value" v-if="places.totalViews <= 100">{{places.totalViews}}</p>
          <p class="value" v-else>> 100</p>
        </div>
      </div>

      <div class="box-container">
        <div class="box">
          <h2 class="title clicks">Ø clicks per site view</h2>
          <p class="value" v-if="periodSum.clicks != 0">{{Math.round((periodSum.clicks/periodSum.views) * 100) / 100}} clicks</p>
          <p class="value" v-else>–</p>
          <p class="value">{{allWebsitesSum.clicksPerView.toFixed(2)}} clicks</p>
          <p class="value" v-if="places.clicksPerView <= 100">{{places.clicksPerView}}</p>
          <p class="value" v-else>> 100</p>
        </div>
      </div>

      <div class="box-container">
        <div class="box">
          <h2 class="title scroll">Ø scroll speed</h2>
          <p class="value" v-if="periodSum.scroll != 0">{{getScrollSpeed()}} px/sec</p>
          <p class="value" v-else>–</p>
          <p class="value">{{allWebsitesSum.scrollSpeed.toFixed(2)}} px/sec</p>
          <p class="value" v-if="places.scrollSpeed <= 100">{{places.scrollSpeed}}</p>
          <p class="value" v-else>> 100</p>
        </div>
      </div>

    </div>
  </div>

</div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';

import moment from 'moment';
import Chart from 'chart.js';
import formatMS from '../../functions/formatMS';
import MainHeader from '../../components/MainHeader.vue';
import getChartData from '../../functions/getChartData.js';
import mergeSameWebsitesInPeriod from '../../functions/mergeSameWebsitesInPeriod.js';

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
      overAllData: this.getOverAllData(),
      data: [],
      periodSum: {},
      activePeriod: 'month',
      activeMode: 'time',
      myChart: {},
      chartData: {},
      allWebsitesSum: {},
      places: {},
    };
  },

  created: function() {
    console.log(this.$router.currentRoute);
    this.domain = this.$route.params.domain;
    this.data = this.getDetailData();
    this.getPeriodSum();

    this.getChartDate();
    this.chartData = getChartData(this.data, this.activeMode, this.activePeriod, this.date);

    // this.getDotState();
    this.getTotalValues();
    this.getPlace();

    // send data to app.vue
    this.$emit('detailPageActive', true);
  },

  mounted() {
    this.createChart('usage-chart', this.chartData);
  },

  methods: {
    formatMS,

    getOverAllData: function() {
      let storageKeys = Object.keys(localStorage);
      let overAllData = [];
      for (let i = 0; i < storageKeys.length; i++) {
        let key = storageKeys[i];
        let websites;
        if (key !== 'limits') {
          websites = JSON.parse(localStorage.getItem(key));
          let object = {
            date: key,
            websites: websites,
          };
          overAllData.push(object);
        }
      }

      return overAllData;
    },

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

    getDayAmount: function() {
      let storageKeys = Object.keys(localStorage);
      // length -1 because of limits
      return storageKeys.length - 1;
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

    getTotalValues: function() {
      // combine all storage data days to websites and sum up the attributes
      let mergedData = mergeSameWebsitesInPeriod(this.overAllData);
      let allWebsitesSum = {};

      allWebsitesSum.totalTime = 0;
      allWebsitesSum.totalViews = 0;
      allWebsitesSum.totalClicks = 0;
      allWebsitesSum.totalScroll = 0;

      mergedData.forEach(element => {
        allWebsitesSum.totalTime += element.time;
        allWebsitesSum.totalViews += element.count;
        allWebsitesSum.totalClicks += element.clicks;
        allWebsitesSum.totalScroll += element.scroll;
      });

      allWebsitesSum.timePerView = allWebsitesSum.totalTime / allWebsitesSum.totalViews;
      allWebsitesSum.clicksPerView = allWebsitesSum.totalClicks / allWebsitesSum.totalViews;
      allWebsitesSum.scrollSpeed = allWebsitesSum.totalScroll / (allWebsitesSum.totalTime / 1000);
      allWebsitesSum.dailyUsageTime = allWebsitesSum.totalTime / this.getDayAmount() / mergedData.length;
      this.allWebsitesSum = allWebsitesSum;
    },

    getPlace: function() {
      let mergedData = mergeSameWebsitesInPeriod(this.overAllData);
      let places = {};

      // TOTAL TIME
      let placeTotalTime = 1;
      let sortedDataTime = cloneDeep(mergedData);
      sortedDataTime.sort((a, b) => parseFloat(b.time) - parseFloat(a.time));
      for (let i = 0; i < sortedDataTime.length; i++) {
        if (sortedDataTime[i].domain === this.data[0].info.domain || placeTotalTime > 100) {
          break;
        } else {
          placeTotalTime++;
        }
      }

      places.totalTime = placeTotalTime;

      // TOTAL SITE VIEWS
      let placeTotalViews = 1;
      let sortedDataViews = cloneDeep(mergedData);
      sortedDataViews.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));
      for (let i = 0; i < sortedDataViews.length; i++) {
        if (sortedDataViews[i].domain === this.data[0].info.domain) {
          break;
        } else {
          placeTotalViews++;
        }
      }

      places.totalViews = placeTotalViews;

      // RATIO CALCULATIONS
      let calculatedData = [];

      for (let i = 0; i < mergedData.length; i++) {
        let websiteData = {
          domain: mergedData[i].domain,
          timePerView: parseInt(mergedData[i].time / mergedData[i].count),
          clicksPerView: mergedData[i].clicks / mergedData[i].count,
          scrollSpeed: mergedData[i].scroll / mergedData[i].time,
          dailyTime: parseInt(mergedData[i].time / this.getDayAmount()),
          views: mergedData[i].count,
          time: mergedData[i].time,
        };
        calculatedData.push(websiteData);
      }

      // TIME PER VIEW
      let placeTimePerView = 1;
      let sortedDataTimePerView = cloneDeep(calculatedData);
      sortedDataTimePerView.sort((a, b) => parseFloat(b.timePerView) - parseFloat(a.timePerView));

      for (let i = 0; i < sortedDataTimePerView.length; i++) {
        if (sortedDataTimePerView[i].domain === this.data[0].info.domain) {
          break;
        } else {
          placeTimePerView++;
        }
      }
      places.timePerView = placeTimePerView;

      // CLICKS PER VIEW
      let placeClicksPerView = 1;
      let sortedDataClicksPerView = cloneDeep(calculatedData);
      sortedDataClicksPerView.sort((a, b) => parseFloat(b.clicksPerView) - parseFloat(a.clicksPerView));

      for (let i = 0; i < sortedDataClicksPerView.length; i++) {
        if (sortedDataClicksPerView[i].domain === this.data[0].info.domain) {
          break;
        } else {
          placeClicksPerView++;
        }
      }
      places.clicksPerView = placeClicksPerView;

      // DAILY USAGE TIME
      let placeDailyTime = 1;
      let sortedDataDailyTime = cloneDeep(calculatedData);
      sortedDataDailyTime.sort((a, b) => parseFloat(b.dailyTime) - parseFloat(a.dailyTime));

      for (let i = 0; i < sortedDataDailyTime.length; i++) {
        if (sortedDataDailyTime[i].domain === this.data[0].info.domain) {
          break;
        } else {
          placeDailyTime++;
        }
      }
      places.dailyTime = placeDailyTime;

      // DAILY USAGE TIME
      let placeScrollSpeed = 1;
      let sortedDataScrollSpeed = cloneDeep(calculatedData);
      sortedDataScrollSpeed.sort((a, b) => parseFloat(b.scrollSpeed) - parseFloat(a.scrollSpeed));

      for (let i = 0; i < sortedDataScrollSpeed.length; i++) {
        if (sortedDataScrollSpeed[i].domain === this.data[0].info.domain) {
          break;
        } else {
          placeScrollSpeed++;
        }
      }
      places.scrollSpeed = placeScrollSpeed;

      this.places = places;
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

  a {
    font-size: 32px;
    font-weight: 800;
    text-decoration: none;
    padding: 40px;
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

  .value-container {
    display: flex;
    flex-wrap: wrap;
    margin: 32px -12px 0px -12px;

    .box-container {
      width: 33.333333%;

      .box {
        box-sizing: border-box;
        background-color: $white;
        border: 3px solid $black;
        margin: 16px;

        .title {
          display: flex;
          position: relative;
          align-items: center;
          padding-left: 59px;
          padding-right: 24px;
          height: 40px;
          font-size: 12px;
          font-weight: 500;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 1px;
          border-bottom: 3px solid $black;
          margin: 0;

          &:before {
            content: '';
            left: 12px;
            top: 12px;
            position: absolute;
            display: inline-block;
            height: 16px;
            width: 16px;
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
          }

          &:after {
            content: '';
            position: absolute;
            left: 40px;
            height: 40px;
            width: 3px;
            background-color: $black;
          }
        }

        .value {
          font-size: 16px;
          font-weight: 800;
          margin: 24px 24px 16px 24px;
        }

        .bar-container {
          display: flex;
          margin-left: 24px;
          margin-bottom: 24px;

          .dot {
            height: 8px;
            width: 8px;
            background-color: $lightgrey;
            margin-right: 4px;

            &.active {
              background-color: $black;
            }
          }
        }
      }
    }
  }

  .chart-container {
    background-color: $white;
    border: 3px solid $black;
    padding: 32px;

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
  }
}
</style>
