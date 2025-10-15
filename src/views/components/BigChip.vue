<template>
  <div cols="12" sm="4" :class="`big-chip${action ? ' big-chip--action' : ''} big-chip--${type}`">
    <div class="big-chip-icon">
      <v-icon :color="getIconColor" size="40">{{ getIcon }}</v-icon>
    </div>
    <div>
      <span v-if="money">${{ number }}</span>
      <span v-else>{{ number ?? 0 }}</span>
      <span v-html="description">
      </span>
    </div>
    <div v-if="action" class="big-chip-action">
      <span>{{ $t("view") }}</span>
      <v-icon>mdi-arrow-right</v-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
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
  setup(props) {
    const getIcon = computed(() => {
      switch (props.type) {
        case 'primary':
          return 'mdi-chart-line';
        case 'info':
          return 'mdi-information';
        case 'success':
          return 'mdi-calendar';
        case 'warning':
          return 'mdi-map-marker';
        case 'danger':
          return 'mdi-alert-circle';
        default:
          return 'mdi-chart-box';
      }
    });

    const getIconColor = computed(() => {
      switch (props.type) {
        case 'primary':
          return '#1976d2';
        case 'info':
          return '#2196f3';
        case 'success':
          return '#0ac229';
        case 'warning':
          return '#eacb00';
        case 'danger':
          return '#e63946';
        default:
          return '#1976d2';
      }
    });

    return {
      getIcon,
      getIconColor,
    };
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

  &.big-chip--primary {
    color: #1976d2;
    background: linear-gradient(0deg,
        rgba(255, 255, 255, 0.88),
        rgba(255, 255, 255, 0.88)),
      #1976d2;

    &.big-chip--action:hover {
      border-color: #1976d2;
    }
  }

  &.big-chip--info {
    color: #2196f3;
    background: linear-gradient(0deg,
        rgba(255, 255, 255, 0.88),
        rgba(255, 255, 255, 0.88)),
      #2196f3;

    &.big-chip--action:hover {
      border-color: #2196f3;
    }
  }

  .big-chip-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 47px;
    height: 47px;
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
        strong {
          font-weight: 700;
          color: #1a1a1a;
        }
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
