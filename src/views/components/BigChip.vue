<template>
  <div cols="12" sm="4" :class="`big-chip${action ? ' big-chip--action' : ''} big-chip--${type}`">
    <div>
      <v-img width="47px" :src="require(`@/assets/${type}-square.svg`)" />
    </div>
    <div>
      <span v-if="money">${{ number }}</span>
      <span v-else>{{ number ?? 0 }}</span>
      <span class="text-lowercase">
        {{ description }}
      </span>
    </div>
    <div v-if="action" class="big-chip-action">
      <span>{{ $t("view") }}</span>
      <v-img :src="'@/assets/arrow-right.svg'" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { RouteParamsRaw } from 'vue-router'

interface Action {
  name: string;
  params?: RouteParamsRaw;
}

export default defineComponent({
  props: {
    number: {
      type: Number,
      default: 0,
    },
    money: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "success",
    },
    action: {
      type: Object as () => Action | null,
      default: null,
    },
  },
  setup() {
  },
});
</script>

<style lang="scss" scoped>
.big-chip {
  display: flex;
  border-radius: 24px;
  padding: 32px;
  justify-content: space-between;
  border: 1px solid transparent;
  position: relative;
  opacity: 0.9;
  transition: all 1s ease;

  &.big-chip--action {
    cursor: pointer;
  }

  &.big-chip--action:hover {
    opacity: 1;
  }

  &.big-chip--success {
    color: #0ac229;
    background: linear-gradient(0deg,
        rgba(255, 255, 255, 0.88),
        rgba(255, 255, 255, 0.88)),
      #0ac229;

    &.big-chip--action:hover {
      border-color: #0ac229;
    }
  }

  &.big-chip--warning {
    color: #eacb00;
    background: linear-gradient(0deg,
        rgba(255, 255, 255, 0.88),
        rgba(255, 255, 255, 0.88)),
      #eacb00;

    &.big-chip--action:hover {
      border-color: #eacb00;
    }
  }

  &.big-chip--danger {
    color: #e63946;
    background: linear-gradient(0deg,
        rgba(255, 255, 255, 0.88),
        rgba(255, 255, 255, 0.88)),
      #e63946;

    &.big-chip--action:hover {
      border-color: #e63946;
    }
  }

  >div:nth-child(2) {
    width: calc(100% - 62px);

    span {
      width: 100%;
      display: block;

      &:first-child {
        font-weight: 700;
        font-size: 25px;
        line-height: 120%;
        color: #1a1a1a;
        margin-right: 15px;
        width: 47px;
      }

      &:nth-child(2) {
        margin-top: -5px;
      }
    }
  }

  .big-chip-action {
    display: flex;
    flex-direction: row;
    gap: 7px;
    position: absolute;
    right: 20px;
    bottom: 32px;
    color: #457b9d;
    text-transform: lowercase;
  }
}
</style>
