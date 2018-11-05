<template>
<div class="container">

  <div class="grid">
    <div class="gridItem" v-for="website in content" :key="website.domain"
    :style="{ 'grid-column-start': website.grid_column_start,
              'grid-column-end': website.grid_column_end,
              'grid-row-start': website.grid_row_start,
              'grid-row-end': website.grid_row_end}">
      <div class="desc" v-if="website.percent > descriptionLimit">
        {{website.domain}} <br>
        {{Math.round(website.percent * 1000) / 10}}%
        <p v-if="mode === 'time'">{{formatMS(website.time)}}</p>
        <p v-if="mode === 'views'">{{website.count}} views</p>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
export default {
  name: 'ratio view',
  data: function() {
    return {
      descriptionLimit: 0.04,
      count: 5,
      rows: [],
      columns: [],
      xLeft: 100,
      yLeft: 100,
      aLeft: 1000,
      minRatio: 0.1,

      column: false,
      mayChangeDirection: true,

      content: [],
    };
  },

  props: {
    mode: String,
    data: Array,
  },

  watch: {
    mode: function() {
      this.resetValues();
      this.getContent();
    },
    data: function() {
      this.resetValues();
      this.getContent();
    },
  },

  created: function() {
    this.getContent();
  },

  methods: {
    getContent: function() {
      let data = cloneDeep(this.data);
      // let content = [];
      console.log(data);
      console.log(this.mode);

      // get and sort the top websites (count and mode as parameter)
      let topWebsites = this.findTopWebsites(this.count, data, this.mode);
      topWebsites = this.getWebsitePercentage(topWebsites, this.mode);

      for (let i = 0; i < topWebsites.length; i++) {
        topWebsites[i] = this.calculateColumnsRows(topWebsites[i], i, topWebsites);
      }

      this.content = topWebsites;
    },

    findTopWebsites: function(websiteCount, websites, mode) {
      let sortedWebsites = websites;
      let topWebsites = [];

      if (mode === 'time') {
        // sort all Websites by time (highest first)
        sortedWebsites.sort(function(a, b) {
          if (a.time < b.time) {
            return 1;
          } else if (a.time === b.time) {
            return 0;
          } else {
            return -1;
          }
        });
      } else if (mode === 'views') {
        // sort all Websites by site views (highest first)
        sortedWebsites.sort(function(a, b) {
          if (a.count < b.count) {
            return 1;
          } else if (a.count === b.count) {
            return 0;
          } else {
            return -1;
          }
        });
      }

      // get nth (count) highest times and save them in new array
      for (let i = 0; i < sortedWebsites.length; i++) {
        if (i < websiteCount) {
          topWebsites.push(sortedWebsites[i]);
        } else {
          break;
        }
      }
      return topWebsites;
    },

    getWebsitePercentage: function(websites, mode) {
      let sum = 0;

      if (mode === 'time') {
        // calculate sum of the top Websites usage time
        for (let i = 0; i < websites.length; i++) {
          sum += websites[i].time;
        }
        // add the percentage of each top side to the object
        websites.forEach(function(website) {
          let time = website.time;
          let percentage = ((100 / sum) * time) / 100;
          let roundedPercentage = Math.round(percentage * 1000) / 1000;
          website['percent'] = roundedPercentage;
        });
      } else if (mode === 'views') {
        // calculate sum of the top Websites usage time
        for (let i = 0; i < websites.length; i++) {
          sum += websites[i].count;
        }
        // add the percentage of each top side to the object
        websites.forEach(function(website) {
          let count = website.count;
          let percentage = ((100 / sum) * count) / 100;
          let roundedPercentage = Math.round(percentage * 1000) / 1000;
          website['percent'] = roundedPercentage;
        });
      }

      return websites;
    },

    calculateColumnsRows: function(website, index) {
      const site = website;
      let aNeeded = 10000 * site.percent;
      if (this.column) {
        let xNeeded = Math.round(aNeeded / this.yLeft);
        let ratio = xNeeded / this.yLeft;
        if (this.mayChangeDirection && ratio < this.minRatio) {
          this.column = !this.column;
          this.mayChangeDirection = false;
          this.calculateColumnsRows(site, index);
        } else {
          this.xLeft = this.xLeft - xNeeded;
          if (this.columns.length === 0) {
            site.grid_column_start = 1;
          } else {
            site.grid_column_start = this.columns[this.columns.length - 1];
          }
          if (index === this.count - 1) {
            site.grid_column_end = 101;
          } else {
            site.grid_column_end = site.grid_column_start + xNeeded;
          }
          if (this.rows.length === 0) {
            site.grid_row_start = 1;
          } else {
            site.grid_row_start = this.rows[this.rows.length - 1];
          }
          site.grid_row_end = 101;
          this.columns.push(site.grid_column_end);
        }
      } else {
        let yNeeded = Math.round(aNeeded / this.xLeft);
        let ratio = yNeeded / this.xLeft;
        if (this.mayChangeDirection && ratio < this.minRatio) {
          this.column = !this.column;
          this.mayChangeDirection = false;
          this.calculateColumnsRows(site, index);
        } else {
          this.yLeft = this.yLeft - yNeeded;
          if (this.rows.length === 0) {
            site.grid_row_start = 1;
          } else {
            site.grid_row_start = this.rows[this.rows.length - 1];
          }
          if (index === this.count - 1) {
            site.grid_row_end = 101;
          } else {
            site.grid_row_end = site.grid_row_start + yNeeded;
          }
          if (this.columns.length === 0) {
            site.grid_column_start = 1;
          } else {
            site.grid_column_start = this.columns[this.columns.length - 1];
          }
          site.grid_column_end = 101;
          this.rows.push(site.grid_row_end);
        }
      }

      if (this.mayChangeDirection) {
        this.column = !this.column;
      }

      return site;
    },

    resetValues: function() {
      this.columns = [];
      this.rows = [];
      this.colum = false;
      this.xLeft = 100;
      this.yLeft = 100;
      this.aLeft = 1000;
    },

    formatMS: function(ms) {
      let minutes = parseInt((ms / (1000 * 60)) % 60);
      let hours = parseInt((ms / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;

      if (hours !== '00') {
        // hours, minutes and seconds
        return hours + 'h ' + minutes + 'min ';
      } else if (hours === '00' && minutes !== '00') {
        // minutes and seconds
        return minutes + 'min ';
      } else {
        // seconds
        return '< 01min ';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../scss/_colors.scss';

.grid {
  display: grid;
  width: 100%;
  height: 90vh;
  grid-template-columns: repeat(100, 1fr);
  grid-template-rows: repeat(100, 1fr);
  border: 1px solid $grey;

  .gridItem {
    border: 1px solid $grey;
    padding: 16px;
  }
}
</style>
