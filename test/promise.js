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

  it('then should be chained for async', function(done){
    var p = promise(function(resolve){
      setTimeout(function(){
        resolve(10);
      }, 10);
    });

    p.then(function(val){
      assert.equal(10, val);
      return 20;
    }).then(function(val){
      assert.equal(20, val);
      done();
    })
  });

  it('composite promise should work', function(done){
    var p1 = promise(function(resolve){
      resolve(10);
    });
    var p2 = promise(function(resolve){
      resolve(20);
    });

    promise().all(p1, p2).then(function(val){
      assert.equal(10, val[0]);
      assert.equal(20, val[1]);
      done();
    })
  });

  it('composite promise should work with timeouts', function(done){
    var p1 = promise(function(resolve){
      setTimeout(function(){
        resolve(10);
      }, 10);
    });
    var p2 = promise(function(resolve){
      setTimeout(function(){
        resolve(20);
      }, 15);
    });

    promise().all(p1, p2).then(function(val){
      assert.equal(10, val[0]);
      assert.equal(20, val[1]);
      done();
    })
  });

  it('composite promise should work with mixed promises', function(done){
    var p1 = promise(function(resolve){
      resolve(10);
    });
    var p2 = promise(function(resolve){
      setTimeout(function(){
        resolve(20);
      }, 15);
    });

    promise().all(p1, p2).then(function(val){
      assert.equal(10, val[0]);
      assert.equal(20, val[1]);
      done();
    })
  });

 it('composite promise should propagate error', function(done){
    var p1 = promise(function(resolve, reject){
      reject("err1");
    });
    var p2 = promise(function(resolve){
      resolve(20);
    });

    promise().all(p1, p2).then(function(val){
      assert.fail();
    }, function(err){
      assert.equal("err1", err);
      done();
    })
  });

  it('composite promise should propagate fail with timeouts', function(done){
    var p1 = promise(function(resolve){
      setTimeout(function(){
        resolve(10);
      }, 10);
    });
    var p2 = promise(function(resolve, reject){
      setTimeout(function(){
        reject("err1");
      }, 15);
    });

    promise().all(p1, p2).then(function(val){
      assert.fail();
    }, function(err){
      assert.equal("err1", err);
      done();
    })
  });

  it('catch reject should be on err', function(done){
    var p = promise(function(resolve, reject){
      reject("err");
    });

    p.catch(function(err){
      assert.equal("err", err);
      done();
    })
  });

  it('error should propagate through chain', function(done){
    var p = promise(function(resolve, reject){
      reject("err1");
    });

    p.then(function(val){
      assert.fail();
    }).then(function(val){
      assert.fail();
    }).catch(function(err){
      assert.equal("err1", err);
      done();
    })
  });

});