<template>
<div class="container">

  <!-- time grid -->
  <div v-if="mode === 'time'">
    <div class="grid-container" v-for="item in timeContent" :key="item.date">
      <h1>{{item.date}}</h1>
      <div class="grid">
        <div class="gridItem" v-for="website in item.websites" :key="website.domain"
        :style="{ 'grid-column-start': website.grid_column_start,
                  'grid-column-end': website.grid_column_end,
                  'grid-row-start': website.grid_row_start,
                  'grid-row-end': website.grid_row_end}">
          <div class="desc" v-if="website.percent > descriptionLimit">
            {{website.domain}} <br>
            {{Math.round(website.percent * 1000) / 10}}%
            {{website.time}}  
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- view grid -->
  <div v-if="mode === 'views'">
    <div class="grid-container" v-for="item in viewsContent" :key="item.date">
      <h1>{{item.date}}</h1>
      <div class="grid">
        <div class="gridItem" v-for="website in item.websites" :key="website.domain"
        :style="{ 'grid-column-start': website.grid_column_start,
                  'grid-column-end': website.grid_column_end,
                  'grid-row-start': website.grid_row_start,
                  'grid-row-end': website.grid_row_end}">
          <div class="desc" v-if="website.percent > descriptionLimit">
            {{website.domain}} <br>
            {{Math.round(website.percent * 1000) / 10}}%
            {{website.count}}  
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
export default {
  name: 'test-route',
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

      // array with key (dates) and values (websites) for time ratio
      timeContent: [],
      // array with key (dates) and values (websites) for site views ratio
      viewsContent: [],
    };
  },

  props: {
    mode: String,
    data: Array,
  },

  created: function() {
    this.getTimeContent();
    this.getViewsContent();
  },

  methods: {
    getTimeContent: function() {
      let timeData = cloneDeep(this.data);
      let timeContent = [];

      for (let i = 0; i < timeData.length; i++) {
        let websites = timeData[i].websites;
        let date = timeData[i].date;

        // top usage time websites
        let topTimeWebsites = this.findTopWebsites(this.count, websites, 'time');
        topTimeWebsites = this.getWebsitePercentage(topTimeWebsites, 'time');

        for (let i = 0; i < topTimeWebsites.length; i++) {
          topTimeWebsites[i] = this.calculateColumnsRows(topTimeWebsites[i], i, topTimeWebsites);
        }

        let object = {
          date: date,
          websites: topTimeWebsites,
        };

        timeContent.push(object);

        // reset values
        this.resetValues();
      }
      this.timeContent = timeContent;
    },

    getViewsContent: function() {
      let viewsData = cloneDeep(this.data);

      let viewsContent = [];

      for (let i = 0; i < viewsData.length; i++) {
        let websites = viewsData[i].websites;
        let date = viewsData[i].date;

        // top site views websites
        let topViewsWebsites = this.findTopWebsites(this.count, websites, 'views');
        topViewsWebsites = this.getWebsitePercentage(topViewsWebsites, 'views');

        for (let i = 0; i < topViewsWebsites.length; i++) {
          topViewsWebsites[i] = this.calculateColumnsRows(topViewsWebsites[i], i, topViewsWebsites);
        }

        let object = {
          date: date,
          websites: topViewsWebsites,
        };

        viewsContent.push(object);

        // reset values
        this.resetValues();
      }
      this.viewsContent = viewsContent;
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

      console.log(sortedWebsites);

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

    getTodaysDate: function() {
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1;
      let yyyy = today.getFullYear();

      if (dd < 10) {
        dd = '0' + dd;
      }

      if (mm < 10) {
        mm = '0' + mm;
      }

      today = dd + '/' + mm + '/' + yyyy;
      return today;
    },
  },
};
</script>

<style lang="scss" scoped>
.grid-container {
  margin: 80px;

  h1 {
    flex: 0 0 100%;
    font-size: 16px;
    margin-bottom: 16px;
  }

  .grid {
    display: grid;
    height: 80vh;
    grid-template-columns: repeat(100, 1fr);
    grid-template-rows: repeat(100, 1fr);
    border: 1px solid #fff;

    .gridItem {
      border: 1px solid #fff;
      padding: 16px;
    }
  }
}
</style>
