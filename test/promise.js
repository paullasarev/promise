var assert = require('assert');
var promise = require('../promise');

describe('promise', function(){

  it('should instantiate promise', function(){
    var p = promise(function(resolve, reject){
      resolve();
    });

    assert.ok(p);
  });

  it('on then resolver should be called', function(done){
    var p = promise(function(resolve, reject){
      resolve(10);
    });

    p.then(function(val){
      assert.equal(10, val);
      done();
    })

  });
});