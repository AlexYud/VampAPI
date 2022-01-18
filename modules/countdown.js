module.exports = function countDown(io, sec) {
  return new Promise((resolve, reject) => {
    var seconds = sec
    io.emit("countdown update", seconds)
    seconds--
    var myInterval = setInterval(function () {
      var display = seconds;
      io.emit("countdown update", display)
      seconds--
      if (seconds < 0) {
        clearInterval(myInterval)
        resolve(true)
      }
    }, 1000);
  })
}