function Promise(worker) {
  this.onResolve = undefined;
  this.onReject = undefined;
  this.onResolve2 = undefined;
  this.onReject2 = undefined;
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

var CompositePromise = function() {
  var i, prom;
  var onResolve, onReject;
  var argCount = arguments.length;
  var resolveVals = new Array(argCount);
  var resolvedCount = 0;

  function compositeResolve(ind, value) {
    resolveVals[ind] = value;
    resolvedCount++;
    if (resolvedCount === argCount && onResolve)
      onResolve(resolveVals);
  }

  function compositeReject(err) {
    if (onReject)
      onReject(err);
  }

  var next = new Promise(function(resolve, reject){
    onResolve = resolve;
    onReject = reject;
  });

  for(i = 0; i < argCount ; ++i)
  {
    prom = arguments[i];
    prom.then(compositeResolve.bind(null, i), compositeReject);
  }

  return next;
}

module.exports = function(worker) {
  if (!worker)
  {
    return {
      all: CompositePromise,
    }
  }

  return new Promise(worker);
};
