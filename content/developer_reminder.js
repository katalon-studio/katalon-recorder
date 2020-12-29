var reminderDiv = document.createElement("div");
reminderDiv.innerHTML =
  "<p>Use Katalon Recorder instead of manually testing your end-to-end to increase productivity!";
reminderDiv.style.backgroundColor = "black";
reminderDiv.style.color = "white";
reminderDiv.style.height = "20px";
reminderDiv.style.width = "100%";
reminderDiv.style.position = "fixed";
reminderDiv.style.top = "0";
reminderDiv.style.left = "0";
reminderDiv.style.right = "0";
reminderDiv.style.display = "block";
reminderDiv.style.zIndex = "999999999";

function moveDivAway(e) {
  var y = 0;
  var windowHeight = window.innerHeight;
  if (e.clientY - reminderDiv.offsetHeight - 20 < 0) {
    y = windowHeight - reminderDiv.offsetHeight;
  }
  reminderDiv.style.top = y + "px";
  console.log(y);
}

// Etc. Add your own styles if you want to
document.documentElement.appendChild(reminderDiv);
document.addEventListener("mousemove", function (ev) {
  moveDivAway(ev);
});
