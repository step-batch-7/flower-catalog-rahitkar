const disappear = function() {
  const gif = document.getElementById('gif');
  const seconds = 1000;
  gif.classList.add('hide');
  setTimeout(() => {
    gif.classList.remove('hide');
  }, seconds);
};
