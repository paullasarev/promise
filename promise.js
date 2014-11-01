function Promise(worker) {
  this._onResolve = undefined;
  this._onReject = undefined;
  this._onResolveNext = undefined;
  this._onRejectNext = undefined;
  this._result = undefined;
  this._state = this._statePending;

  if (worker)
    worker(this._resolver.bind(this), this._rejecter.bind(this));
}

Promise.prototype._statePending = "pending";
Promise.prototype._stateResolved = "resolved";
Promise.prototype._stateRejected = "rejected";

Promise.prototype._doOnResolve = function(result) {
  if (this._onResolve)
    result = this._onResolve(result);
  if (this._onResolveNext)
    this._onResolveNext(result);
}

Promise.prototype._resolver = function(result) {
  this._result = result;
  this._state = this._stateResolved;
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
  this._state = this._stateRejected;
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

  if (this._state === this._stateResolved) {
    this._doOnResolve(this._result);
  }
  else if (this._state === this._stateRejected) {
    this._doOnReject(this._result);
  }

  return next;
}

Promise.prototype.catch = function(onReject) {
  return this.then(null, onReject);
}

function _iterableArgs(args)
{
  return Array.prototype.concat.apply([], Array.prototype.slice.call(args));
}

Promise.all = function() {
  var i, prom;
  var onResolve, onReject;
  var args = _iterableArgs(arguments);
  var argCount = args.length;
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

  for(i = 0; i < args.length ; ++i)
  {
    prom = args[i];
    prom.then(compositeResolve.bind(null, i), compositeReject);
  }

  return next;
}

Promise.resolve = function(val) {
  var p = new Promise();
  p._state = p._stateResolved;
  p._result = val;
  return p;
}

Promise.reject = function(val) {
  var p = new Promise();
  p._state = p._stateRejected;
  p._result = val;
  return p;
}

module.exports = Promise;
