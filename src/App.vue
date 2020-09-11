<template>
  <div
    id="app-canvas"
    class="flex flex-col bg-black h-screen w-screen text-blue-200 overflow-hidden"
  >
    <div
      class="absolute top-0 left-0 right-0 bottom-0 z-50 bg-opacity-50 duration-200 transition bg-black"
      v-if="open"
    />
    <aside
      v-if="hasNav"
      class="absolute w-2/3 top-0 left-0 bg-black bottom-0 z-50 transform shadow-xl transition duration-200 ease-in"
      :class="{ '-translate-x-full': !open }"
    >
      <button @click="open = !open">
        &times;
      </button>
    </aside>

    <header class="text-blue-200 flex flex-col">
      <div
        class="flex justify-between content-center items-center bg-blue-300 bg-opacity-25"
      >
        <button
          class="h-6 w-6 m-2 text-blue-300 hidden"
          @click="open = !open"
          v-if="hasNav"
        >
          <svg
            viewBox="0 0 32 32"
            class="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <path
              class="fill-current"
              d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"
            />
          </svg>
        </button>
        <h1 class="text-3xl font-bold flex-1 text-center ">
          <span>Hydr</span>
          <svg class="inline w-6 h-6 text-blue-400" viewBox="0 0 160 90">
            <use
              xlink:href="#icon-drop"
              class="fill-current"
              color="currentColor"
              transform="scale(25, 25) translate(0.5, -1)"
            />
          </svg>
          <span>p</span>
        </h1>
        <div class="h-8 w-8"></div>
      </div>
      <svg
        style="max-height: 2rem"
        class="flex-1 text-opacity-25 text-blue-300"
        viewBox="0 0 500 200"
        preserveAspectRatio="none"
      >
        <path
          class="fill-current"
          d="M 0 100 C 125 50 125 50 250 100 C 375 150 375 150 500 100 L 500 0 L 0 0 Z"
        />
      </svg>
    </header>
    <Canvas :ref="(r) => (canvas = r)" />
    <Footer @amount-selected="handleAmountSelcted" />
  </div>
</template>
<script lang="ts">
import Footer from "./components/Footer.vue";
import Canvas from "./components/Canvas.vue";
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { useStore } from "./store";

export default defineComponent({
  components: {
    Canvas,
    Footer,
  },
  setup() {
    const store = useStore();
    const hasNav = ref(true);
    const open = ref(false);
    const canvas = ref<typeof Canvas | null>(null);
    async function handleAmountSelcted(amount: number) {
      await store.insert(amount);
    }

    const updateVh = () => {
      const vh = window.innerHeight * 0.01;
      console.log('update vh ', vh)
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    onMounted(() => {
      updateVh();
      window.addEventListener("resize", updateVh);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", updateVh);
    });

    return {
      store,
      handleAmountSelcted,
      hasNav,
      open,
      canvas,
    };
  },
});
</script>
