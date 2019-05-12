// @input SceneObject groundPlane

// World global
global.worldPhysics = new CANNON.World();
global.worldPhysics.gravity.set(0, 0.0, -100.0);

// Ground global
global.groundMaterial = new CANNON.Material();
global.groundBody;
global.worldPhysicsActive = false;

function startWorldPhysics()
{
    // Turn on physics
    global.worldPhysicsActive = true;
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function onUpdateEvent()
{
    if( global.worldPhysicsActive ) {

        // Update physics
        global.worldPhysics.step( global.getDeltaTime() )
    }
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdateEvent);

function onDelayedEvent()
{
    startWorldPhysics();
}

var delayedEvent = script.createEvent("DelayedCallbackEvent");
delayedEvent.reset(0.01);
delayedEvent.bind(onDelayedEvent);