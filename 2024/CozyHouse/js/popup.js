import { HttpRequest } from "./HttpRequest.js"
import { blockBody, unBlockBody, getScrollWidth } from "./functions.js"

export function initPopup() {
	const parent = document.querySelectorAll('[data-modal-parent]')
	if (!parent.length) return
	parent.forEach(wrapper => {
		wrapper.addEventListener('click', openModal)
	})
}

let isAnimatingPopup = false
const durationAnimation = 300

async function openModal(e) {
	if (isAnimatingPopup) return
	const target = e.target
	if (!target.closest('[data-modal-link]'))
		return
	const button = target.closest('[data-modal-link]')
	const selectorPopup = button.getAttribute('data-modal-link')
	const currentPopup = document.querySelector(selectorPopup)
	if (!currentPopup) return

	const imageId = button.getAttribute('data-image-id')
	try {
		const data = await HttpRequest.getData(`https://api.thecatapi.com/v1/images/${imageId}`)
		setDataInPopup(data, currentPopup)
	} catch (error) {
		console.error(error.message)
	}

	const prevPopup = document.querySelector('.content-popup.--open')
	if (prevPopup) closePopup(prevPopup, false)

	currentPopup.classList.add('--open')
	if (!prevPopup) {
		const scrollWidth = getScrollWidth()
		document.body.style.paddingRight = `${scrollWidth}px`
		togglePaddingFixedElement(scrollWidth)
		document.documentElement.classList.add('popup-open')
		document.addEventListener('click', closePopupByTrigger)
		document.addEventListener('keydown', closePopupByTrigger)
		blockBody()
	}
	isAnimatingPopup = true
	setTimeout(() => {
		isAnimatingPopup = false
	}, durationAnimation);
}

function setDataInPopup({ url, breeds }, popup) {
	if (!popup) return

	const {
		id,
		name,
		description,
		origin,
		life_span,
		social_needs,
		adaptability
	} = breeds[0]

	popup.querySelector('.content-popup__title').textContent = name
	popup.querySelector('.content-popup__subtitle').textContent = `Cat - ${id}`
	popup.querySelector('.content-popup__description').textContent = description
	const img = popup.querySelector('.content-popup__img img')
	img.src = url
	img.alt = id

	const labels = popup.querySelectorAll('[data-label]')
	labels.forEach(item => {
		const label = item.getAttribute('data-label')
		switch (label) {
			case 'expectancy':
				item.textContent = life_span
				break
			case 'origin':
				item.textContent = origin
				break
			case 'social-needs':
				item.textContent = social_needs
				break
			case 'adaptability':
				item.textContent = adaptability
				break
			default:
				throw new Error("Not provided for!");
		}
	})
}


function closePopup(popup, isHideBlackout = true) {
	if (isAnimatingPopup) return
	popup.classList.remove('--open')
	if (!isHideBlackout) return
	document.documentElement.classList.remove('popup-open')
	document.removeEventListener('click', closePopupByTrigger)
	document.removeEventListener('keydown', closePopupByTrigger)
	isAnimatingPopup = true
	unBlockBody(durationAnimation)
	setTimeout(() => {
		togglePaddingFixedElement()
		document.body.style.removeProperty('padding-right')
		isAnimatingPopup = false
	}, durationAnimation);
}

function closePopupByTrigger(event) {
	if (isAnimatingPopup) return

	if (event.type === 'keydown' && event.code === 'Tab') {
		event.preventDefault()
		const closeButton = document.querySelector('.content-popup.--open [data-modal-close]')
		if (closeButton) closeButton.focus()
	}

	if (
		event.type === 'keydown' && isTriggerKey(event.code) ||
		event.type === 'click' &&
		(event.target.closest('[data-modal-close]') || !event.target.closest('.content-popup'))
	) {
		const openPopup = document.querySelector('.content-popup.--open')
		closePopup(openPopup)
	}
}

function isTriggerKey(code) {
	let isTrigger = false
	switch (code.toLowerCase()) {
		case 'escape':
		case 'enter':
		case 'space':
			isTrigger = true
			break
	}
	return isTrigger
}


function togglePaddingFixedElement(widthScroll) {
	const fixedElements = document.querySelectorAll('[data-fixed]')
	if (!fixedElements.length) return
	if (widthScroll)
		fixedElements.forEach(element => element.style.paddingRight = `${widthScroll}px`)
	else
		fixedElements.forEach(element => element.style.removeProperty('padding-right'))
}