function Promise(worker) {
  this._onResolve = undefined;
  this._onReject = undefined;
  this._onResolveNext = undefined;
  this._onRejectNext = undefined;
  this._result = undefined;
  this._state = 'pending';

  worker(this._resolver.bind(this), this._rejecter.bind(this));
}

Promise.prototype._doOnResolve = function(result) {
  if (this._onResolve)
    result = this._onResolve(result);
  if (this._onResolveNext)
    this._onResolveNext(result);
}

Promise.prototype._resolver = function(result) {
  this._result = result;
  this._state = 'resolved';
  this._doOnResolve(result);
}

Promise.prototype._doOnReject = function(result) {
  if (this._onReject)
    result = this._onReject(result);
  if (this._onRejectNext)
    this._onRejectNext(result);
}

Promise.prototype._rejecter = function(result) {
  this._result = result;
  this._state = 'rejected';
  this._doOnReject(result);
}

Promise.prototype.then = function(onResolve, onReject) {
  var result;
  var self = this;
  var next = new Promise(function(resolve, reject){
    self._onResolveNext = resolve;
    self._onRejectNext = reject;
  })

  this._onResolve = onResolve;
  this._onReject = onReject;

  if (this._state === 'resolved') {
    this._doOnResolve(this._result);
  }
  else if (this._state === 'rejected') {
    this._doOnReject(this._result);
  }

  return next;
}

Promise.prototype.catch = function(onReject) {
  return this.then(null, onReject);
}

Promise.all = function() {
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

module.exports = Promise;
