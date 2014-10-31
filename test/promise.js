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
});