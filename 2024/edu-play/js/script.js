"use strict"

window.addEventListener("load", windowLoaded)

const mediaMobile = window.matchMedia(`(min-width: ${767.98 / 16}em)`)
const mediaMobileHeight = window.matchMedia(`(min-height: ${500 / 16}em)`)
const mediaOrientation = window.matchMedia('(orientation: portrait)')
function windowLoaded() {

	document.addEventListener("click", documentActions)
	mediaMobile.addEventListener('change', e => {
		initWatcher(e.matches)
		if (e.matches) {
			window.addEventListener('scroll', changeHeaderHeight)
			changeHeaderHeight()
		} else {
			window.removeEventListener('scroll', changeHeaderHeight)
			header.classList.remove('--less')
		}

		if (e.matches && mediaOrientation.matches ||
			!mediaOrientation.matches && mediaMobileHeight.matches)
			initAnimateText()
	})
	const header = document.querySelector('header')
	if (header && mediaMobile.matches) {
		window.addEventListener('scroll', changeHeaderHeight)
		changeHeaderHeight()
	}

	// inits modules
	initRating()
	initSpollers()
	initTabs()
	initWatcher(mediaMobile.matches)
	if (mediaMobile.matches && mediaOrientation.matches ||
		!mediaOrientation.matches && mediaMobileHeight.matches)
		initAnimateText()

	mediaOrientation.addEventListener('change', e => {
		if (e.matches && mediaMobile.matches ||
			!e.matches && mediaMobileHeight.matches
		)
			initAnimateText()

		if (!e.matches && mediaMobile.matches && document.documentElement.classList.contains('menu-open')) {
			document.documentElement.classList.remove('menu-open', 'lock')
		}
	})

	new Swiper('.bottom-library__slider--games', {
		pagination: {
			el: '.pagination-library__item--games',
			renderBullet: function (index, className) {
				return `<button type="button" aria-label="Go to slide №${index + 1}" class="${className}"><span>${index + 1}</span></button>`
			},
			clickable: true
		},
		speed: 600,
		spaceBetween: 20,
		breakpoints: {
			320: {
				slidesPerView: 1.05,
				slidesPerGroup: 1,
			},
			480: {
				slidesPerView: 1.7,
				slidesPerGroup: 1,
			},
			680: {
				slidesPerView: 2.2,
				slidesPerGroup: 2,
			},
			768: {
				slidesPerView: 2.5,
				slidesPerGroup: 2,
			},
			992: {
				slidesPerView: 'auto',
				slidesPerGroup: 3,
				spaceBetween: 30,
				speed: 800,
			}
		}
	});
	new Swiper('.bottom-library__slider--sheets', {
		pagination: {
			el: '.pagination-library__item--sheets',
			renderBullet: function (index, className) {
				return `<button type="button" aria-label="Go to slide №${index + 1}" class="${className}"><span>${index + 1}</span></button>`
			},
			clickable: true
		},
		speed: 600,
		spaceBetween: 20,
		breakpoints: {
			320: {
				slidesPerView: 1.05,
				slidesPerGroup: 1,
			},
			480: {
				slidesPerView: 1.7,
				slidesPerGroup: 1,
			},
			680: {
				slidesPerView: 2.2,
				slidesPerGroup: 2,
			},
			768: {
				slidesPerView: 2.5,
				slidesPerGroup: 2,
			},
			992: {
				slidesPerView: 'auto',
				slidesPerGroup: 3,
				spaceBetween: 30,
				speed: 800,
			}
		}
	});

	function changeHeaderHeight() {
		if (scrollY > 300 && !header.classList.contains('--less'))
			header.classList.add('--less')
		else if (scrollY < 300 && header.classList.contains('--less'))
			header.classList.remove('--less')
	}
}

