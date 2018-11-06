<template>
<div class="container">
  <p>Domain: {{ $route.params.domain }}</p>
  <p>Mode: {{mode}}</p>
</div>
</template>

<script>
export default {
  name: 'detail page',

  data: function() {
    return {};
  },

  props: {
    mode: String,
  },

  created: function() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.container {
  padding: 40px;
}
</style>
