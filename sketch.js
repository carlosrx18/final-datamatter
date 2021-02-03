// (c) 2021 studio derfunke
// for MDD
// https://editor.p5js.org/zilog/sketches/cEmHTFx0Z

// credentials to connect to MQTT broker
let settings = {
  broker: "carlossophie.cloud.shiftr.io",
  username: "carlossophie",
  token: "2A2845pkH88Bz9Fn"
};

// this is the mqtt topic that this sketch will send out to
let topic_out = "myteam/servo";
// topics that this sketch subscribes to
let subs = [
  "carlos/test/#", // # means subscribe to all subtopics
  "carlos/test/1"
];

let levels = {};

// initialize the mqtt websocket connection
// see: https://www.eclipse.org/paho/index.php?page=clients/js/index.php
client = new Paho.MQTT.Client(settings.broker, Number(443), "p5js-sketch");

// callbacks for events
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

client.connect({
  onSuccess: onConnect,
  userName: settings.username,
  password: settings.token,
  useSSL: true
});

function keyPressed() {
  let servo_angle = 270;
  mqttSendMessage(servo_angle);
}

function onConnect() {
  console.log("connected to shiftr");
  subs.forEach((element) => {
    console.log("subscribing to topic [" + element + "]");
    client.subscribe(element);
  });
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("lost connection to shiftr:" + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  //console.log("received <- topic: " + message.destinationName + " payload:" + message.payloadString)
  // create a list with all the readings and their values so that we can do a simple visualization
  levels[message.destinationName] = parseInt(message.payloadString);
}

function mqttSendMessage(payload) {
  //console.log("sending: " + payload)
  let message = new Paho.MQTT.Message(payload.toString());
  message.destinationName = topic_out;
  client.send(message);
}
