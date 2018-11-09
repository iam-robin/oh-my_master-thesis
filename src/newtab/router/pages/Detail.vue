<template>
<div class="component">
  <div class="left" :style="{ 'background-color': color}">
    {{domain}}
  </div>
  <div class="right">
    <router-link to="/ratio">all websites</router-link>
    <p>Domain: {{ domain }}</p>
    <p>Mode: {{mode}}</p>
    <p>Period: {{period}}</p>
    <p>Total usage time: {{formatMS(timeSum)}} </p>
    <p>Total site views: {{viewsSum}} </p>
    <p>Average usage time per site view: {{formatMS(timePerView, true)}} </p>
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
      color: '',
      data: [],
      timeSum: 0,
      viewsSum: 0,
      timePerView: 0,
    };
  },

  props: {
    mode: String,
    period: String,
  },

  watch: {
    period: function() {},
  },

  created: function() {
    this.domain = this.$route.params.domain;
    this.color = this.$route.params.color;
    this.data = this.getDetailData();
    this.calculateSum();
    this.getTimePerView();
    // send data to app.vue
    this.$emit('detailPageActive', true);
    console.log(this.domain);
    console.log(this.color);
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

      for (let i = 0; i < this.data.length; i++) {
        timeSum += this.data[i].info.time;
        viewsSum += this.data[i].info.count;
      }
      this.timeSum = timeSum;
      this.viewsSum = viewsSum;
    },

    getTimePerView: function() {
      this.timePerView = this.timeSum / this.viewsSum;
    },
  },
};
</script>

<style lang="scss" scoped>
.left {
  display: flex;
  position: fixed;
  width: 40%;
  height: 100vh;
  padding: 40px 80px;
  box-sizing: border-box;
}

.right {
  display: inline-block;
  margin-left: 40%;
  width: 60%;
  min-height: 100vh;
}
</style>
