'use strict';

const TuyAPI = require('tuyapi');
const client = require('prom-client');
const Registry = client.Registry;
const http = require('http')
const url = require('url')

const register = new client.Registry()
const gaugeCo2 = new client.Gauge({ name: 'tuya_co2', help: 'CO2 in PPM' });
const gaugeTemperature = new client.Gauge({ name: 'tuya_temperature', help: 'Temperature in degrees C * 10' });
const gaugeHumidity = new client.Gauge({ name: 'tuya_humidity', help: 'Humidity in permille' });
const gaugeVoc = new client.Gauge({ name: 'tuya_voc', help: 'VOC in PPM*10' });
const gaugeCh2o = new client.Gauge({ name: 'tuya_ch2o', help: 'CH2O in mg/m3 * 100' });
register.registerMetric(gaugeCo2)
register.registerMetric(gaugeTemperature)
register.registerMetric(gaugeHumidity)
register.registerMetric(gaugeVoc)
register.registerMetric(gaugeCh2o)

const device = new TuyAPI({
  id: '32070506e868e7ea32ee',
  key: '67399f2ecda1573b',
  ip: '192.168.2.33',
  version: '3.3',
  issueRefreshOnConnect: false
});
// Find device on network
device.find().then(() => {
  // Connect to device
  device.connect();
});

// Add event listeners
device.on('connected', () => {
  console.log('Connected to device!');
});

device.on('disconnected', () => {
  console.log('Disconnected from device.');
});

device.on('error', error => {
  console.log('Error!', error);
});

device.on('dp-refresh', data => {
  // console.log('DP_REFRESH data from device: ', data);
  reportMetrics(data)
});

device.on('data', data => {
  // console.log('DATA from device: ', data);
  reportMetrics(data)
});

function reportMetrics(data) {
  if(data.dps['22'])
    gaugeCo2.set(data.dps['22'])
  if(data.dps['18'])
    gaugeTemperature.set(data.dps['18'])
  if(data.dps['19'])
    gaugeHumidity.set(data.dps['19'])
  if(data.dps['21'])
    gaugeVoc.set(data.dps['21'])
  if(data.dps['2'])
    gaugeCh2o.set(data.dps['2'])
}

const server = http.createServer(async (req, res) => {
  const route = url.parse(req.url).pathname

  if (route === '/metrics') {
    res.setHeader('Content-Type', register.contentType)
    res.end(await register.metrics())
  }
})

server.listen(9355)
