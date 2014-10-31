function Promise(worker) {
  this.onResolve = undefined;
  this.onReject = undefined;
  this.result = undefined;
  this.state = 'pending';

  worker(this.resolve.bind(this), this.reject.bind(this));
}

Promise.prototype.doOnResolve = function(result) {
  if (this.onResolve)
    result = this.onResolve(result);
  if (this.onResolve2)
    this.onResolve2(result);
}

Promise.prototype.resolve = function(result) {
  this.result = result;
  this.state = 'resolved';
  this.doOnResolve(result);
}

Promise.prototype.doOnReject = function(result) {
  if (this.onReject)
    result = this.onReject(result);
  if (this.onReject2)
    this.onReject2(result);
}

Promise.prototype.reject = function(result) {
  this.result = result;
  this.state = 'rejected';
  this.doOnReject(result);
}

Promise.prototype.then = function(onResolve, onReject) {
  var result;
  var self = this;
  var next = new Promise(function(resolve, reject){
    self.onResolve2 = resolve;
    self.onReject2 = reject;
  })

  this.onResolve = onResolve;
  this.onReject = onReject;

  if (this.state === 'resolved') {
    this.doOnResolve(this.result);
  }
  else if (this.state === 'rejected') {
    this.doOnReject(this.result);
  }

  return next;
}

module.exports = function(worker) {
  return new Promise(worker);
}