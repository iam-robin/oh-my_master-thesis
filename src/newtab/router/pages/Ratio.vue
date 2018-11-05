<template>
<div class="container">

  <div class="grid">
    <div class="gridItem" v-for="(website, index) in content" :key="website.domain"
    :style="{ 'background-color': website.dominant_color,
              'grid-column-start': website.grid_column_start,
              'grid-column-end': website.grid_column_end,
              'grid-row-start': website.grid_row_start,
              'grid-row-end': website.grid_row_end}">
      <router-link :to="{ name: 'detail', params: { domain: website.domain }}">
        <div class="desc" v-if="website.percent > descriptionLimit">
          <span class="index">0{{index+1}}</span>
          <div class="content">
            <span class="domain">{{website.domain}}</span>
            <div class="value">
              <span v-if="mode === 'time'">{{formatMS(website.time)}}</span>
              <span v-if="mode === 'views'">{{website.count}} views</span>
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
import RGBaster from 'rgbaster';

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
      colorTable: [
        { name: 'darkrose', hex: '#F53B57' },
        { name: 'rose', hex: '#EF5777' },
        { name: 'darkblue', hex: '#3D40C6' },
        { name: 'blue', hex: '#575FCF' },
        { name: 'darkaqua', hex: '#10BCF9' },
        { name: 'aqua', hex: '#4BD1FA' },
        { name: 'darkmint', hex: '#00D8D6' },
        { name: 'mint', hex: '#34E7E4' },
        { name: 'darkgras', hex: '#04C66B' },
        { name: 'gras', hex: '#0BE881' },
        { name: 'darkorange', hex: '#FFA800' },
        { name: 'orange', hex: '#FFC048' },
        { name: 'darkyellow', hex: '#FFD32A' },
        { name: 'yellow', hex: '#FFDD59' },
        { name: 'darkred', hex: '#FF3F34' },
        { name: 'red', hex: '#FF5E58' },
        { name: 'white', hex: '#F5F7FA' },
        { name: 'lightgrey', hex: '#E6E9ED' },
        { name: 'grey', hex: '#CCD1D9' },
        { name: 'mediumgrey', hex: '#AAB2BD' },
        { name: 'darkgrey', hex: '#656D78' },
        { name: 'darkergrey', hex: '#434A54' },
        { name: 'lightblack', hex: '#3C3B3D' },
        { name: 'black', hex: '#323133' },
      ],
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

      // get and sort the top websites (count and mode as parameter)
      let topWebsites = this.findTopWebsites(this.count, data, this.mode);
      topWebsites = this.getWebsitePercentage(topWebsites, this.mode);

      for (let i = 0; i < topWebsites.length; i++) {
        topWebsites[i] = this.calculateColumnsRows(topWebsites[i], i, topWebsites);
      }

      this.content = topWebsites;
      this.getDominantColor(this.content);
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

    getDominantColor: function(websites) {
      for (let i = 0; i < websites.length; i++) {
        let favicon = websites[i].favicon;

        if (!favicon === '' || favicon) {
          RGBaster.colors(favicon, {
            exclude: ['rgb(255,255,255)', 'rgb(0,0,0)'],
            success: function(payload) {
              let dominantColor = payload.dominant;

              dominantColor = dominantColor
                .substring(4, dominantColor.length - 1)
                .replace(/ /g, '')
                .split(',');

              let colorClassification = this.findClosestColor(dominantColor[0], dominantColor[1], dominantColor[2], this.colorTable);
              this.$set(websites[i], 'dominant_color', colorClassification.hex);
              // websites[i]['dominant_color'] = colorClassification.hex;
            }.bind(this),
          });
        } else {
          console.log('no icon');
        }
      }
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
    },

    findClosestColor: function(r, g, b, table) {
      var rgb = { r: r, g: g, b: b };
      var delta = 3 * 256 * 256;
      var temp = { r: 0, g: 0, b: 0 };
      var colorFound = '#000';

      for (let i = 0; i < table.length; i++) {
        temp = this.Hex2RGB(table[i].hex);
        if (Math.pow(temp.r - rgb.r, 2) + Math.pow(temp.g - rgb.g, 2) + Math.pow(temp.b - rgb.b, 2) < delta) {
          delta = Math.pow(temp.r - rgb.r, 2) + Math.pow(temp.g - rgb.g, 2) + Math.pow(temp.b - rgb.b, 2);
          colorFound = table[i];
        }
      }
      return colorFound;
    },

    // hex to rgb converter. Needed inside of the find-functions
    Hex2RGB: function(hex) {
      if (hex.lastIndexOf('#') > -1) {
        hex = hex.replace(/#/, '0x');
      } else {
        hex = '0x' + hex;
      }
      let r = hex >> 16;
      let g = (hex & 0x00ff00) >> 8;
      let b = hex & 0x0000ff;
      return { r: r, g: g, b: b };
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

.container {
  height: 100vh;
  width: 100%;
  // 40px 80px - margin of grid item
  padding: 32px 32px;
  box-sizing: border-box;
}

.grid {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(100, 1fr);
  grid-template-rows: repeat(100, 1fr);

  .gridItem {
    margin: 8px;
    border: 3px solid $black;
    cursor: pointer;

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
      padding: 10px 16px 10px 8px;
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
          font-weight: 700;
          margin-right: 16px;
        }

        .value {
          &:first-child {
            margin-right: 16px;
          }
        }
      }
    }
  }
}
</style>
