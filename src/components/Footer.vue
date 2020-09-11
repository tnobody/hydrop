<template>
  <footer
    class="px-4 pb-4 space-y-2 animated top-0 absolute w-screen bg-black"
    :class="{ overlay: overlay }"
  >
    <section class="space-y-2 h-32 visible-footer transform transition-transform duration-200 ease-out" :class="{'translate-y-full': !store.isToday.value}">
      <div class="flex justify-center">
        <button
          @click="overlay = !overlay"
          class="focus:outline-none transition-transform transform duration-300"
          :class="{ 'rotate-180': overlay }"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            class="chevron-up w-6 h-6"
          >
            <path
              fill-rule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div class="flex justify-center space-x-4 h-20">
        <DrinkButton
          v-for="(amount, i) in selectableValues"
          :key="i"
          @select="handleClick"
          :data-drop="i"
          :amount="amount"
          :disabled="overlay"
        />
      </div>
    </section>
    <section>
      <div class="grid grid-cols-4 gap-y-4 gap-x-4">
        <draggable-tile
          v-for="a in values"
          :key="a"
          :value="a"
          @dropped="handleDragEnd"
        >
          {{ a }}
        </draggable-tile>
      </div>
    </section>
  </footer>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import DrinkButton from "@/components/DrinkButton.vue";
import DraggableTile from "@/components/DraggableTile.vue";
import { useStore } from '@/store';
export default defineComponent({
  components: {
    DrinkButton,
    DraggableTile,
  },
  setup(_, { emit }) {
    const store = useStore()
    const overlay = ref(false);
    const values = ref(Array.from({ length: 12 }, (_, i) => (1 + i) / 10));

    const selectableValues = ref(
      JSON.parse(localStorage.getItem("preferences") ?? "null") ?? [
        0.2,
        0.3,
        0.5,
        0.7,
      ]
    );
    function handleDragEnd({
      srcValue,
      targetValue,
    }: {
      srcValue: number;
      targetValue: string;
    }) {
      selectableValues.value[Number(targetValue)] = srcValue;
      localStorage.setItem(
        "preferences",
        JSON.stringify(selectableValues.value)
      );
    }

    async function handleClick(amount: number) {
      if (overlay.value === false) emit("amount-selected", amount);
    }

    return {
      values,
      selectableValues,
      handleClick,
      overlay,
      handleDragEnd,
      store
    };
  },
});
</script>
<style scoped>
footer {
  will-change: transform;
  transform: translate(0, calc((var(--vh, 1vh) * 100) - 8rem));
  height: 66vh;
  transition: transform 0.3s ease-in;
}
footer.overlay {
  transform: translate(0, 33vh);
  box-shadow: 0px -250px 50px 50px rgba(0, 0, 0, 0.75);
}
</style>
