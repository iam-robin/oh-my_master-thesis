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
        <div class="desc">
          <span class="index">0{{index+1}}</span>
          <div class="content">
            <span class="domain">{{website.domain}}</span>
            <div v-if="columnWidthLimitation <= website.grid_column_end - website.grid_column_start" class="value">
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
import formatMS from '../../functions/formatMS';

export default {
  name: 'ratio view',
  data: function() {
    return {
      columnWidthLimitation: 18,
      count: 5,
      rows: [],
      columns: [],
      xLeft: 100,
      yLeft: 100,
      aLeft: 1000,
      minRatio: 0.2,

      column: false,
      mayChangeDirection: true,

      content: [],
      colorTable: [
        { name: 'darkblue', hex: '#4E8BD9' },
        { name: 'blue', hex: '#609DE9' },
        { name: 'lightblue', hex: '#89BEFD' },
        { name: 'darkteal', hex: '#43AFD8' },
        { name: 'teal', hex: '#55C0E6' },
        { name: 'lightteal', hex: '#8DDBF7' },
        { name: 'darkpurple', hex: '#967ED9' },
        { name: 'purple', hex: '#AC94EA' },
        { name: 'lightpurple', hex: '#CFBDFC' },
        { name: 'darkpink', hex: '#D672AC' },
        { name: 'pink', hex: '#EA8ABF' },
        { name: 'lightpink', hex: '#FDA9DA' },
        { name: 'darkred', hex: '#D84756' },
        { name: 'red', hex: '#EB5767' },
        { name: 'lightred', hex: '#FD9BA5' },
        // { name: 'darkorange', hex: '#E75844' },
        // { name: 'orange', hex: '#F96F57' },
        { name: 'lightorange', hex: '#FDA695' },
        { name: 'darkyellow', hex: '#F5BA4F' },
        { name: 'yellow', hex: '#FECE60' },
        { name: 'lightyellow', hex: '#FEDE91' },
        { name: 'darkgreen', hex: '#EA8ABF' },
        { name: 'green', hex: '#A1D36E' },
        { name: 'lightgreen', hex: '#C2E699' },
        { name: 'darkmint', hex: '#3FBA9B' },
        { name: 'mint', hex: '#4FCEAE' },
        { name: 'lightmint', hex: '#99E7D2' },
        { name: 'darkcyan', hex: '#47BEC3' },
        { name: 'cyan', hex: '#54CBD1' },
        // { name: 'black', hex: '#2C3135' },
        { name: 'darkgrey', hex: '#434A54' },
        { name: 'grey', hex: '#CCD0D9' },
        // { name: 'lightgrey', hex: '#EDEFF3' },
        // { name: 'white', hex: '#FAFBFD' },
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
  },
};
</script>

<style lang="scss" scoped>
@import '../../scss/_colors.scss';

.container {
  height: 100vh;
  width: 100%;
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
