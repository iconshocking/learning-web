import { formatDistanceToNow } from "date-fns";

const date = "1996-09-13 10:00:00";
const node = document.createElement("p");
node.textContent = `${new Date()} is ${formatDistanceToNow(new Date(date))} from ${new Date(date)}`;
node.style.backgroundColor = "lightblue";
document.body.appendChild(node);
