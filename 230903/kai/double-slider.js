class DoubleSlider extends HTMLElement {
  #v1 = this.getAttribute("min-value")
  #v2 = this.getAttribute("max-value")
  #width = this.getAttribute("width")
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: "open" })
    const style = document.createElement("style")
    shadow.appendChild(style)

    const wrapper = document.createElement("div")
    const firstInput = document.createElement("input")
    const secondInput = document.createElement("input")
    firstInput.setAttribute("type", "range")
    firstInput.setAttribute("min", this.getAttribute("min"))
    firstInput.setAttribute("max", this.getAttribute("max"))
    firstInput.setAttribute("value", this.getAttribute("max-value"))
    secondInput.setAttribute("type", "range")
    secondInput.setAttribute("min", this.getAttribute("min"))
    secondInput.setAttribute("max", this.getAttribute("max"))
    secondInput.setAttribute("value", this.getAttribute("min-value"))

    firstInput.addEventListener("input", (e) => {
      this.#v2 = e.target.value
      this.style.setProperty("--track-width", `${this.calculateTrack()}px`)
      this.style.setProperty(
        "--track-start",
        `${this.calculateTrackStart()}px`
      )
    })
    secondInput.addEventListener("input", (e) => {
      this.#v1 = e.target.value
      this.style.setProperty("--track-width", `${this.calculateTrack()}px`)
      this.style.setProperty(
        "--track-start",
        `${this.calculateTrackStart()}px`
      )
    })

    wrapper.appendChild(firstInput)
    wrapper.appendChild(secondInput)

    wrapper.setAttribute("class", "wrapper")
    shadow.appendChild(wrapper)

    style.textContent = `
      input, input::-webkit-slider-runnable-track, input::-webkit-slider-thumb {
        appearance: none;
        -webkit-appearance: none;
      }
      input {
        background: none; /* get rid of white Chrome background */
        margin: 0;
        pointer-events: none; /* let clicks pass through */
      }
      input::-webkit-slider-runnable-track {
        background: none; /* get rid of Firefox track background */
        height: 100%;
        width: 100%;
      }
      input::-webkit-slider-thumb {
        background: ${this.getAttribute("thumb-color") || "currentColor"};
        border: none; /* get rid of Firefox thumb border */
        border-radius: 99em; /* get rid of Firefox corner rounding */
        pointer-events: auto; /* catch clicks */
        width: var(--thumb-width, 20px);
        height: var(--thumb-width, 20px);
      }
      .wrapper {
        display: grid;
        height: 100%;
        width: ${this.getAttribute("width") || "fit-content"};
        position: relative;
        isolation: isolate;
      }
      .wrapper > * {
        grid-column: 1;
        grid-row: 1;
      }
      .wrapper::after {
        content: "";
        position: absolute;
        width: calc(var(--track-width) - var(--thumb-width, 20px) * 0.25);
        background-color: ${this.getAttribute("track-color") || "currentColor"};
        height: 50%;
        top: 50%;
        translate: calc(var(--track-start, 0px) + var(--thumb-width, 20px) * 0.125) -50%;
        left: auto;
        right: auto;
        z-index: -1;
      }
    `
  }
  connectedCallback() {
    this.#width = this.offsetWidth
    this.style.setProperty("--track-start", `${this.calculateTrackStart()}px`)
    this.style.setProperty("--track-width", `${this.calculateTrack()}px`)
  }

  calculateTrack() {
    return (Math.abs(this.#v1 - this.#v2) / 100) * this.#width
  }

  calculateTrackStart() {
    const left = Math.min(this.#v1, this.#v2)
    return (left / 100) * this.#width
  }
}

customElements.define("double-slider", DoubleSlider)
