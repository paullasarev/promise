function Promise(worker) {
  this._onResolve = null;
  this._onReject = null;
  this._onResolveNext = null;
  this._onRejectNext = null;
  this._result = null;
  this._state = this._statePending;

  this._doWork(worker);
}

Promise.prototype._doWork = function(worker) {
  if (!worker)
    return;
  try {
    worker(this._resolver.bind(this), this._rejecter.bind(this));
  } catch(err) {
    this._rejecter(err);
  }
}

function _isThenable(value) {
  var t = typeof value;
  if (value && (t === 'object' || t === 'function')) {
    var then = value.then;
    if (typeof then === 'function') {
      return true;
    }
  }
  return false;
}

Promise.prototype._statePending = "pending";
Promise.prototype._stateResolved = "resolved";
Promise.prototype._stateRejected = "rejected";

Promise.prototype._doOnResolve = function(result) {
  try {
    if (this._onResolve) {
      result = this._onResolve(result);
      if (_isThenable(result)) {
        result.then(this._onResolveNext, this._onRejectNext);
        return;
      }
    }
  } catch(err) {
    this._rejecter(err);
    return;
  }
  if (this._onResolveNext)
    this._onResolveNext(result);
}

Promise.prototype._doOnReject = function(result) {
  try {
    if (this._onReject)
      result = this._onReject(result);
  } catch(err) {
    result = err;
  }
  if (this._onRejectNext)
    this._onRejectNext(result);
}

Promise.prototype._resolver = function(result) {
  this._result = result;
  this._state = this._stateResolved;
  this._doOnResolve(result);
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
  var resolveVals = new Array(args.length);
  var resolvedCount = 0;

  function compositeResolve(ind, value) {
    resolveVals[ind] = value;
    resolvedCount++;
    if (resolvedCount === resolveVals.length && onResolve)
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
