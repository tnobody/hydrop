import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { createStore, StoreSymbol } from "./store";
import { DbSymbol, createDb } from "@/db";
import "./index.css";

createApp(App)
  .use(router)
  .provide(DbSymbol, createDb())
  .provide(StoreSymbol, createStore(createDb()))
  .mount("#app");
