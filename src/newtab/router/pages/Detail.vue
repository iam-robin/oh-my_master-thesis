<template>
<div class="component">

  <div class="left" :style="{ 'background-color': data[0].info.dominant_color.hex}">
    <header>
      header
    </header>

    <main>
      <h1>{{domain}}</h1>
    </main>

    <footer>
      footer
    </footer>

  </div>

  <div class="right">

    <header>
      <div class="website">
        <span v-if="data[0].info.favicon != '' && data[0].info.favicon" :style="{ backgroundImage: 'url(' + data[0].info.favicon + ')' }" class="favicon"></span>
        <span v-else class="placeholder"></span>
        <span>{{domain}}</span>
      </div>
      <router-link class="back" to="/ratio">
        <span>all websites</span>
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M13.3334 8H2.66669" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6.66669 12L2.66669 8L6.66669 4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </router-link>
    </header>

    <main>
      <div class="stat-overview">
        <div class="box">
          <p>time spent</p>
          <h2>{{formatMS(timeSum)}}</h2>
        </div>
        <div class="box">
          <p>site views</p>
          <h2>{{viewsSum}} views</h2>
        </div>
        <div class="box">
          <p>Ø time per site view</p>
          <h2>{{formatMS(this.timeSum / this.viewsSum, true)}}</h2>
        </div>
        <div class="box">
          <p>Ø internal site views</p>
          <h2>{{Math.round((innerViewsSum/viewsSum) * 100) / 100}} views</h2>
        </div>
        <div class="box">
          <p>total clicks</p>
          <h2>{{clickSum}} clicks</h2>
        </div>
        <div class="box">
          <p>Ø clicks per site view</p>
          <h2>{{Math.round((clickSum/viewsSum) * 100) / 100}} clicks</h2>
        </div>
        <div class="box">
          <p>total scroll distance</p>
          <h2>{{scrollSum}} px</h2>
        </div>
        <div class="box">
          <p>Ø scroll distance per site view</p>
          <h2>{{parseInt(Math.round((scrollSum/viewsSum) * 100) / 100)}} px</h2>
        </div>
        <div class="box">
          <p>Ø scroll speed</p>
          <h2>{{getScrollSpeed()}} px/sec</h2>
        </div>
      </div>
    </main>

  </div>

</div>
</template>

<script>
import formatMS from '../../functions/formatMS';

export default {
  name: 'detail-page',

  data: function() {
    return {
      domain: '',
      data: [],
      timeSum: 0,
      viewsSum: 0,
      innerViewsSum: 0,
      clickSum: 0,
      scrollSum: 0,
    };
  },

  watch: {
    period: function() {},
  },

  created: function() {
    this.domain = this.$route.params.domain;
    this.data = this.getDetailData();
    this.calculateSum();

    // send data to app.vue
    this.$emit('detailPageActive', true);
    console.log(this.data);
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

    calculateSum: function() {
      let timeSum = 0;
      let viewsSum = 0;
      let innerViewsSum = 0;
      let clickSum = 0;
      let scrollSum = 0;

      for (let i = 0; i < this.data.length; i++) {
        timeSum += this.data[i].info.time;
        viewsSum += this.data[i].info.count;
        innerViewsSum += this.data[i].info.innerCount;
        clickSum += this.data[i].info.clicks;
        scrollSum += this.data[i].info.scroll;
      }
      this.timeSum = timeSum;
      this.viewsSum = viewsSum;
      this.innerViewsSum = innerViewsSum;
      this.clickSum = clickSum;
      this.scrollSum = scrollSum;
    },

    getScrollSpeed: function() {
      let scroll = this.scrollSum;
      let timeInSec = parseInt(this.timeSum / 1000);
      let speed = scroll / timeInSec;
      speed = Math.round(speed * 100) / 100;

      return speed;
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
  padding: 40px 80px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  header {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  main {
    h1 {
      font-size: 32px;
      color: $white;
    }
  }

  footer {
    width: 100%;
  }
}

.right {
  display: inline-block;
  margin-left: 40%;
  width: 60%;
  min-height: 100vh;
  padding: 40px 80px;
  box-sizing: border-box;
  background-color: $white;

  header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 96px;
    padding-bottom: 24px;
    border-bottom: 1px solid $grey;

    .website {
      display: flex;
      align-items: center;

      .favicon {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 16px;
        background-size: 16px 16px;
        background-position: center;
        background-repeat: no-repeat;
      }

      .placeholder {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 16px;
        border-radius: 100%;
        background-color: $grey;
      }
    }

    .back {
      display: flex;
      align-content: center;

      color: $black;
      text-decoration: none;
      font-family: 'Montserrat', sans-serif;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 2px;

      svg {
        margin-left: 8px;
        width: 16px;
        height: 16px;
        transform: rotate(180deg);
      }
    }
  }

  main {
    .stat-overview {
      display: flex;
      flex-wrap: wrap;

      .box {
        width: 33%;
        display: inline-block;
        margin: 0 0 40px 0;

        p {
          color: $grey;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 1px;
          margin: 8px 0 8px 0;
          font-size: 12px;
          width: 60%;
        }

        h2 {
          font-size: 16px;
          font-weight: 800;
          margin: 0;
        }
      }
    }
  }
}
</style>
