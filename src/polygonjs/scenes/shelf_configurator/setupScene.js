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

	let assetsLoadedCount = 0;
	const maxAssetsCount = 2;
	scene.node('/EVENT/nodeCook1').onDispatch('each', ()=>{
		assetsLoadedCount++;
		const progress = assetsLoadedCount / maxAssetsCount;
		updateProgressBar(progress)
	})
}


// this assumes a progress value going from 0 to 1.
function updateProgressBar(progress){
	if(progress < 1){
		document.getElementById('polygonjs-progress').style.width = `${Math.round(progress*100)}%`;
		document.getElementById('polygonjs-progress-bar-label').innerText = `${Math.round(progress*100)}%`;
	} else {
		// when we reach 1, we can remove the progress bar and fade out the poster
		const container = document.getElementById('polygonjs-progress-bar-container');
		container.parentElement.removeChild(container);
		const poster = document.getElementById('polygonjs-loading-poster');
		poster.classList.add('fade-out');
		setTimeout(()=>{
			poster.parentElement.removeChild(poster);
		},1200);
	}
}