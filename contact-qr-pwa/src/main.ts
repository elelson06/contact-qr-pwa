import "./styles.css";
import { startApp } from "./app";

const root = document.getElementById("app");

if (!root) {
  throw new Error("No se encontró el elemento #app en index.html");
}

startApp(root);
