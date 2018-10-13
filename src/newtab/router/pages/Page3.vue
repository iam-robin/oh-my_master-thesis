<template>
<div class="container">
  <div id="grid-container" class="grid-container" v-for="item in content" :key="item.date">
    <h1>{{item.date}}</h1>
    <div class="grid">
      <div class="gridItem" v-for="website in item.websites" :key="website.domain"
      :style="{ 'grid-column-start': website.grid_column_start,
                'grid-column-end': website.grid_column_end,
                'grid-row-start': website.grid_row_start,
                'grid-row-end': website.grid_row_end}">
      <div class="desc" v-if="website.percent > descriptionLimit">
        {{website.domain}} <br> {{Math.round(website.percent * 1000) / 10}}%  
      </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'test-route',
  data: function() {
    return {
      descriptionLimit: 0.04,
      websites: [],
      count: 5,
      rows: [],
      columns: [],
      xLeft: 100,
      yLeft: 100,
      aLeft: 1000,
      minRatio: 0.1,

      column: false,
      mayChangeDirection: true,

      // array with key (dates) and values (websites)
      content: [],
    };
  },
  created: function() {
    let storageKeys = Object.keys(localStorage);
    let content = [];

    for (let i = 0; i < storageKeys.length; i++) {
      let key = storageKeys[i];
      let websites = JSON.parse(localStorage.getItem(key));

      websites = this.findTopWebsites(this.count, websites);
      websites = this.getTopWebsitePercentage(websites);

      this.websites = websites;

      for (let i = 0; i < websites.length; i++) {
        // error in function (parameter checken)
        websites[i] = this.calculateColumnsRows(websites[i], i);
      }
      let object = {
        date: key,
        websites: websites,
      };
      content.unshift(object);

      // reset values
      this.columns = [];
      this.rows = [];
      this.colum = false;
      this.xLeft = 100;
      this.yLeft = 100;
      this.aLeft = 1000;
    }
    console.log(content);
    this.content = content;
  },

  methods: {
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

    findTopWebsites: function(count, allWebsites) {
      let sortedWebsites = allWebsites;
      let topWebsites = [];

      // sort all Websites by time count (highest first)
      sortedWebsites.sort(function(a, b) {
        if (a.time < b.time) {
          return 1;
        } else if (a.time === b.time) {
          return 0;
        } else {
          return -1;
        }
      });

      // get nth (count) highest times and save them in new array
      for (let i = 0; i < sortedWebsites.length; i++) {
        if (i < count) {
          topWebsites.push(sortedWebsites[i]);
        } else {
          break;
        }
      }
      return topWebsites;
    },

    getTopWebsitePercentage: function(topWebsites) {
      let timeSum = 0;

      // calculate sum of the top Websites usage time
      for (let i = 0; i < topWebsites.length; i++) {
        timeSum += topWebsites[i].time;
      }

      // add the percentage of each top side to the object
      topWebsites.forEach(function(topWebsite) {
        let time = topWebsite.time;
        let percentage = ((100 / timeSum) * time) / 100;
        let roundedPercentage = Math.round(percentage * 1000) / 1000;
        topWebsite['percent'] = roundedPercentage;
      });

      return topWebsites;
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
          if (index === this.websites.length - 1) {
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
          if (index === this.websites.length - 1) {
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
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 240px;
}

.grid-container {
  display: flex;
  flex-wrap: wrap;
  width: 60%;
  justify-content: center;
  margin-bottom: 160px;

  h1 {
    flex: 0 0 100%;
    font-size: 16px;
    margin-bottom: 16px;
  }
}

.grid {
  display: grid;
  width: 100%;
  height: 500px;
  grid-template-columns: repeat(100, 1fr);
  grid-template-rows: repeat(100, 1fr);
  border: 1px solid #e6e9ee;

  .gridItem {
    border: 1px solid #e6e9ee;
    padding: 16px;
  }
}
</style>
