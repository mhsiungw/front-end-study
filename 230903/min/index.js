document.querySelector('slider-input').addEventListener('input', e => {
	console.log(e.target.value.min);
	console.log(e.target.value.max);
})