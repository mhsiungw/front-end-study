class RangeInput {
	constructor() {
		this.minRangeInputEle = document.querySelector('.min-range-input');
		this.maxRangeInputEle = document.querySelector('.max-range-input');
		this.rangeBarEle = document.querySelector('.range-bar');
		this.initialValue = {
			minRangeInputValue: 0,
			maxRangeInputValue: 100,
		};
		this.data = {...this.initialValue}

		this.init = this.init.bind(this);
		this.watch = this.watch.bind(this);
		this.getProgrssBarWidth = this.getProgrssBarWidth.bind(this);

		this.init();
	}

	init() {
		const { watch, data, minRangeInputEle, maxRangeInputEle } = this;

		watch('minRangeInputValue', (newValue) => {

			this.rangeBarEle.style.marginLeft= `${newValue}%`;
			this.rangeBarEle.style.width = this.getProgrssBarWidth() + '%';

			minRangeInputEle.value = newValue;
		});
		watch('maxRangeInputValue', (newValue) => {
			this.rangeBarEle.style.width = this.getProgrssBarWidth() + '%';
			maxRangeInputEle.value = newValue;
		});

		minRangeInputEle.addEventListener('input', (e) =>
			e.target.value >= data.maxRangeInputValue
				? (data.minRangeInputValue =
						Number(data.maxRangeInputValue) - 1)
				: (data.minRangeInputValue = Number(e.target.value))
		);
		maxRangeInputEle.addEventListener('input', (e) =>
			e.target.value <= data.minRangeInputValue
				? (data.maxRangeInputValue =
						Number(data.minRangeInputValue) + 1)
				: (data.maxRangeInputValue = Number(e.target.value))
		);

		data.minRangeInputValue = this.initialValue.minRangeInputValue;
		data.maxRangeInputValue = this.initialValue.maxRangeInputValue;
	}

	watch(property, callback) {
		const obj = this.data;

		let value = obj[property];

		delete obj[property];

		Object.defineProperty(obj, property, {
			configurable: false,
			enumerable: false,
			get: function () {
				return value;
			},
			set: function (newValue) {
				value = newValue;
				callback(newValue);
			},
		});
	}

	getProgrssBarWidth() {
		return (
			((this.data.maxRangeInputValue - this.data.minRangeInputValue) /
				this.initialValue.maxRangeInputValue) *
			100
		);
	}
}

const input = new RangeInput();
