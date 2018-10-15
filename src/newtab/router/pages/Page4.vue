<template>
<div class="container">
  <ul>
    <li v-for="limit in limits" :key="limit.domain"
    :style="{ 'order': limit.timeLimit}">
      <span>{{ limit.domain }}</span>
      <span class="line"></span>
      <span>{{ limit.timeLimit }}min</span>
      <span v-if="limit.percentageLimit <= 100" class="percentage">({{ round(limit.percentageLimit, 2) }}%)</span>
      <span v-else class="limit-reached">(100%)</span>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  name: 'test-route',
  data: function() {
    return {
      // array with key (dates) and values (websites)
      limits: [],
    };
  },
  created: function() {
    this.getLimits();
  },
  methods: {
    getLimits() {
      let limits = JSON.parse(localStorage.getItem('limits'));
      this.limits = limits;
      this.getLimitPercentage();
    },
    getLimitPercentage() {
      let today = this.getTodaysDate();
      let websites = JSON.parse(localStorage.getItem(today));

      for (let i = 0; i < websites.length; i++) {
        for (let x = 0; x < this.limits.length; x++) {
          if (websites[i].domain === this.limits[x].domain) {
            let usageTime = websites[i].time;
            let limitTime = this.limits[x].timeLimit * 60 * 1000;
            let limitPercentage = (100 / limitTime) * usageTime;
            this.limits[x]['percentageLimit'] = limitPercentage;
          }
        }
      }
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
    round: function(value, decimals) {
      return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin-top: 240px;

  ul {
    width: 40%;
    margin-bottom: 160px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    padding: 0;
    margin: 0 auto;

    li {
      flex: 0 0 100%;
      display: flex;
      font-size: 12px;
      padding: 8px 0;
      justify-content: space-between;
      align-items: center;

      .limit {
        text-align: right;
      }

      .line {
        height: 1px;
        background-color: #e6e9ee;
        margin: 0 24px;
        flex-grow: 99;
      }

      .percentage {
        margin-left: 8px;
      }

      .limit-reached {
        margin-left: 8px;
        color: #f53b57;
      }
    }
  }
}
</style>
