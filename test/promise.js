var assert = require('assert');
var promise = require('../promise');

describe('promise', function(){

  it('should instantiate promise', function(){
    var p = promise(function(resolve, reject){
      console.log('resolved');
      resolve();
    });

    assert.ok(p);
  });

  it('on then resolver should be called', function(){

  });
});