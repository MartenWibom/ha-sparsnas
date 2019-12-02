const mqtt = require('mqtt')
// const mqttrouter = require('mqtt-router')

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
// const router = mqttrouter.wrap(client)

client.subscribe(TOPIC.INPUT)

client.on('message', (topic, msg) => {
  const evtmsg = JSON.parse(msg.toString())
  const hamsg = {
    event: 'sparsnas.power',
    device: 'sparsnas',
    payload: evtmsg
  }
  console.log('Send to MQTT=', hamsg)
  client.publish(TOPIC.OUTPUT, JSON.stringify(hamsg))
})
