describe("SimplePubSub", function() {
 
	it("When publisher attempts to register an already existing topic, it should throw exception", function() {
			var pubsub = new _SimplePubSub();
			pubsub.register('topic-a');
 
			var throwsException = function(){
				pubsub.register('topic-a');
			};
			
			expect(throwsException).toThrow();
		});
 
		it("when a publisher attempts to register and provides non-string type for topic, it should throw exception", function(){
			var pubsub = new _SimplePubSub();
 
			var throwsException = function(){
				pubsub.register({});
			};
			
			expect(throwsException).toThrow();
		});
 
		it("When a subscriber attempts to subscribe to a topic that does exist, it should throw exception", function() {
			var pubsub = new _SimplePubSub();
 
			var throwsException = function(){
				pubsub.subscribe('topic-a', callback);
			};
			
			expect(throwsException).toThrow();
		});
 
		it("when a subscriber attempts to subscribe and provides non-string type for topic, it should throw exception", function(){
			var pubsub = new _SimplePubSub();
 
			var callback = function(){};
 
			var throwsException = function(){
				pubsub.subscribe({}, callback);
			};
			
			expect(throwsException).toThrow();
		});
 
		it("when a subscriber attempts to subscribe and provides a callback that is not a function, it should throw exception", function(){
			var pubsub = new _SimplePubSub();
 
			var callback = 'callback';
 
			var throwsException = function(){
				pubsub.subscribe('topic-a', callback);
			};
			
			expect(throwsException).toThrow();
		});
 
		it("when a subscriber unsubscribes for a topic, it should remove that subscription from the topic", function(){
			var pubsub = new _SimplePubSub();
			pubsub.register('topic-a');
 
			pubsub.subscribe('topic-a', function(){ console.log(1); })
			var token = pubsub.subscribe('topic-a', function(){ console.log(2); })
			token.unsubscribe();
 
			expect(pubsub.topics['topic-a'].length).toEqual(1);
		});
 
		it("when a subscriber unsubscribes for a topic, i should not have my callback invoked when the owner of the topic publishes an event", function(){
			var isInvoked = false;
			var pubsub = new _SimplePubSub();
			var pub = pubsub.register('topic-a');
 
			var callback = function(data){
				isInvoked = true;
			};
 
			var token = pubsub.subscribe('topic-a', callback);
			token.unsubscribe();
			pub({});
			expect(isInvoked).toBe(false);
		});
 
		it("when a publisher invokes their publish callback, I should as a subscriber have my callback invoked", function(){
			var isInvoked = false;
			var pubsub = new _SimplePubSub();
			var pub = pubsub.register('topic-a');
 
			var callback = function(){
				isInvoked = true;
			};
 
			pubsub.subscribe('topic-a', callback);
			pub();
			expect(isInvoked).toBe(true);
		});
 
		it("when a publisher invokes their publish callback, I should as a subscriber have my callback invoked with the correct context", function(){
			var context = { 
				isInvoked : false 
			};
 
			var pubsub = new _SimplePubSub();
			var pub = pubsub.register('topic-a');
 
			var callback = function(data){
				this.isInvoked = true;
			};
 
			pubsub.subscribe('topic-a', callback, context);
			pub({});
			expect(context.isInvoked).toBe(true);
		});
 
		it("when a publisher invokes their publish callback passing data to the callback, i should as a subscriber have my callback invoked passing in that that data", function(){
			var fullname = '';
			var pubsub = new _SimplePubSub();
			var pub = pubsub.register('topic-a');
 
			var callback = function(name){
				fullname = name;
			}
 
			pubsub.subscribe('topic-a', callback);
			pub('Jim Jones');
 
			expect(fullname).toEqual('Jim Jones');
		});
 
		it("when a publisher invokes their publish callback passing an arbitary number of parameters to the callback, i should as a subscriber have my callback invoked passing in the same number of parameters", function(){
			var person = {
				fullname : '',
				age : '',
				address : '' 
			};
 
			var pubsub = new _SimplePubSub();
			var pub = pubsub.register('topic-a');
 
			var callback = function(name, age, address){
				person.fullname = name;
				person.age = age;
				person.address = address;
			}
 
			pubsub.subscribe('topic-a', callback);
			pub('Jim Jones', 19, '100 main st.');
 
			expect(person.fullname).toEqual('Jim Jones');
			expect(person.age).toEqual(19);
			expect(person.address).toEqual('100 main st.');
		});
 
		it("when a publisher invokes their publish callback, i should as a subscriber have my callback invoked passing the topic as the last argument", function(){
			var topic = 'topic-a';
			var callbackTopic = '';
			var pubsub = new _SimplePubSub();
			var pub = pubsub.register(topic);
 
			var callback = function(data, topic){
				 callbackTopic = topic;
			}
 
			pubsub.subscribe(topic, callback);
			pub({});
 
			expect(callbackTopic).toEqual(topic);
		});
		
});