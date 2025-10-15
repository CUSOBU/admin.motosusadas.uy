<template>
  <div :class="`split-content ${hideAuxiliar ? 'split-content__single' : ''}`">
    <div v-if="!hideAuxiliar">
      <slot name="auxiliar"/>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  props: {
    hideAuxiliar: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const data = ref({});


    onMounted(() => { });

    return {
      data,
    };
  },
};
</script>

<style lang="scss" scoped>
.split-content {
  display: flex;
  min-height: 80vh;

  &:not(.split-content__single) {
    >div:first-child {
      flex: 0 0 330px;
      border-right: 1px solid #e6e6e6;
      padding-right: 24px;
      min-width: 250px;
      max-width: 380px;
      z-index: 2;
    }

    >div:nth-child(2) {
      padding-left: 24px;
      flex: 1;
      scroll-behavior: smooth;
      width: 100%;
      position: relative;
      z-index: 1;
    }
  }

  &.split-content__single {
    justify-content: center;

    >div {
      max-width: 400px;
    }
  }
}

@media screen and (max-width: 900px) {
  .split-content {
    &:not(.split-content__single) {
      flex-direction: column;

      >div:first-child {
        flex: none;
        width: 100%;
        border-right: none;
        padding-right: 0;
        max-width: 100%;
        min-width: 0;
        border-bottom: 1px solid #e6e6e6;
        padding-bottom: 20px;
        margin-bottom: 16px;
      }

      >div:nth-child(2) {
        flex: none;
        width: 100%;
        padding-left: 0;
        margin-top: 20px;
        overflow-x: auto;
      }
    }
  }
}
</style>
