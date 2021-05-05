import {mountScene} from './mountScene.js'

document.addEventListener('DOMContentLoaded', async function(){
	const data = await mountScene({
		sceneName: 'shelf_configurator',
		domElement: 'polygonjs-app'
	});
	setupScene(data);
});

export async function setupScene(data) {
	const {scene, cameraNode, viewer} = data;

	// from here you can fetch any node with its path
	// const geo1Node = scene.node('/geo1');
	document.getElementById('geo1-line1-pointsCount').addEventListener('input', function(event){
		scene.node('/geo1/line1').p.pointsCount.set(event.target.value);
	})
}
