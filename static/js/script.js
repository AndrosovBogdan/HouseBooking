document.querySelectorAll('.slider').forEach(slider => {
	const slides = slider.querySelectorAll('.slide');
	const prevBtn = slider.querySelector('.arrow.left');
	const nextBtn = slider.querySelector('.arrow.right');
	let current = 0;

	const showSlide = (index) => {
		slides.forEach((slide, i) => {
			slide.classList.toggle('active', i === index);
		});
	};

	prevBtn.addEventListener('click', () => {
		current = (current - 1 + slides.length) % slides.length;
		showSlide(current);
	});

	nextBtn.addEventListener('click', () => {
		current = (current + 1) % slides.length;
		showSlide(current);
	});
});

function filterCards() {
	const searchText = document.getElementById('search-input').value.toLowerCase();
	const cards = document.querySelectorAll('.card');

	cards.forEach(card => {
		const name = card.querySelector('.name').textContent.toLowerCase();
		if (name.includes(searchText)) {
			card.style.display = 'flex';
		} else {
			card.style.display = 'none';
		}
	});
}

document.getElementById('search-btn').addEventListener('click', filterCards);
document.getElementById('search-input').addEventListener('keypress', e => {
	if (e.key === 'Enter') {
		filterCards();
	}
});

document.addEventListener('DOMContentLoaded', () => {
	const cartBtn = document.querySelector('.cart');
	const cartModal = document.getElementById('cart-modal');
	const closeCartBtn = document.querySelector('.close-cart');
	const cartItemsContainer = document.getElementById('cart-items');
	const cartTotal = document.getElementById('cart-total');
	const cartCounter = document.querySelector('.cart span');
	const checkoutForm = document.getElementById('checkout-form');

	let cart = [];

	function updateCartCounter() {
		const count = cart.reduce((sum, item) => sum + item.quantity, 0);
		cartCounter.textContent = count;
	}

	function updateCartTotal() {
		const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		cartTotal.textContent = total.toLocaleString();
	}

	function renderCartItems() {
		cartItemsContainer.innerHTML = '';
		cart.forEach((item, index) => {
			const itemTotal = (item.price * item.quantity).toLocaleString();
			const div = document.createElement('div');
			div.classList.add('cart-item');
			div.innerHTML = `
				<img src="${item.image}" alt="photo" width="60" height="60" style="object-fit: cover; border-radius: 6px;">
				<div class="cart-item-details" style="flex:1; margin-left: 10px;">
					<div><strong>${item.name}</strong></div>
					<div>Ціна: $${item.price}</div>
					<div>Кількість: ${item.quantity}</div>
					<div>Разом: $${itemTotal}</div>
				</div>
				<div class="cart-item-controls">
					<button class="decrease" data-index="${index}">-</button>
					<button class="increase" data-index="${index}">+</button>
					<button class="remove" data-index="${index}"><img src="../images/bin.png" class="bin-icon"></button>
				</div>
			`;
			cartItemsContainer.appendChild(div);
		});
	}

	function openCart() {
		renderCartItems();
		updateCartTotal();
		cartModal.style.display = 'flex';
	}

	function closeCart() {
		cartModal.style.display = 'none';
	}

	cartBtn.addEventListener('click', openCart);
	closeCartBtn.addEventListener('click', closeCart);

	window.addEventListener('click', (e) => {
		if (e.target === cartModal) closeCart();
	});

	document.querySelectorAll('.add-btn').forEach(btn => {
		btn.addEventListener('click', () => {
			const card = btn.closest('.card-info');
			const cardWrapper = btn.closest('.card');
			const name = card.querySelector('.name').textContent;
			const price = parseFloat(card.querySelector('.price').textContent.replace(/[^\d.]/g, ''));
			const image = cardWrapper.querySelector('.slide').src;

			const existingItem = cart.find(item => item.name === name);
			if (existingItem) {
				existingItem.quantity++;
			} else {
				cart.push({ name, price, quantity: 1, image });
			}

			updateCartCounter();
		});
	});

	cartItemsContainer.addEventListener('click', (e) => {
	const btn = e.target.closest('button');
	if (!btn) return;

	const index = parseInt(btn.dataset.index);
	if (isNaN(index)) return;

	if (btn.classList.contains('increase')) {
		cart[index].quantity++;
	} else if (btn.classList.contains('decrease')) {
		cart[index].quantity--;
		if (cart[index].quantity <= 0) cart.splice(index, 1);
	} else if (btn.classList.contains('remove')) {
		cart.splice(index, 1);
	}
	updateCartCounter();
	renderCartItems();
	updateCartTotal();
});


	checkoutForm.addEventListener('submit', function (e) {
		e.preventDefault();

		const formData = new FormData(checkoutForm);
		const data = Object.fromEntries(formData.entries());

		if (cart.length === 0) {
			alert('Кошик порожній!');
			return;
		}

		const orderDetails = cart.map(item =>
			`${item.name} — ${item.quantity} x $${item.price} = $${item.price * item.quantity}`
		).join('\n');

		const summary = `
Дякуємо за замовлення, ${data.firstName} ${data.lastName}!
Ваші товари:
${orderDetails}

Сума: $${cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString()}

Контакти:
	Рік народження: ${data.birthYear}
	Телефон: ${data.phone}
	Email: ${data.email}
`;

		alert(summary);

		cart.length = 0;
		updateCartCounter();
		renderCartItems();
		updateCartTotal();
		checkoutForm.reset();
		closeCart();
	});
});

document.getElementById('start-btn').addEventListener('click', () => {
	const welcome = document.getElementById('welcome');
	welcome.style.transform = 'translateY(-100vh)';
});
