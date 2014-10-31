function Promise(worker) {
  this.onResolve = undefined;
  this.result = undefined;
  this.state = 'pending';

  this.resolve = function(result) {
    this.result = result;
    this.state = 'resolved';
    if (this.onResolve)
      this.onResolve(result);
  }

  this.then = function(onResolve) {
    if (this.state === 'resolved')
      onResolve(this.result);
    else if (this.state === 'pending')
      this.onResolve = onResolve;
  }

  worker(this.resolve.bind(this));
}


module.exports = function(worker) {
  return new Promise(worker);
}