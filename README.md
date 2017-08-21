# Homebridge Gate switch plugin for Homebridge

This Homebridge plugin emulates a push button swith.

The button calls the defined URL


## Version 1.0

Current status : plugin works fine now for me

TODO: update plugin to behave like a push button (back to Off mode automatically)


## INSTALLATION

Add the package in your homebridge package.json file, like:

```js
{
	"scripts": {
		"install": "npm install -g homebridge-gate"
	}
}
```

Use by adding an accessory in config.json of your homebridge package:

```js
{
	"bridge": {
		"name": "Homebridge",
		"username": "31:AA:CF:B6:16:42",
		"port": 51826,
		"pin": "123-45-678"  
	},
	
	"description": "Homebridge platform",
	
	"platforms": [
	],
	
	"accessories": [
		{
			"accessory": "PushButtonSwitch",
			"name": "Gate #1",
			"url": "https://server.local/gate/open.cgi",
			"default_state_off": true,
			"rootca": "/path/homebridge/certs/Private-CAChain.pem"
		}
	]
}
```
remember to change default pin to secure your own homebridge plateform !


## URL authenticate

The plugin should support username and password, for web server authentication, but not tested as of today


## Using a HTTPS with private SSL certificate

If the URL is secured by HTTPS, You have certainly defined a private Certificate Authority. 
If needed, a good TUTO is here : https://jamielinux.com/docs/openssl-certificate-authority/index.html

Then use '"rootca"' attribute in the config.json as shown above

NB: If the SSL certificate is signed by an intermediate CA, then the "Private-CAChain.pem" file must contain rootca.pem and intermediateca.pem  (ie: '# cat rootca.pem intermediateca.pem > Private-CAChain.pem' )

If You are using HTTPS, You will certainly use DNS name resolution with your local DNS server, to match SAN certificate, instead of an IP address in the URL. If You experience 'dns.js' error, when running the plugin, remember to have a check to '/etc/nsswitch.conf'  :-)

```js
hosts:          files mdns4_minimal [NOTFOUND=return] dns
should become:
hosts:          files dns mdns4_minimal [NOTFOUND=return] 
```

## CGI script to use in the URL

MIME type is not used, and body is not analyzed, so anything should work

On my side, I'm using python script returning a JSON content like that:
```js
  print ("Content-type: text/html\n")
  print json.dumps({'Gate': 1}, sort_keys=True, indent=4, separators=(',', ': '))	
```


## ENJOY !
