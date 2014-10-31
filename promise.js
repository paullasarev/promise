function Promise(worker) {
  this.onResolve = undefined;

  this.resolve = function(result) {
    this.onResolve(result);
  }

  this.then = function(onResolve) {
    this.onResolve = onResolve;
  }

  worker(this.resolve.bind(this));
}


module.exports = function(worker) {
  return new Promise(worker);
}