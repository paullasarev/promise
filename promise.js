function Promise(worker) {
  this.onResolve = undefined;
  this.onReject = undefined;
  this.result = undefined;
  this.state = 'pending';

  worker(this.resolve.bind(this), this.reject.bind(this));
}

Promise.prototype.resolve = function(result) {
  this.result = result;
  this.state = 'resolved';
  if (this.onResolve)
    result = this.onResolve(result);
  if (this.onResolve2)
    this.onResolve2(result);
}

Promise.prototype.reject = function(result) {
  this.result = result;
  this.state = 'rejected';
  if (this.onReject)
    result = this.onReject(result);
  if (this.onReject2)
    this.onReject2(result);
}

Promise.prototype.then = function(onResolve, onReject) {
  var result;
  var self = this;
  var next = new Promise(function(resolve, reject){
    self.onResolve2 = resolve;
    self.onReject2 = reject;
  })

  if (this.state === 'resolved') {
    result = onResolve(this.result);
    if (this.onResolve2)
      this.onResolve2(result);
  }
  else if (this.state === 'rejected') {
    result = onReject(this.result);
    if (this.onReject2)
      this.onReject2(result);
  }
  else if (this.state === 'pending')
  {
    this.onResolve = onResolve;
    this.onReject = onReject;
  }

  return next;
}

module.exports = function(worker) {
  return new Promise(worker);
}