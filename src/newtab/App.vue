<template>
  <div>
    <div class="info-container">
      <header>
        <div class="menu">
          <router-link to="/page1">
            test
          </router-link>
          <router-link to="/list">
            01 Dauer
          </router-link>
          <router-link to="/ratio">
            02 Ratio
          </router-link>
          <router-link to="/limit">
            03 Limits
          </router-link>
        </div>
      </header>
      <main>
        <h2 class="date">{{date}}</h2>
        <h1 class="sum" v-if="activeMode === 'time'">{{formatMS(content[0].timeSum)}}</h1>
        <h1 class="sum" v-if="activeMode === 'views'">{{content[0].viewSum}} site views</h1>
      </main>
      <footer>
        <ul class="mode">
          <li v-on:click="setMode('time')" :class="{ active: getMode('time') }">time</li>
          <li v-on:click="setMode('views')" :class="{ active: getMode('views') }">views</li>
        </ul>
      </footer>
    </div>
    <div class="content-container">
      <router-view :mode="activeMode"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'test-route',
  data: function() {
    return {
      activeMode: 'time',
      date: null,
      content: [],
    };
  },
  created: function() {
    this.date = this.getTodaysDate();
    this.getContent();
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

    formatMS: function(ms) {
      let seconds = parseInt((ms / 1000) % 60);
      let minutes = parseInt((ms / (1000 * 60)) % 60);
      let hours = parseInt((ms / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      if (hours !== '00') {
        // hours, minutes and seconds
        return hours + 'h ' + minutes + 'min ' + seconds + 'sec ';
      } else if (hours === '00' && minutes !== '00') {
        // minutes and seconds
        return minutes + 'min ' + seconds + 'sec ';
      } else {
        // seconds
        return seconds + 'sec ';
      }
    },

    getContent: function() {
      let storageKeys = Object.keys(localStorage);
      let content = [];
      for (let i = 0; i < storageKeys.length; i++) {
        // for each key in storage build object with key(date) value(websites)
        // and push it to content array
        let key = storageKeys[i];
        if (key !== 'limits') {
          let websites = JSON.parse(localStorage.getItem(key));
          let timeSum = 0;
          let viewSum = 0;
          for (let i = 0; i < websites.length; i++) {
            timeSum += websites[i].time;
            viewSum += websites[i].count;
          }
          let object = {
            date: key,
            websites: websites,
            timeSum: timeSum,
            viewSum: viewSum,
          };
          content.unshift(object);
        }
      }
      this.content = content;
      console.log(this.content);
    },

    getMode: function(menuItem) {
      return this.activeMode === menuItem;
    },

    setMode: function(menuItem) {
      this.activeMode = menuItem;
    },
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Fira+Mono');
body {
  margin: 0;
  padding: 0;
  font-family: 'Fira Mono', monospace;
  font-size: 12px;

  .info-container {
    width: 40%;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #e5e5e5;
    height: 100vh;
    padding: 40px 80px;
    box-sizing: border-box;

    header {
      height: 40px;
      background-color: tomato;
    }

    footer {
      height: 40px;
      background-color: tomato;

      .mode {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          display: inline-block;
          padding: 8px 16px;
          cursor: pointer;

          &.active {
            font-weight: 800;
          }
        }
      }
    }
  }

  .content-container {
    display: inline-block;
    margin-left: 40%;
    width: 60%;
    background-color: #fece60;
    min-height: 100vh;
  }

  .menu {
    display: flex;
    justify-content: left;

    a {
      padding: 0 24px;
      text-decoration: none;
      color: black;

      &.router-link-active {
        font-weight: 800;
      }
    }
  }
}
</style>
