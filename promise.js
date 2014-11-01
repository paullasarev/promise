function Promise(worker) {
  this._onResolve = null;
  this._onReject = null;
  this._onResolveNext = null;
  this._onRejectNext = null;
  this._result = null;
  this._state = this._statePending;

  if (worker) {
    try {
      worker(this._resolve.bind(this), this._reject.bind(this));
    } catch(err) {
      this._reject(err);
    }
  }
}

function _isThenable(value) {
  var t = typeof value;
  return value && (t === 'object' || t === 'function')
               && (typeof value.then === 'function');
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
    this._reject(err);
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

Promise.prototype._resolve = function(result) {
  this._result = result;
  this._state = this._stateResolved;
  this._doOnResolve(result);
}

Promise.prototype._reject = function(result) {
  this._result = result;
  this._state = this._stateRejected;
  this._doOnReject(result);
}

Promise.prototype.then = function(onResolve, onReject) {
  var result;
  var self = this;
  var next = new Promise(function(resolve, reject) {
    self._onResolveNext = resolve;
    self._onRejectNext = reject;
  })

  this._onResolve = onResolve;
  this._onReject = onReject;

  if (this._state === this._stateResolved)
    this._doOnResolve(this._result);
  else if (this._state === this._stateRejected)
    this._doOnReject(this._result);

  return next;
}

Promise.prototype.catch = function(onReject) {
  return this.then(null, onReject);
}

function _iterableArgs(args) {
  return Array.prototype.concat.apply([], Array.prototype.slice.call(args));
}

Promise.all = function() {
  var onResolve, onReject;
  var args = _iterableArgs(arguments);
  var resolveVals = new Array(args.length);
  var resolvedCount = 0;

  function allResolve(ind, value) {
    resolveVals[ind] = value;
    if (++resolvedCount === resolveVals.length)
      onResolve(resolveVals);
  }

  var next = new Promise(function(resolve, reject) {
    onResolve = resolve;
    onReject = reject;
  });

  for(var i = 0 ; i < args.length ; ++i)
    args[i].then(allResolve.bind(null, i), onReject);

  return next;
}

Promise.race = function() {
  var onResolve, onReject;
  var args = _iterableArgs(arguments);

  var next = new Promise(function(resolve, reject) {
    onResolve = resolve;
    onReject = reject;
  });

  for(var i = 0 ; i < args.length ; ++i)
    args[i].then(onResolve, onReject);

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
