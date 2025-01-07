// https://api.thecatapi.com/v1/images/search?page=1&limit=10&has_breeds=1&breed_ids=beng,abys&order=ASC

import { HttpRequest } from "./HttpRequest.js"
import { createSpinner, createPetCard } from "./functions.js"

export class PaginationCards {
	#currentPage
	constructor(url, amount, numberCurrentPage, numberEndPage, scrollToSelector = '') {
		this.url = url
		this.isCorrectValue(amount)
		this.amountItems = amount
		this.isLoading = false
		this.isCorrectValue(numberEndPage)
		this.endPage = numberEndPage
		this.isCorrectValue(numberCurrentPage)
		if (numberCurrentPage > numberEndPage)
			throw new Error(`The current pages - ${numberCurrentPage} should not be more for the final - ${numberEndPage}!`)
		this.#currentPage = numberCurrentPage
		this.scrollToSelector = scrollToSelector
	}

	// get, set ===========================================================================
	get CurrentPage() {
		return this.#currentPage
	}
	set CurrentPage(newValue) {
		if (newValue < 1 || newValue > this.endPage)
			return
		this.#currentPage = newValue
		this.elementCurrentPage.textContent = this.#currentPage
		this.fillList()
	}

	toggleBlockButtons() {
		if (this.CurrentPage === 1 || this.isLoading) {
			this.buttonToStartPage.setAttribute('disabled', true)
			this.buttonToPrevPage.setAttribute('disabled', true)
		} else {
			this.buttonToStartPage.removeAttribute('disabled')
			this.buttonToPrevPage.removeAttribute('disabled')
		}

		if (this.CurrentPage === 20 || this.isLoading) {
			this.buttonToEndPage.setAttribute('disabled', true)
			this.buttonToNextPage.setAttribute('disabled', true)
		} else {
			this.buttonToEndPage.removeAttribute('disabled')
			this.buttonToNextPage.removeAttribute('disabled')
		}
	}

	// functions ===========================================================================
	isCorrectValue(value) {
		if (value < 1)
			throw new RangeError("The number should be more than 1!")
		return true
	}

	async fillList() {
		this.listElement.innerHTML = ''
		this.isLoading = true
		this.toggleBlockButtons()
		const spinner = createSpinner()
		this.listElement.append(spinner)
		try {
			let data = await HttpRequest.getData(`${this.url}&page=${this.currentPage}&limit=${this.amountItems}`)
			data = await HttpRequest.transformData(data, 'https://api.thecatapi.com/v1/images')
			spinner.remove()
			data.forEach(info => {
				this.listElement.append(createPetCard(info))
			})
			this.isLoading = false
			this.toggleBlockButtons()
		} catch (error) {
			console.error(error.message)
		}
	}

	catchChangePage(event) {
		const type = event.detail.type
		if (type === 'start-page')
			this.CurrentPage = 1
		else if (type === 'end-page')
			this.CurrentPage = this.endPage
		else
			this.CurrentPage += type === 'prev-page' ? -1 : 1
	}

	createActions() {
		const actions = document.createElement('div')
		actions.className = 'pagination__actions'
		actions.setAttribute('data-goto-parent', '')
		actions.addEventListener('pagination-action', this.catchChangePage.bind(this))

		this.buttonToStartPage = this.createButton('button', true, 2, 'start-page')
		this.buttonToPrevPage = this.createButton('button', true, 1, 'prev-page')
		this.elementCurrentPage = this.createButton('div')
		this.buttonToEndPage = this.createButton('button', false, 1, 'next-page')
		this.buttonToNextPage = this.createButton('button', false, 2, 'end-page')

		actions.append(this.buttonToStartPage)
		actions.append(this.buttonToPrevPage)
		actions.append(this.elementCurrentPage)
		actions.append(this.buttonToEndPage)
		actions.append(this.buttonToNextPage)

		return actions
	}

	createButton(tag = 'button', isLeftButton = false, amountArrow = 1, nameAction = '') {
		const button = document.createElement(tag)
		button.className = tag === 'button' ? 'pagination__button' : 'pagination__current-page'
		button.classList.add('button-circle')

		if (tag === 'button') {
			button.type = 'button'
			if (this.scrollToSelector)
				button.setAttribute('data-goto', this.scrollToSelector)
			if (isLeftButton)
				button.classList.add('button-circle--left')
			for (let indexArrow = 0; indexArrow < amountArrow; indexArrow++) {
				const img = document.createElement('img')
				img.src = 'img/icons/arrow-pagination.svg'
				img.alt = 'icon arrow'
				img.setAttribute('aria-hidden', true)
				button.append(img)
			}
			button.addEventListener('click', e => this.createNewEvent(e.target, nameAction))
		} else button.textContent = this.CurrentPage

		return button
	}

	createNewEvent(target, nameAction) {
		const newEvent = new CustomEvent('pagination-action', {
			detail: { type: nameAction },
			bubbles: true
		})
		target.dispatchEvent(newEvent)
	}

	render(selectorContainer, bemClass) {
		let container
		if (selectorContainer) {
			container = document.querySelector(selectorContainer)
			if (!container)
				throw new ReferenceError(`Not found element by selector - ${selectorContainer}`);
		}

		const wrapper = document.createElement('div')
		wrapper.className = bemClass ? `${bemClass}__pagination pagination` : 'pagination'
		wrapper.append(this.createActions())

		const list = document.createElement('div')
		list.className = 'pagination__items'
		list.setAttribute('data-modal-parent', '')
		wrapper.prepend(list)
		this.listElement = list
		this.fillList()

		if (container)
			container.append(wrapper)
		return wrapper
	}

}

export function initPagination() {
	if (!document.querySelector('.our-friends__container')) return
	const pagination = new PaginationCards('https://api.thecatapi.com/v1/images/search?order=ASC&has_breeds=1&breed_ids=beng,abys', 10, 1, 20, '.our-friends')
	pagination.render('.our-friends__container')
}