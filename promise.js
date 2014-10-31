function Promise(worker) {
  this.result = undefined;

  this.resolve = function(result) {
    this.result = result;
  }

  this.then = function(onResolve) {
    onResolve(this.result);
  }

  worker(this.resolve.bind(this));
}


module.exports = function(worker) {
  return new Promise(worker);
}