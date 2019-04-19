var exchange = new Exchange(this, channel, name, options, openCallback);
this.channels[channel] = exchange;
this.exchanges[name] = exchange;

var q = new Queue(this, channel, name, options, callback);
this.channels[channel] = q;

self.parser.onContent = function (channel, data) {
    debug && debug(channel + " > content " + data.length);
    if (self.channels[channel] && self.channels[channel]._onContent) {
      self.channels[channel]._onContent(channel, data);
    } else {
      debug && debug("unhandled content: " + data);
    }
  };

  self.parser.onContentHeader = function (channel, classInfo, weight, properties, size) {
    debug && debug(channel + " > content header " + JSON.stringify([classInfo.name, weight, properties, size]));
    if (self.channels[channel] && self.channels[channel]._onContentHeader) {
      self.channels[channel]._onContentHeader(channel, classInfo, weight, properties, size);
    } else {
      debug && debug("unhandled content header");
    }
  };


for (var channel in self.channels) {
    if (channel !== '0') {
      self.channels[channel].state = 'closed';
    }
  }


  // 心跳区分 in, out 
  Connection.prototype._inboundHeartbeatTimerReset = function () {
    if (this._inboundHeartbeatTimer !== null) {
      clearTimeout(this._inboundHeartbeatTimer);
      this._inboundHeartbeatTimer = null;
    }
    if (this.options.heartbeat) {
      var self = this;
      var gracePeriod = 2 * this.options.heartbeat;
      this._inboundHeartbeatTimer = setTimeout(function () {
        if(self.socket.readable || self.options.heartbeatForceReconnect){
          self.emit('error', new Error('no heartbeat or data in last ' + gracePeriod + ' seconds'));
        }
      }, gracePeriod * 1000);
    }
  };
  // 定时发送心跳包，如果有其他的_sendMethod的话，那么重新reset，如果新建立连接的话，也会reset
  Connection.prototype._outboundHeartbeatTimerReset = function () {
    if (this._outboundHeartbeatTimer !== null) {
      clearTimeout(this._outboundHeartbeatTimer);
      this._outboundHeartbeatTimer = null;
    }
    if (this.socket.writable && this.options.heartbeat) {
      var self = this;
      this._outboundHeartbeatTimer = setTimeout(function () {
        self.heartbeat();
        self._outboundHeartbeatTimerReset();
      }, 1000 * this.options.heartbeat);
    }
  };



