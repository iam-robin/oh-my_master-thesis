<template>
<div class="container">
  <ul>
    <li v-for="limit in limits" :key="limit.domain"
    :style="{ 'order': limit.timeLimit}">
      <span class="domain">{{ limit.domain }}</span>
      <span class="line"></span>
      <span>{{ limit.timeLimit }} min</span>
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

      .domain {
        width: 100px;
      }

      .line {
        height: 1px;
        background-color: #e6e9ee;
        margin: 0 24px;
        flex-grow: 99;
      }
    }
  }
}
</style>
