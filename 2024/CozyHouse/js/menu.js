import { toggleLockBody, unBlockBody } from './functions.js'

export const initMenu = (delay = 500) => {
	const burgerMenu = document.querySelector('.icon-menu')
	if (!burgerMenu) return
	burgerMenu.addEventListener('click', () => toggleMenuOpen(delay))

	const mediaOrientation = window.matchMedia('(orientation: landscape)')
	mediaOrientation.addEventListener('change', changeOrientation)
}

let isLock = false

function toggleMenuOpen(delay = 500) {
	if (isLock) return
	document.documentElement.classList.toggle('menu-open')
	toggleLockBody(delay)
	isLock = true
	setTimeout(() => {
		isLock = false
	}, delay);
}

export function menuClose() {
	document.documentElement.classList.remove('menu-open')
}

function changeOrientation(e) {
	if (
		e.matches &&
		window.innerWidth > 767.98 &&
		document.documentElement.classList.contains('menu-open')
	) {
		menuClose()
		unBlockBody(0)
	}
}