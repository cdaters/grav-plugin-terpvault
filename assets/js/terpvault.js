(function () {
  function closestPlayer(element) {
    return element.closest('[data-terpvault-player]');
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-terpvault-fullscreen]');
    if (!button) return;

    var shell = closestPlayer(button);
    if (!shell) return;

    if (!document.fullscreenElement && shell.requestFullscreen) {
      shell.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  });
})();
