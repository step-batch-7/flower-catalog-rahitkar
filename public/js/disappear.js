const disappear = function() {
  const gif = document.getElementById("gif");
  gif.classList.add("hide");
  setTimeout(() => {
    gif.classList.remove("hide");
  }, 1000);
}