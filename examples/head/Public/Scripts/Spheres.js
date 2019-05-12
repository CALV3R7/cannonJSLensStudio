// -----JS CODE-----
// @input SceneObject rootSphere
// @input SceneObject[] spheres

// @input SceneObject sphereCollision
// @input float chainDistance
// @input float chainForce

var rootBody;
var bodies = [];

script.sphereCollision.enabled = false;
var spheresAdded = false;
var lastBody = null;

global.sphereMaterial = new CANNON.Material();

var PHYSICS_SCALAR = 5.0;

function addSpheres()
{
    var rootPosition = script.rootSphere.getTransform().getWorldPosition();
    rootBody = createSphere( global.sphereMaterial, new vec3( rootPosition.x, rootPosition.y, rootPosition.z ), true );

    for( var i = 0; i < script.spheres.length; i++ )
    {
        var bodyPos = new vec3( rootPosition.x, rootPosition.y - ( ( i + 1 ) * script.chainDistance * PHYSICS_SCALAR ), rootPosition.z );
        script.spheres[i].getTransform().setWorldPosition( bodyPos );
        bodies[i] = createSphere( global.sphereMaterial, bodyPos, false );
    }
    
    spheresAdded = true;
}


function createSphere( material, position, kinematic )
{
    var radius = script.sphereCollision.getTransform().getLocalScale();
    radius = radius.x * PHYSICS_SCALAR;

    var type = CANNON.Body.DYNAMIC;
    if( kinematic )
    {
        type = CANNON.Body.KINEMATIC;
    }

    // Create sphere
    var sphereShape = new CANNON.Sphere( radius );
    var body = new CANNON.Body({
        mass: 1,
        type: type,
        material: material,
        position: new CANNON.Vec3( position.x, position.z, position.y ),
        shape: new CANNON.Sphere( radius )
    });      

    body.addShape(sphereShape);
    global.worldPhysics.addBody(body);

    if(lastBody!==null){
        global.worldPhysics.addConstraint(c = new CANNON.DistanceConstraint( body, lastBody, script.chainDistance * PHYSICS_SCALAR, script.chainForce));
    }

    lastBody = body;
    
    return body;
}

function onDelayedEvent()
{
    addSpheres();
}

var delayedEvent = script.createEvent("DelayedCallbackEvent");
delayedEvent.reset(1.0);
delayedEvent.bind(onDelayedEvent);

function onUpdateEvent()
{
    if( global.worldPhysicsActive && spheresAdded ) {

        var rootPos = script.rootSphere.getTransform().getWorldPosition();
        var rootPosVe3 =  new CANNON.Vec3( rootPos.x, rootPos.z, rootPos.y );
        rootBody.position = rootPosVe3;

        for( var i = 0; i < script.spheres.length; i++ )
        {
            // Update sphere
            script.spheres[i].getTransform().setWorldPosition( new vec3( bodies[i].position.x, bodies[i].position.z, bodies[i].position.y ));
            script.spheres[i].getTransform().setWorldRotation( new quat( bodies[i].quaternion.x, bodies[i].quaternion.z, bodies[i].quaternion.y, bodies[i].quaternion.w ));
        }

    }
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdateEvent);

