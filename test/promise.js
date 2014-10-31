var assert = require('assert');
var promise = require('../promise');

describe('promise', function(){

  it('should instantiate promise', function(){
    var p = promise(function(resolve){
      resolve();
    });

    assert.ok(p);
  });

  it('on then resolver should be called', function(done){
    var p = promise(function(resolve){
      resolve(10);
    });

    p.then(function(val){
      assert.equal(10, val);
      done();
    })
  });

  it('resolver should be called with async operation', function(done){
    var p = promise(function(resolve){
      setTimeout(function(){
        resolve(20);
      }, 10);
    });

    p.then(function(val){
      assert.equal(20, val);
      done();
    })
  });

  it('reject should be on err', function(done){
    var p = promise(function(resolve, reject){
      reject("err");
    });

    p.then(undefined, function(err){
      assert.equal("err", err);
      done();
    })
  });

  it('reject should be called with async err', function(done){
    var p = promise(function(resolve, reject){
      setTimeout(function(){
        reject("err");
      }, 10);
    });

    p.then(undefined, function(err){
      assert.equal("err", err);
      done();
    })
  });

  it('then should be chained', function(done){
    var p = promise(function(resolve){
      resolve(10);
    });

    p.then(function(val){
      assert.equal(10, val);
      return 20;
    }).then(function(val){
      assert.equal(20, val);
      done();
    })
  });
});