function documentActions(e) {
	const target = e.target
	if (target.closest("[data-goto]")) {
		const selector = target.closest("[data-goto]").dataset.goto
		if (selector && document.querySelector(selector)) {
			const searchBlock = document.querySelector(selector)
			const headerHeight = document.querySelector("header")?.offsetHeight || 0
			const topSearchBlock = searchBlock.getBoundingClientRect().top - headerHeight

			if (document.documentElement.classList.contains("menu-open")) {
				document.documentElement.classList.remove("menu-open", "lock")
			}

			window.scrollBy({
				top: topSearchBlock,
				behavior: "smooth",
			})
		}
		e.preventDefault()
	}

	// menu burger
	if (target.closest(".icon-menu")) {
		document.documentElement.classList.toggle("menu-open")
		document.documentElement.classList.toggle("lock")
	}
}

// rating ================================================
function initRating() {
	const ratings = document.querySelectorAll(".rating")
	if (ratings.length > 0) {
		ratings.forEach(rating => {
			const value = rating.dataset.rating ? parseFloat(rating.dataset.rating) : 0
			const activeRating = rating.querySelector(".rating__active")
			activeRating.style.width = `${value / 0.05}%`
		})
	}
}

// spollers
function initSpollers() {
	const spollers = document.querySelectorAll("[data-spollers]")
	if (!spollers.length) return

	spollers.forEach((spollerBlock) => {
		initSpollerBlock(spollerBlock)
		spollerBlock.addEventListener("click", setSpollerAction)
	})
}

function initSpollerBlock(spollerBlock) {
	const buttons = spollerBlock.querySelectorAll("[data-spoller]")
	if (!buttons.length) return

	buttons.forEach((item) => {
		if (!item.classList.contains("--active")) {
			item.nextElementSibling.hidden = true
		}
	})
}

function setSpollerAction(e) {
	const currentElement = e.target
	if (!currentElement.closest("[data-spoller]")) return

	const title = currentElement.closest("[data-spoller]")
	const spollerWrapper = title.closest("[data-spollers]")
	const isAccordion = spollerWrapper.hasAttribute("data-accordion")

	if (!spollerWrapper.querySelectorAll("._slide").length) {
		if (isAccordion && !title.classList.contains("--active")) {
			hideSpollers(spollerWrapper)
		}
		title.classList.toggle("--active")
		slideToggleSpoller(title.nextElementSibling, 500)
	}
}

function hideSpollers(spollerWrapper) {
	const spoller = spollerWrapper.querySelector(["[data-spoller].--active"])
	if (spoller) {
		spoller.classList.remove("--active")
		slideUp(spoller.nextElementSibling, 500)
	}
}

function slideUp(spoller, duration = 500) {
	if (spoller.classList.contains("_slide")) return
	spoller.classList.add("_slide")
	spoller.style.transitionProperty = "height, padding, margin"
	spoller.style.transitionDuration = `${duration}ms`
	spoller.style.height = `${spoller.offsetHeight / 16}rem`
	spoller.offsetHeight
	spoller.style.overflow = "hidden"
	spoller.style.height = 0
	spoller.style.paddingBlock = 0
	spoller.style.marginBlock = 0
	setTimeout(() => {
		spoller.hidden = true
		spoller.style.removeProperty("height")
		spoller.style.removeProperty("padding-block")
		spoller.style.removeProperty("margin-block")
		spoller.style.removeProperty("overflow")
		spoller.style.removeProperty("transition-duration")
		spoller.style.removeProperty("transition-property")
		spoller.classList.remove("_slide")
	}, duration)
}

function slideDown(spoller, duration = 500) {
	if (spoller.classList.contains("_slide")) return
	spoller.classList.add("_slide")
	if (spoller.hidden) {
		spoller.hidden = false
	}

	const height = spoller.offsetHeight

	spoller.style.height = `${spoller.offsetHeight / 16}rem`
	spoller.style.overflow = "hidden"
	spoller.style.height = 0
	spoller.style.paddingBlock = 0
	spoller.style.marginBlock = 0
	spoller.offsetHeight
	spoller.style.transitionProperty = "height, padding, margin"
	spoller.style.transitionDuration = `${duration}ms`
	spoller.style.height = `${height / 16}rem`
	spoller.style.removeProperty("padding-block")
	spoller.style.removeProperty("margin-block")
	setTimeout(() => {
		spoller.style.removeProperty("height")
		spoller.style.removeProperty("overflow")
		spoller.style.removeProperty("transition-duration")
		spoller.style.removeProperty("transition-property")
		spoller.classList.remove("_slide")
	}, duration)
}

