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
    this.onResolve(result);
}

Promise.prototype.reject = function(result) {
  this.result = result;
  this.state = 'rejected';
  if (this.onReject)
    this.onReject(result);
}

Promise.prototype.then = function(onResolve, onReject) {
  if (this.state === 'resolved')
    onResolve(this.result);
  else if (this.state === 'rejected')
    onReject(this.result);
  else if (this.state === 'pending')
  {
    this.onResolve = onResolve;
    this.onReject = onReject;
  }
}

module.exports = function(worker) {
  return new Promise(worker);
}