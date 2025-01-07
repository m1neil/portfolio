import { menuClose } from "./menu.js"

export function toggleLockBody(delay = 500) {
	if (!document.documentElement.classList.contains('lock'))
		blockBody()
	else unBlockBody(delay)
}

export function blockBody() {
	document.documentElement.classList.add('lock')
}

export function unBlockBody(delay = 500) {
	setTimeout(() => {
		document.documentElement.classList.remove('lock')
	}, delay)
}

export function initGoto() {
	const parents = document.querySelectorAll('[data-goto-parent]')
	parents.forEach(parent => {
		parent.addEventListener('click', scrollToBlock)
	})
	const hash = location.hash
	if (document.querySelectorAll(hash))
		moveScroll(hash)
}

function scrollToBlock(e) {
	const target = e.target

	if (target.closest('[data-goto]')) {
		const link = target.closest('[data-goto]')
		moveScroll(link.getAttribute('data-goto'))
		e.preventDefault()
	}
}

function moveScroll(selector) {
	const element = document.querySelector(selector)
	if (!element) return
	const header = document.querySelector('.header')
	const headerHeight =
		header.getAttribute('data-scroll-height') ?
			parseInt(header.getAttribute('data-scroll-height')) : 0

	if (isNaN(headerHeight))
		throw new SyntaxError("A positive number was expected!");

	const top = element.getBoundingClientRect().top - headerHeight

	if (document.documentElement.classList.contains('menu-open')) {
		menuClose()
		unBlockBody(0)
	}

	window.scrollBy({
		top,
		behavior: 'smooth'
	})
}

export function getScrollWidth() {
	return window.innerWidth - document.body.clientWidth
}

export function createPetCard({ id, url, breeds }) {

	const article = document.createElement('article')
	article.className = "pets__card card-pet"

	const imgWrap = document.createElement('div')
	imgWrap.className = 'card-pet__img --loading'

	const img = document.createElement('img')
	img.src = url
	img.alt = 'pet'
	img.loading = 'lazy'
	img.onload = () => {
		imgWrap.classList.add('--load')
		setTimeout(() => {
			imgWrap.classList.remove('--loading')
		}, 500);
	}
	imgWrap.append(img)
	article.append(imgWrap)

	const contentBody = document.createElement('div')
	contentBody.className = 'card-pet__body'

	const namePet = breeds[0]?.name ?? 'unknown'
	const title = document.createElement('h5')
	title.className = 'card-pet__title'
	title.textContent = namePet
	contentBody.append(title)

	const button = document.createElement('button')
	button.type = 'button'
	button.className = 'card-pet__more button button--border'
	button.textContent = 'Learn more'
	button.setAttribute('data-modal-link', '#popup')
	button.setAttribute('data-image-id', id)
	button.setAttribute('aria-label', 'Open a modal window')
	contentBody.append(button)
	article.append(contentBody)
	return article
}

export function createSpinner() {
	const spinner = document.createElement('div')
	spinner.className = 'spinner'
	const image = document.createElement('img')
	image.src = 'img/spinner.svg'
	image.alt = 'Spinner loading...'
	image.setAttribute('aria-hidden', true)
	spinner.append(image)
	return spinner
}