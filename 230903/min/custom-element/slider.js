import Helper from "./helper.js";

const { watch } = new Helper();

class SliderInput extends HTMLElement {
  constructor() {
    super();
    const minAttr = Number(this.getAttribute("min")) || 0;
    const maxAttr = Number(this.getAttribute("max")) || 100;
    this.value = Object.defineProperties(
      {},
      {
        initialMin: { value: minAttr },
        initialMax: { value: maxAttr },
        min: { configurable: true, value: minAttr },
        max: { configurable: true, value: maxAttr },
        progressBarWidth: {
          configurable: false,
          enumerable: false,
          get: function () {
            return ((this.max - this.min) / this.initialMax) * 100;
          },
        },
      }
    );
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'
    this.shadowRoot.append(this._craeteStyle(), this._craeteElement());

    this._createMarks();

    this._init();
  }

  _init() {
    const {
      shadowRoot,
      value: { initialMin, initialMax },
    } = this;

    const minRangeInputEle = shadowRoot.querySelector(".min-range-input");
    const maxRangeInputEle = shadowRoot.querySelector(".max-range-input");
    const rangeBarEle = shadowRoot.querySelector(".range-bar");
    minRangeInputEle.value = initialMin;
    maxRangeInputEle.value = initialMax;

    watch({
      targetElement: minRangeInputEle,
      targetObj: this.value,
      targetPropertyName: "min",
      normalise: nextValue => {
        return nextValue >= this.value.max ? this.value.max - 1 : nextValue;
      },
      callback: finalValue => {
        rangeBarEle.style.marginLeft = `${finalValue}%`;
        rangeBarEle.style.width = this.value.progressBarWidth + "%";
      },
    });

    watch({
      targetElement: maxRangeInputEle,
      targetObj: this.value,
      targetPropertyName: "max",
      normalise: nextValue => (nextValue <= this.value.min ? this.value.min + 1 : nextValue),
      callback: () => {
        rangeBarEle.style.width = this.value.progressBarWidth + "%";
      },
    });
  }

  _craeteElement() {
    // create eles
    const containerEle = document.createElement("div");
    const minInputEle = document.createElement("input");
    const maxInputEle = document.createElement("input");
    const sliderBarEle = document.createElement("div");

    // set attrs
    containerEle.setAttribute("class", "slider-container");
    minInputEle.setAttribute("type", "range");
    minInputEle.setAttribute("class", "range-input min-range-input");

    maxInputEle.setAttribute("type", "range");
    maxInputEle.setAttribute("class", "range-input max-range-input");

    sliderBarEle.setAttribute("class", "range-bar");
    sliderBarEle.setAttribute("style", "width: 100%");

    // append child to containerEle
    [minInputEle, sliderBarEle, maxInputEle].forEach(ele => {
      containerEle.appendChild(ele);
    });

    return containerEle;
  }

  _craeteStyle() {
    const style = document.createElement("style");
    style.textContent = `
			.slider-container {
				position: relative;
				width: 200px;
				height: 50px;
				display: flex;
				align-items: center;
				margin-top: 20px;
			}

			.range-input,
			.range-input::-webkit-slider-thumb {
				-webkit-appearance: none;
				-webkit-tap-highlight-color: transparent;
			}
			
			.range-input {
				position: absolute;
				pointer-events: none;
				height: 0;
				width: 200px;
			}
			
			.range-input::-webkit-slider-thumb {
				background-color: #68AFC9;
				border: none;
				border-radius: 50%;
				box-shadow: 0 0 1px 1px #ced4da;
				cursor: pointer;
				height: 20px;
				width: 20px;
				pointer-events: all;
				position: relative;
			
			}
				
			.range-bar {
				z-index: -1;
				position: absolute;
				left: 1%;
				height: 5px;
				background: lightblue;
			}
		`;

    return style;
  }

  _createMarks() {
    const marksAttr = this.getAttribute("marks").split(",");
    const defaultMarksStyle = `
			position: absolute;
			bottom: -5px;
			text-align: center;
			min-width: 20px;
			min-height: 20px;
		`;

    marksAttr.forEach((mark, index) => {
      const markEle = document.createElement("span");
      markEle.innerText = mark.trim();
      markEle.style = (() => {
        if (index === 0) {
          return `
						${defaultMarksStyle}
						left: 1%;
						`;
        }

        if (!marksAttr[index + 1]) {
					return `
					${defaultMarksStyle}
					left: calc(100% - 20px);
					`;
        }

				return `
					${defaultMarksStyle}
					left: ${mark}%;
					transform: translateX(${-mark}%);
				`
      })();

      this.shadowRoot.querySelector(".slider-container").appendChild(markEle);
    });
  }
}

customElements.define("slider-input", SliderInput);
