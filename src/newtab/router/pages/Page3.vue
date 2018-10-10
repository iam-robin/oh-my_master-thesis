<template>
<div class="container">
  <div id="grid" class="grid"></div>
</div>
</template>

<script>
export default {
  name: 'test-route',
  data: function() {
    return {
      websites: JSON.parse(localStorage.getItem('10/10/2018')),
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
  mounted: function() {
    this.websites = this.findTopWebsites(this.count, this.websites);
    this.websites = this.getTopWebsitePercentage(this.websites);

    this.websites.forEach((website, index) => {
      website = this.calculateColumnsRows(website, index);
    });

    this.websites.forEach(website => {
      let div = document.createElement('div');
      div.className = 'gridItem';
      document.getElementById('grid').appendChild(div);

      div.style.gridColumnStart = website.grid_column_start;
      div.style.gridColumnEnd = website.grid_column_end;
      div.style.gridRowStart = website.grid_row_start;
      div.style.gridRowEnd = website.grid_row_end;
      div.style.border = '1px solid black';
    });
  },

  methods: {
    findTopWebsites: function(count, allWebsites) {
      let sortedWebsites = allWebsites;
      let topWebsites = [];

      // sort all Websites by time count (highest first)
      sortedWebsites.sort(function(a, b) {
        if (a.time < b.time) {
          return 1;
        } else if (a.time == b.time) {
          return 0;
        } else {
          return -1;
        }
      });

      // get nth (count) highest times and save them in new array
      for (let i = 0; i < count; i++) {
        topWebsites.push(sortedWebsites[i]);
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
          if (index == this.websites.length - 1) {
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
          if (index == this.websites.length - 1) {
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
}
.grid {
  margin-top: 240px;
  display: grid;
  width: 60%;
  height: 600px;
  grid-template-columns: repeat(100, 1fr);
  grid-template-rows: repeat(100, 1fr);
  border: 1px solid black;
}
</style>
