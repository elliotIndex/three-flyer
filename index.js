var PI_2 = Math.PI/2;

var Colors = {
	red: 0xf25346,
	white: 0xd8d0d1,
	brown: 0x59332e,
	pink: 0xF5986E,
	brownDark: 0x23190f,
	blue: 0x68c3c0,
  background: 0xf7d9aa,
  grey: 0xaaaaaa,
  pureWhite: 0xffffff,
  pureBlack: 0x000000,
};

window.addEventListener('load', init, false);
// window.onload = function() {
  // init()
//}
function init() {
	// set up the scene, the camera and the renderer
	createScene();

	// add the lights
	createLights();

	// add the objects
	// createPlane();
	// createSea();
	// createSky();

	// start a loop that will update the objects' positions
	// and render the scene on each frame
	// loop();
}

var scene;

function createScene() {
	// Get the width and the height of the screen,
	// use them to set up the aspect ratio of the camera
	// and the size of the renderer.
	var HEIGHT = window.innerHeight;
	var WIDTH = window.innerWidth;

	// Create the scene
  scene = new THREE.Scene();

	// Add a fog effect to the scene; same color as the
	// background color used in the style sheet
	scene.fog = new THREE.Fog(Colors.background, 100, 950); // color, near, far

	// Create the camera
  var fieldOfView = 60; // degrees
	var aspectRatio = WIDTH / HEIGHT;
	var nearPlane = 1;
	var farPlane = 10000;
	var camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);

	// Set the position of the camera
	camera.position.x = 0;
	camera.position.z = 200; // move camera 'back'
	camera.position.y = 100; // move camera 'up'

	// Create the renderer
	var renderer = new THREE.WebGLRenderer({
		// Allow transparency to show the gradient background
		// we defined in the CSS
		alpha: true,

		// Activate the anti-aliasing; this is less performant,
		// but, as our project is low-poly based, it should be fine : )
		antialias: true
	});

	// Define the size of the renderer; in this case,
	// it will fill the entire screen
	renderer.setSize(WIDTH, HEIGHT);

	// Enable shadow rendering
	renderer.shadowMap.enabled = true;

	// Add the DOM element of the renderer to the
	// container we created in the HTML
	var container = document.getElementById('world');
	container.appendChild(renderer.domElement);

	// Listen to the screen: if the user resizes it
	// we have to update the camera and the renderer size
	window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

function createLights() {
	// A hemisphere light is a gradient colored light;
	// the first parameter is the sky color, the second parameter is the ground color,
	// the third parameter is the intensity of the light
	var hemisphereLight = new THREE.HemisphereLight(Colors.grey, Colors.pureBlack, .9)

	// A directional light shines from a specific direction.
	// It acts like the sun, that means that all the rays produced are parallel.
	var shadowLight = new THREE.DirectionalLight(Colors.pureWhite, .9);

	// Set the direction of the light
	shadowLight.position.set(
    150, // right
    350, // up
    350  // back
  );

	// Allow shadow casting
	shadowLight.castShadow = true;

	// define the visible area of the projected shadow
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	// define the resolution of the shadow; the higher the better,
	// but also the more expensive and less performant
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	// to activate the lights, just add them to the scene
	scene.add(hemisphereLight);
	scene.add(shadowLight);
}

// First let's define a Sea object :
var Sea = function(){

	// create the geometry (shape) of the cylinder;
	var geom = new THREE.CylinderGeometry(
    600, // radius top
    600, // radius bottom
    800, // height
    40, // num secments on radius
    10
  ); // num segments vertically

	// rotate the geometry on the x axis
	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-PI_2));

	// create the material
	var mat = new THREE.MeshPhongMaterial({
		color: Colors.blue,
		transparent: true,
		opacity: .6,
		shading: THREE.FlatShading, // could use smooth shading
	});

	// To create an object in Three.js, we have to create a mesh
	// which is a combination of a geometry and some material
	this.mesh = new THREE.Mesh(geom, mat);

	// Allow the sea to receive shadows
	this.mesh.receiveShadow = true;
}

// Instantiate the sea and add it to the scene:
function createSea(){
	var sea = new Sea();

	// push it a little bit at the bottom of the scene
	sea.mesh.position.y = -600;

	// add the mesh of the sea to the scene
	scene.add(sea.mesh);
}
