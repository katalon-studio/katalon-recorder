import { Interface } from "./Interface.js";

const IPublisher = new Interface("IPublisher", ["addSubscriber", "removeSubscriber", "notify"]);

export { IPublisher };