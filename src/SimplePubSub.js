
(function(){

	function throwException(ex){
		return function reThrowException(){
			throw ex;
		};
	}
	 
	function SimplePubSub(){
	 
		if ( !(this instanceof SimplePubSub) ){
			return new SimplePubSub();
		}
	 
		this.topics = {};
	}
	 
	SimplePubSub.prototype.register = function(topic) {
		
		if (topic.constructor !== String){
			throw {
				name : 'invalid datatype for topic',
				message : 'topic must be of type string'
			}
		}
	 
		if (topic in this.topics){
			throw {
				name : 'duplicate topic',
				message : 'topic, ' + topic + ' already exists'
			};
		}
	 
		this.topics[topic] = [];
	 
		var self = this;
		
		return function(){
				var args = Array.prototype.slice.apply(arguments);
				args.unshift(topic);
				self.publish.apply(self, args);
			};
	};
	 
	// parameters: topic[, arg1[, arg2[, ...]]]
	SimplePubSub.prototype.publish = function() {
		
		var args = Array.prototype.slice.apply(arguments);
		var topic = args.shift();
	 
		var subscribers = this.topics[topic];
		args.push(topic);
	 
		for (index in subscribers){
	 
			var subscriber = subscribers[index];
	 
			try
			{
				if (subscriber.context){
					subscriber.callback.apply(subscriber.context, args);
				} else {
					subscriber.callback.apply(null, args);
				}
			}
			catch (ex)
			{
				setTimeout(throwException(ex), 0); //when current javascript execution is complete, event will fire.
			}
		}
	};
	 
	SimplePubSub.prototype.subscribe = function(topic, callback, context) {
		
		if (topic.constructor !== String){
			throw {
				name : 'invalid datatype for topic',
				message : 'topic must be of type string'
			} 
		}
	 
		if ( !(topic in this.topics) ){
			throw {
				name : 'no topic found',
				message : 'topic, ' + topic + ' does not exist'
			};
		}
	 
		if (typeof callback != 'function'){
			throw {
				name : 'invalid type for callback',
				message : 'callback must be a function'
			};
		}
	 
		this.topics[topic].push({
			callback : callback,
			context : context
		});
	 
		var self = this;
	 
		return {
			topic :  topic,
			unsubscribe : function(){
				self.unsubscribe(topic, callback);
			}
		};
	};
	 
	SimplePubSub.prototype.unsubscribe = function(topic, callback) {
		
		var list = this.topics[topic];
		var newList = [];
		for (index in list){
			if (list[index].callback === callback){
				continue;
			}
	 
			newList.push(list[index]);
		}
	 
		this.topics[topic] = newList;
	};

	this.SimplePubSub = new SimplePubSub();
	this._SimplePubSub = SimplePubSub; // for tests only

})();

