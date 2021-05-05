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
		scene.node('/shelf/line1').p.pointsCount.set(parseInt(event.target.value)+1);
		document.getElementById('shelves-count').innerText = event.target.value;
		updatePrice()
	})

	let assetsLoadedCount = 0;
	const maxAssetsCount = 2;
	scene.node('/EVENT/nodeCook1').onDispatch('each', ()=>{
		assetsLoadedCount++;
		const progress = assetsLoadedCount / maxAssetsCount;
		updateProgressBar(progress)
	})

	const MATERIAL_NAMES = [
		'white',
		'beige wood',
		'dark wood'
	]
	const PRICE_BY_MATERIAL_NAME = {
		'white': 10,
		'beige wood': 20,
		'dark wood': 40,
	}
	
	const switchNode = scene.node('/shelf/switch_OUT');
	let materialName;
	switchNode.onCookEnd('progress-bar',()=>{
		const index = switchNode.p.input.value;
		materialName = MATERIAL_NAMES[index]
		document.getElementById('material-name').innerText = materialName;
		updatePrice()
	})
	function shelvesCount(){
		return scene.node('/shelf/line1').p.pointsCount.value - 1;
	}
	function price(){
		return 10 * shelvesCount() * PRICE_BY_MATERIAL_NAME[materialName];
	}
	function updatePrice(){
		document.getElementById('price').innerText = `$${price()}`
	}
	document.getElementById('buy-button').addEventListener('click', ()=>{
		const data = {
			shelvesCount: shelvesCount(),
			materialName: materialName,
			price: price()
		}
		alert(JSON.stringify(data))
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