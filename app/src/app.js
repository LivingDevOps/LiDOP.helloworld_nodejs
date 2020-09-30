// Load express module with `require` directive
var express = require('express')
var path = require('path');

var app = express()
app.use('/assets',  express.static(path.join(__dirname, 'views/assets')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


// Define request response in root URL (/)
app.get('/api', function (req, res) {
  res.send('Hello World')
})

app.get('/', function (req, res) {
  renderTitle(res);
  
});

// Launch listening server on port 80
var server = app.listen(80, function () {
  console.log('App listening on port 80!')
})

// Handle Ctrl+C
process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  server.close();
});

const { initialize, isEnabled } = require('unleash-client');

const instance = initialize({
    url: 'http://192.168.31.23:4242/api/',
    appName: 'my-app-name',
    instanceId: 'my-unique-instance-id',
    interval: 1000
});

// optional events
instance.on('error', console.error);
instance.on('warn', console.warn);
instance.on('ready', console.log);

// metrics hooks
instance.on('registered', clientData => console.log('registered', clientData));
instance.on('sent', payload => console.log('metrics bucket/payload sent', payload));
instance.on('count', (name, enabled) => console.log(`isEnabled(${name}) returned ${enabled}`));


instance.once('registered', () => {
    // Do something after the client has registered with the server api.
    // NB! It might not have recieved updated feature toggles yet.
    console.log(`registered client at server. DemoToggle is enabled: ${isEnabled('DemoToggle')}`);
});

instance.once('changed', () => {
    console.log(`DemoToggle is enabled: ${isEnabled('DemoToggle')}`);
});

/*setInterval(() => {
  if(instance.isEnabled('DemoToggle')) {
    console.log('Toggle enabled');
  } else {
    console.log('Toggle disabled');
  }
}, 1000);*/

function renderTitle(res) {
  if(isEnabled('DemoToggle')){
    res.render('index', { title: 'LiDOP', message: 'Hello FeatureFlag!'});
  }
  else{
    res.render('index', { title: 'LiDOP', message: 'Hello LiDOP!'});
  }
}