function slideToggleSpoller(spoller, duration) {
	if (spoller.hidden) {
		slideDown(spoller, duration)
	} else {
		slideUp(spoller, duration)
	}
}

// tabs
function initTabs() {
	const buttons = document.querySelectorAll('[data-tab-index]')
	const tabBlocks = document.querySelectorAll('[data-tab]')
	const pagination = document.querySelectorAll('.pagination-library__item');
	const container = document.querySelector('.library');
	container.addEventListener('click', e => {
		const target = e.target;
		if (target.closest('[data-tab-index]')) {
			const currentButton = target.closest('[data-tab-index]');
			toggleTabs(parseInt(currentButton.dataset.tabIndex))
		}
	})

	const activeIndexTab = sessionStorage.getItem('tabIndex') ?
		parseInt(sessionStorage.getItem('tabIndex')) : 0
	toggleTabs(activeIndexTab)
	tabBlocks[activeIndexTab].style.animation = 'none'
	if (mediaMobile.matches) {
		tabBlocks[activeIndexTab].style.transform = 'translate(-12%, 0)'
		tabBlocks[activeIndexTab].style.opacity = '0'
		tabBlocks[activeIndexTab].style.transitionProperty = 'transform, opacity'
		tabBlocks[activeIndexTab].style.transitionDuration = '0.6s, 0.6s'
	}

	function toggleTabs(currentIndex = 0) {
		buttons.forEach((button, i) => {
			if (i !== currentIndex) {
				tabBlocks[i].style.display = 'none'
				button.classList.remove('--active')
				tabBlocks[i].classList.remove('--active')
				pagination[i].classList.remove('--active')
			}
		});
		tabBlocks[currentIndex].style.display = 'block'
		tabBlocks[currentIndex].classList.add('--active')
		pagination[currentIndex].classList.add('--active')
		buttons[currentIndex].classList.add('--active')
		tabBlocks[currentIndex].style.removeProperty('animation')
		sessionStorage.setItem('tabIndex', currentIndex)
	}

}

function initWatcher(matches) {
	const items = document.querySelectorAll('[data-watch]')
	if (!items.length) return
	const options = {
		root: null,
		rootMargin: '0px 0px 0px 0px',
		threshold: '0.6'
	}
	const observer = new IntersectionObserver(addClassWatchingSection, options)
	if (matches)
		items.forEach(item => observer.observe(item))
	else
		items.forEach(item => observer.unobserve(item))

	function addClassWatchingSection(entries, observer) {
		entries.forEach(entry => {
			const target = entry.target
			if (entry.isIntersecting) {
				target.classList.add('--watch')
				observer.unobserve(entry.target)
				if (target.classList.contains('library__bottom')) {
					const activeTab = target.querySelector('.bottom-library__tab.--active')
					if (!activeTab) return
					activeTab.style.transform = 'translate(0, 0)'
					activeTab.style.opacity = 1
					setTimeout(() => {
						activeTab.style.removeProperty('transform')
						activeTab.style.removeProperty('opacity')
						activeTab.style.removeProperty('transition-property')
						activeTab.style.removeProperty('transition-duration')
					}, 600);
				}
			}
		})
	}
}

function initAnimateText() {
	const texts = document.querySelectorAll('[data-animate-text]')
	if (texts.length) {
		texts.forEach(text => {
			const startDelay = text.dataset.animateText ? parseInt(text.dataset.animateText) : 0
			let duration
			if (text.dataset.animateDuration.includes('s'))
				duration = parseFloat(text.dataset.animateDuration) * 1000
			else
				duration = parseFloat(text.dataset.animateDuration)

			const words = text.textContent.split(' ').map((word, index) => {
				const delay = index === 0 ?
					startDelay :
					startDelay + (duration * index)
				return `<span style="transition-delay: ${delay / 1000}s; transition-duration: ${duration / 1000}s">${word}</span>`
			})
			text.style.display = 'flex'
			text.style.flexWrap = 'wrap'
			text.style.columnGap = `${5 / 16}rem`
			text.innerHTML = words.join('')
		})
	}
}

