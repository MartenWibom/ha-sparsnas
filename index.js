const mqtt = require('mqtt')
const MovingAverage = require('./movingaverage')
const Cron = require('cron').CronJob
const config = require('config')

const maHH = new MovingAverage()

const topics = {
  input: config.get('topics.input'),
  output: config.get('topics.output')
}

const client = mqtt.connect(config.get('mqtt'))
client.subscribe(topics.input)

// Forward to home automation topic
client.on('message', (topic, msg) => {
  const evtmsg = JSON.parse(msg.toString())

  // Put every watt measurement for later kWh calculation
  maHH.push(evtmsg.watt)

  const hamsg = {
    event: 'sparsnas.power',
    device: 'sparsnas',
    data: evtmsg
  }
  client.publish(topics.output, JSON.stringify(hamsg))
})

// Calculate kWh by taking average for a hour and sent it as hourly metric
new Cron('0 * * * *', () => {
  console.log('Emit hourly kWh metric')
  const kwh = Math.round(maHH.getAverage())
  const hamsg = {
    event: 'sparsnas.kwh',
    device: 'sparsnas',
    data: {
      kwh
    }
  }

  // Reset average for next hour's average calculation
  maHH.reset()

  client.publish(topics.output, JSON.stringify(hamsg))
}).start()
