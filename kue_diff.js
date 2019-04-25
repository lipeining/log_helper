
const _ = require('lodash');

var kue     = require( 'kue' )
  , express = require( 'express' );
  var doddiff = require("deep-object-diff").diff;
  var dddiff = require('deep-diff').diff;
// create our job queue

var queue = kue.createQueue({
  prefix: 'q',
  redis: {
    port: 6379,
    host: '127.0.0.1',
    auth: 'password',
    db: 4, // if provided select a non-default redis db
    options: {
      // see https://github.com/mranney/node_redis#rediscreateclient
    }
  }
});

function generateDiffObject() {
    const before = {};
    const after = {};
    // 保证三个属性，一增，一删，一编辑
    // 编辑递归一个数组，增删减，
    // 编辑递归一个对象，增删减，
    let key;
    key = _.uniqueId('add');
    after[key] = key;
    key = _.uniqueId('del');
    before[key] = key;
    key = _.uniqueId('edit');
    before[key] = [Math.floor(Math.random()* 10),Math.floor(Math.random()* 10),Math.floor(Math.random()* 10)];
    after[key] = before[key].map((item)=>{return item*item;});
    key = _.uniqueId('edit');
    before[key] = {add: Math.floor(Math.random()* 10), edit: Math.floor(Math.random()* 10), del: Math.floor(Math.random()* 10)};
    after[key] = {};
    _.map(before[key],(v, k)=>{ after[key][k] = v * v; return;});
    return {before, after};
}



// start redis with $ redis-server

// create some jobs at random,
// usually you would create these
// in your http processes upon
// user input etc.

function create() {
//   var name = [ 'tobi', 'loki', 'jane', 'manny' ][ Math.random() * 4 | 0 ];
//   console.log( '- creating job for %s', name );
//   jobs.create( 'video conversion', {
//     title: 'converting ' + name + '\'s to avi', user: 1, frames: 200
//   } ).save();
//   setTimeout( create, Math.random() * 3000 | 0 );
    for(let i=0;i<5;i++) {
        const {before, after} = generateDiffObject();
        dodjobs.push(queue.create('doddiff', { before, after }).removeOnComplete( true ).save());
        ddjobs.push(queue.create('dddiff', { before, after }).removeOnComplete( true ).save());
    }
}
var dodjobs = [];
var ddjobs = [];
// create();
setInterval(create, 2000);

// process video conversion jobs, 3 at a time.

queue.process( 'doddiff', 3, function ( job, done ) {
  const {before, after} = job.data;
  console.log( "job process deep-object-diff %d", job.id );
  console.log(before);
  console.log(after);
  console.log(JSON.stringify(doddiff(before, after)));
  setTimeout(done, 700);
} );

queue.process( 'dddiff', 3, function ( job, done ) {
  const {before, after} = job.data;
  console.log( "job process deep-diff %d", job.id );
  console.log(before);
  console.log(after);
  console.log(JSON.stringify(dddiff(before, after)));
  setTimeout(done, 700);
} );

queue.on( 'error', function( err ) {
    console.log( 'Oops... ', err );
  });
  queue.inactive( function( err, ids ) { // others are active, complete, failed, delayed
    // you may want to fetch each id to get the Job object out of it...
    ids.forEach( function( id ) {
        console.log(`remove inactive ${id}`);
        kue.Job.get( id, function( err, job ) {
          // Your application should check if job is a stuck one
          job.remove();
        });
      });
  });
// start the UI
var app = express();
app.use( kue.app );
app.listen( 3000 );
console.log( 'UI started on port 3000' );









