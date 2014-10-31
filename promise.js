function Promise(resolver) {

}
Promise.prototype.then = function(cb) {
  cb();
}

module.exports = function(resolver) {
  return new Promise(resolver);
}