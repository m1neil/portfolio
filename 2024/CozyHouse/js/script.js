'use strict'
import { initMenu } from './menu.js'
import { initFixedHeader } from './fixed-header.js'
import { initGalaxySlider } from './sliders.js'
import { HttpRequest } from './HttpRequest.js'
import { initPhoneNumber } from './phoneNumber.js'
import { initGoto, createSpinner, createPetCard } from './functions.js'
import { initPopup } from './popup.js'
import { initPagination } from './PaginationCards.js'

window.addEventListener('load', windowLoaded)

function windowLoaded() {
	initMenu(400)
	initFixedHeader()
	try {
		initPhoneNumber()
		insertCard('.pets__slider', 'pets', true)
		initPagination()
		initGoto()
	} catch (error) {
		console.error(error.message)
	}
	initPopup()
}

function getCardsList(images, bemClass, isCardInSlider = false) {
	const wrapper = document.createElement('div')
	wrapper.className = bemClass ? `${bemClass}__wrapper swiper-wrapper` : 'swiper-wrapper'
	images.forEach(info => {
		const article = createPetCard(info)
		if (isCardInSlider) {
			const cardWrapper = document.createElement('div')
			cardWrapper.className = bemClass ? `${bemClass}__slide swiper-slide` : 'swiper-slide'
			cardWrapper.append(article)
			wrapper.append(cardWrapper)
		} else wrapper.append(article)
	})
	return wrapper
}

async function insertCard(selectorContainer, bemClass, isInsetInSlider = false) {
	const container = document.querySelector(selectorContainer)
	if (!container) return

	const spinner = createSpinner()
	container.append(spinner)

	let amountCard = container.hasAttribute('data-amount') ?
		parseInt(container.getAttribute('data-amount')) : 3

	if (isNaN(amountCard) || amountCard <= 0)
		throw new RangeError("The number should be more than zero!")

	try {
		let data = await HttpRequest.getData(`https://api.thecatapi.com/v1/images/search?limit=${amountCard}&has_breeds=1&breed_ids=beng,abys`)
		data = await HttpRequest.transformData(data, 'https://api.thecatapi.com/v1/images')

		spinner.remove()
		container.prepend(getCardsList(data, bemClass, isInsetInSlider))
		if (isInsetInSlider) initGalaxySlider()
	} catch (error) {
		console.debug(error.message)
		alert(`Reload the page! Click F5 on your keyboard.`)
	}
}


