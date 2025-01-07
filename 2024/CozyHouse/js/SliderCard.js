export class SliderCard {
	constructor(selector, amountSlide, gap, speedAnimation, breakpoints) {
		this.selector = selector
		this.breakpoints = breakpoints
		this.currentSlide = 0
		this.isSlideAnimate = false
		this.options = {
			gap: 0,
			amountSlide: 0,
			speedAnimation: 0
		}
		this.Gap = gap
		this.AmountSlide = amountSlide
		this.SpeedAnimation = speedAnimation
	}

	// get set ===========================================================================
	get Gap() {
		return this.options.gap / 16
	}
	set Gap(newGap) {
		if (newGap < 0)
			newGap = 0
		this.options.gap = newGap
	}

	get AmountSlide() {
		return this.options.amountSlide
	}
	set AmountSlide(newAmount) {
		if (newAmount < 0)
			newAmount = 0
		this.options.amountSlide = newAmount
	}

	get SpeedAnimation() {
		return this.options.speedAnimation
	}
	set SpeedAnimation(newSpeed) {
		if (newSpeed < 10)
			newSpeed = 600
		this.options.speedAnimation = newSpeed
	}

	// functions ===========================================================================
	findElement(selector) {
		const element = document.querySelector(selector)
		if (!element)
			throw new Error(`Not found element by selector - ${selector}`)
		return element
	}

	moveSlide(value) {
		if (this.isSlideAnimate) return

		this.currentSlide += value
		if (this.currentSlide < 0)
			this.currentSlide = this.amountField - 1
		else if (this.currentSlide >= this.amountField)
			this.currentSlide = 0

		this.scrollSlide()

		this.isSlideAnimate = true
		setTimeout(() => {
			this.isSlideAnimate = false
		}, this.SpeedAnimation);
	}

	scrollSlide() {
		const percentPositionSlide = this.currentSlide * 100 / this.widthWrapper * 100
		this.wrapper.style.transform = `translateX(-${percentPositionSlide}%)`
	}

	calcAmountField() {
		return Math.ceil(this.amountChildren / this.AmountSlide)
	}

	initMediaQueries() {
		this.startOptions = JSON.parse(JSON.stringify(this.options))
		for (const breakpoint of this.breakpoints) {
			const [value, options] = breakpoint
			const media = window.matchMedia(`(max-width: ${value / 16}em)`)
			media.addEventListener('change', e => this.changeSettings(e.matches, options, value))
			if (media.matches)
				this.changeSettings(true, options)
		}
	}

	changeSettings(matches, options, value) {
		if (matches) {
			for (const key in options) {
				if (key in this.options)
					this.options[key] = options[key]
			}
			this.amountField = this.calcAmountField()
			this.widthWrapper = this.amountField * 100
			this.wrapper.style.width = `${this.widthWrapper}%`
			this.wrapper.style.transitionDuration = `${this.SpeedAnimation}ms`
			this.addSlidesInField()
			this.scrollSlide()
		} else {
			let newOptions
			for (const breakpoint of this.breakpoints) {
				if (breakpoint[0] > value) {
					newOptions = breakpoint[1]
					break
				}
			}
			this.changeSettings(true, newOptions ?? this.startOptions)
		}
	}

	addSlidesInField() {
		const fields = this.wrapper.querySelectorAll('.swiper-field')
		let slideField
		if (fields.length)
			slideField = fields[this.currentSlide].children[0]

		if (fields.length)
			fields.forEach(field => field.remove())

		for (let indexField = 0, indexChild = 0; indexField < this.amountField; indexField++) {
			const field = document.createElement('div')
			field.className = 'swiper-field'
			field.style.gap = `${this.Gap}rem`
			for (let iSlide = 0; iSlide < this.AmountSlide; iSlide++, indexChild++) {
				if (slideField && this.children[indexChild] === slideField)
					this.currentSlide = indexField
				if (this.children[indexChild])
					field.append(this.children[indexChild])
				else break
			}

			this.wrapper.append(field)
		}

	}

	init() {
		const wrapper = this.findElement(`${this.selector} .swiper-wrapper`)

		this.children = wrapper.querySelectorAll('.swiper-slide')
		this.amountChildren = this.children.length
		this.amountField = this.calcAmountField()
		const widthWrapper = this.amountField * 100
		wrapper.style.width = `${widthWrapper}%`
		wrapper.style.transitionDuration = `${this.SpeedAnimation}ms`
		wrapper.style.transitionProperty = `transform`
		this.wrapper = wrapper

		this.addSlidesInField()

		this.widthWrapper = widthWrapper
		this.buttonPrev = this.findElement(`${this.selector} .swiper-button-prev`)
		this.buttonNext = this.findElement(`${this.selector} .swiper-button-next`)
		this.buttonNext.addEventListener('click', this.moveSlide.bind(this, 1))
		this.buttonPrev.addEventListener('click', this.moveSlide.bind(this, -1))
	}


	render() {
		this.init()
		this.initMediaQueries()
	}
}