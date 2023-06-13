// import Emittery from "emittery";

const Emittery = require("emittery");

Emittery.isDebugEnabled = true;

const emitter = new Emittery({ debug: { name: "emitter_def" } });
export { emitter };
