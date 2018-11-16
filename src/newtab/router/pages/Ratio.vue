<template>

  <div class="container">

    <div class="grid">
      <div class="gridItem" v-for="(website, index) in content" :key="website.domain"
      :style="{ 'background-color': website.dominant_color.hex,
                'grid-column-start': website.grid_column_start,
                'grid-column-end': website.grid_column_end,
                'grid-row-start': website.grid_row_start,
                'grid-row-end': website.grid_row_end}">
        <router-link :to="{ name: 'detail', params: { domain: website.domain}}">
          <div class="desc">
            <span class="index">0{{index+1}}</span>
            <div class="content">
              <span class="domain">{{website.domain}}</span>
              <div v-if="columnWidthLimitation <= website.grid_column_end - website.grid_column_start" class="value">
                <span v-if="mode === 'time'">{{formatMS(website.time)}}</span>
                <span v-if="mode === 'views'">{{website.count}} views</span>
                <span v-if="mode === 'clicks'">{{website.clicks}} clicks</span>
                <span v-if="mode === 'scroll'">{{website.scroll}} px</span>
                <span>| {{Math.round(website.percent * 1000) / 10}}%</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>

</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import formatMS from '../../functions/formatMS';

export default {
  name: 'ratio-view',
  data: function() {
    return {
      columnWidthLimitation: 18,
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
    // send data to app.vue
    this.$emit('detailPageActive', false);
  },

  methods: {
    formatMS,

    getContent: function() {
      let data = cloneDeep(this.data);

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
      } else if (mode === 'clicks') {
        // sort all Websites by clicks (highest first)
        sortedWebsites.sort(function(a, b) {
          if (a.clicks < b.clicks) {
            return 1;
          } else if (a.clicks === b.clicks) {
            return 0;
          } else {
            return -1;
          }
        });
      } else if (mode === 'scroll') {
        // sort all Websites by scroll (highest first)
        sortedWebsites.sort(function(a, b) {
          if (a.scroll < b.scroll) {
            return 1;
          } else if (a.scroll === b.scroll) {
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
          // merge ms time into minutes
          let time = parseInt(websites[i].time / (1000 * 60));
          // if 0 minutes -> 0.5
          if (time === 0) {
            time = 0.5;
          }
          sum += time;
        }
        // add the percentage of each top side to the object
        websites.forEach(function(website) {
          // merge ms time into minutes
          let time = parseInt(website.time / (1000 * 60));

          // if 0 minutes -> 0.5
          if (time === 0) {
            time = 0.5;
          }

          let percentage = ((100 / sum) * time) / 100;
          let roundedPercentage = Math.round(percentage * 1000) / 1000;
          website['percent'] = roundedPercentage;
          console.log(website);
        });
      } else if (mode === 'views') {
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
      } else if (mode === 'clicks') {
        for (let i = 0; i < websites.length; i++) {
          sum += websites[i].clicks;
        }
        // add the percentage of each top side to the object
        websites.forEach(function(website) {
          let clicks = website.clicks;
          let percentage = ((100 / sum) * clicks) / 100;
          let roundedPercentage = Math.round(percentage * 1000) / 1000;
          website['percent'] = roundedPercentage;
        });
      } else if (mode === 'scroll') {
        for (let i = 0; i < websites.length; i++) {
          sum += websites[i].scroll;
        }
        // add the percentage of each top side to the object
        websites.forEach(function(website) {
          let scroll = website.scroll;
          let percentage = ((100 / sum) * scroll) / 100;
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
      this.column = false;
      this.xLeft = 100;
      this.yLeft = 100;
      this.aLeft = 1000;
      this.mayChangeDirection = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../scss/_colors.scss';

.container {
  height: 100vh;
  // 40px 80px - margin of grid item
  padding: 28px 68px;
  box-sizing: border-box;
}

.grid {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(100, 1fr);
  grid-template-rows: repeat(100, 1fr);

  .gridItem {
    margin: 12px;
    border: 3px solid $black;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    overflow: hidden;

    a {
      height: 100%;
      width: 100%;
      display: block;
      color: $black;
      text-decoration: none;
    }

    .desc {
      position: relative;
      background-color: $white;
      color: $black;
      padding: 10px 16px 6px 8px;
      border-bottom: 3px solid $black;
      overflow: hidden;

      .index {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 32px;
        top: 0;
        left: 0;
        font-weight: 700;

        &:after {
          content: '';
          display: inline-block;
          position: absolute;
          right: -2px;
          top: 0;
          height: 100%;
          width: 3px;
          background-color: $black;
        }
      }

      .content {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-left: 40px;

        .domain {
          margin-right: 16px;
          padding-bottom: 4px;
        }

        .value {
          padding-bottom: 4px;
          &:first-child {
            margin-right: 16px;
          }
        }
      }

      // white element to crop overflowed content
      &:after {
        content: '';
        position: absolute;
        display: inline-block;
        height: 100%;
        width: 16px;
        background-color: $white;
        right: 0;
        top: 0;
      }
    }
  }
}
</style>
