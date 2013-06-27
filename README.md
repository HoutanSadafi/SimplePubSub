SimplePubSub
============

SimplePubSub is a lightweight, dependency free implementation of the publish and subscribe pattern in javascript.

## Usage

### Subscribing

```javascript

// create a function to receive message
var receive = function(data){
  console.log(data);
}

//subscribe to event. A token is returned which is used for unsubscribing
var token = SimplePubSub.subscribe('event', receive);
```

### Publishing

```javascript

//register as the publisher of the event. A callback is returned as the means of publishing an event
var callback = SimplePubSub.register('event');

//publish a message to all subscribers
callback("my data");

//You can publish any type of data, from strings to objects, and with any number of parameters
callback({ name: 'john'}, 1234, false);
```

### Unsubscribing

```javascript

//simple call the unsubscribe method on the returned callback
token.unsubscribe();
```

### Subscribing with Context

```javascript
function MyObject() {}

MyObject.prototype.receive = function(data) {
	console.log(data);
}

var obj = new MyObject();

//you can pass the context as the third parameter, ensuring that when your callback is 
//called it is called using the correct context.
var token = SimplePubSub.subscribe('event', obj.receive, obj);
```