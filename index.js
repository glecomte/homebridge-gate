var request = require('request');
var options ;
var Service, Characteristic;
var fs = require('fs');

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-gate", "PushButtonSwitch", PushButtonSwitch);
}


function PushButtonSwitch(log, config) {
	this.log = log;
	this.url = config["url"];
	this.method = config["http_method"] || "GET";
	this.sendimmediately = config["sendimmediately"] || "true";
	this.default_state_off = config["default_state_off"] || "true";
	this.name = config["name"];
	this.rootca = config["rootca"] || "";
	this.username = config["username"] || "";
	this.password = config["password"] || "";

	options = { url: this.url, method: this.method, family: 4 }
	if(this.username!=""){
		options.auth = { 'user': this.username, 'pass': this.password, 'sendImmediately': this.sendimmediately };
		this.log('add auth option' + options.auth);
	}
	if(this.rootca!=""){
                options.agentOptions = { 'ca': fs.readFileSync(this.rootca), 'strictSSL': false };
		// this.log('added RootCA option' + options.agentOptions);
		this.log('added private RootCA option');
        }
//	this.log('Resquest option :' + JSON.stringify(options));
}

PushButtonSwitch.prototype = {

    getPowerState: function (callback) {
	callback(null, !this.default_state_off);
    },

    setPowerState: function(powerOn, callback) {
	// powerOn = 0 | 1   : 1=On , 0=Off => is the expected state of the switch
	request(options, function (error, response, body) {
		if ( error  || (response &&  response.statusCode != 200) ) {
	                console.log('Set power function failed');
			console.log('error:', error); // Print the error if one occurred
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			console.log('body:', body); // Print the body from returned
	        }else{
			console.log('Push button succeeded!');
		}
		// a push button is normally off
		callback();
	});

    },

    identify: function (callback) {
        this.log("Identify requested!");
        callback(); // success
    },

    getServices: function () {
        var informationService = new Service.AccessoryInformation();

        informationService
                .setCharacteristic(Characteristic.Manufacturer, "Gate HW")
                .setCharacteristic(Characteristic.Model, "homebridge-gate")
                .setCharacteristic(Characteristic.SerialNumber, "00000001");
        switchService = new Service.Switch(this.name);
        switchService
                .getCharacteristic(Characteristic.On)
                .on('get', this.getPowerState.bind(this))
                .on('set', this.setPowerState.bind(this));

        return [switchService];
    }
};
