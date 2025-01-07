export function initPhoneNumber() {
	const phones = document.querySelectorAll('[data-phone]')
	if (!phones.length) return
	phones.forEach(number => {
		let text = number.textContent.trim().substring(0, 20)
		if (!text) text = '0'.repeat(16)
		const delayAnim = number.hasAttribute('data-delay') ?
			parseFloat(number.getAttribute('data-delay')) : 0.02
		if (isNaN(delayAnim))
			throw new SyntaxError("A positive number was expected!");
		number.addEventListener('click', copyCard)
		number.textContent = ''
		transformText(text, delayAnim).forEach(symbol => number.append(symbol))
	})
}

function transformText(text, delayAnimation) {
	const regexp = /\d{4}\B/g
	return text.replace(regexp, '$& ').split('')
		.map((symbol, index) => createSpan(symbol, index, delayAnimation))
}

function createSpan(symbol, index, delayAnimation = 0.02) {
	const span = document.createElement('span')
	span.style.display = symbol === ' ' ? 'inline' : 'inline-block'
	span.style.animationDelay = `${index * delayAnimation}s`
	span.textContent = symbol
	return span
}

function copyCard(e) {
	const spans = e.currentTarget.children
	const text = Array.from(spans).reduce((str, span) => `${str}${span.textContent}`, '')
	navigator.clipboard.writeText(text)
	showMessage('Text was copied!')
}


function showMessage(textContent = 'message') {
	if (document.querySelector('.message')) return
	const message = document.createElement('div')
	message.className = 'message'
	message.textContent = textContent
	document.body.append(message)
	setTimeout(() => {
		message.remove()
	}, 2900);
}