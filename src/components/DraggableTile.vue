<template>
  <div
    class="draggable-tile bg-blue-200 bg-opacity-25 p-4 transform transition-all duration-100 ease-out"
    :class="{ 'scale-110': pressed, pressed: pressed }"
    :style="translateStyle"
    ref="elRef"
    draggable="true"
    @touchstart.prevent="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, reactive } from "vue";
export default defineComponent({
  props: {
    value: {
      type: Number,
      default: () => 0,
    },
  },
  setup(props, { emit }) {
    const pressed = ref(false);
    const elRef = ref<HTMLDivElement | null>(null);
    const timeout = ref<number | null>(null);
    const touchData = ref<Touch[]>([]);
    const translate = reactive({ x: 0, y: 0 });
    const translateStyle = computed(() => ({
      "--transform-translate-x": (pressed.value ? translate.x : 0) + "px",
      "--transform-translate-y": (pressed.value ? translate.y : 0) + "px",
    }));

    const elementPosition = computed(() => {
      if (elRef.value) {
        const { x, y, width, height } = elRef.value.getBoundingClientRect();
        return { x: x + width / 2, y: y + height / 2 };
      } else {
        return { x: 0, y: 0 };
      }
    });

    function touchStart() {
      console.log(elRef.value);
      timeout.value = setTimeout(() => {
        pressed.value = true;
      }, 250);
    }

    function touchEnd(e: TouchEvent) {
      pressed.value = false;
      translate.x = 0;
      translate.y = 0;
      if (timeout.value) {
        clearTimeout(timeout.value);
      }
      const [touch] = e.changedTouches;
      const dropElement = document
        .elementFromPoint(touch.clientX, touch.clientY)
        ?.closest("[data-drop]");
      if (dropElement) {
        emit("dropped", {
          srcValue: props.value,
          targetValue: dropElement.getAttribute("data-drop"),
        });
      }
    }

    function touchMove(e: TouchEvent) {
      if (pressed.value === true && e.touches.length) {
        const [touch] = e.touches;
        touchData.value.push(touch);
        translate.x = touch.clientX - elementPosition.value.x;
        translate.y = touch.clientY - elementPosition.value.y;
      }
    }

    return {
      translateStyle,
      elRef,
      elementPosition,
      touchMove,
      touchEnd,
      touchStart,
      pressed,
    };
  },
});
</script>
<style scoped>
.pressed {
  --transform-rotate: calc(45deg / 6);
  pointer-events: none;
}
</style>
