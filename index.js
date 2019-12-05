const mqtt = require('mqtt')
const MovingAverage = require('./movingaverage')
const Cron = require('cron').CronJob

const ma = new MovingAverage()

const TOPIC = {
  INPUT: 'EspSparsnasGateway/valuesV2',
  OUTPUT: 'ha-evt'
}

const isIp = (str) => {
  let re = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
  return re.test(str)
}

const clean = str => {
  if (!isIp(str)) {
    let noprot = str.replace(/(^\w+:|^)\/\//, '')
    let noport = noprot.replace(/(:)\d*/, '')
    return noport
  } else {
    return str
  }
}

const client = mqtt.connect(`mqtt://192.168.2.201`)

client.subscribe(TOPIC.INPUT)

client.on('message', (topic, msg) => {
  const evtmsg = JSON.parse(msg.toString())
  ma.push(evtmsg.watt)
  const hamsg = {
    event: 'sparsnas.power',
    device: 'sparsnas',
    payload: evtmsg
  }
  client.publish(TOPIC.OUTPUT, JSON.stringify(hamsg))
})

new Cron('0 * * * *', () => {
  const kwh = ma.getAverage()
  const hamsg = {
    event: 'sparsnas.kwh',
    device: 'sparsnas',
    payload: {
      kwh
    }
  }
  ma.reset()
  client.publish(TOPIC.OUTPUT, JSON.stringify(hamsg))
})
