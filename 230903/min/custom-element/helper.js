class Helper {
	watch({ targetElement, targetObj, targetPropertyName, normalise, callback = val => val }) {
		const obj = targetObj;

		let value = obj[targetPropertyName];

		delete obj[targetPropertyName];

		Object.defineProperty(obj, targetPropertyName, {
			configurable: false,
			enumerable: false,
			get: function () {
				return value;
			},
			set: function (inputVal) {
				const finalValue = normalise(Number(inputVal));
				value = finalValue;
				targetElement.value = finalValue;
				callback(finalValue);
			},
		});

		targetElement.addEventListener('input', e => obj[targetPropertyName] = e.target.value);
	}
}

export default Helper;
