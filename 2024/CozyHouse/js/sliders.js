import { SliderCard } from "./SliderCard.js"

export function initGalaxySlider() {
	const sliderMedia = new Map()
	sliderMedia.set(1150, {
		gap: 40,
		amountSlide: 2
	})
	sliderMedia.set(620, {
		amountSlide: 1,
		speedAnimation: 400
	})

	new SliderCard(
		'.pets__slider',
		3,
		90,
		600,
		sliderMedia
	).render()
}