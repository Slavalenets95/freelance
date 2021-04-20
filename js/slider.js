const slidesPerView = window.innerWidth < 430 ? 1 :
					  window.innerWidth < 580 ? 2 :
					  window.innerWidth < 960 ? 3 : 4

const swiper = new Swiper('.swiper-container', {
	direction: 'horizontal',
	loop: true,
	slidesPerView: slidesPerView,
	spaceBetween: 30,

	autoplay: {
		delay: 3000,
	},

	pagination: {
	  el: '.swiper-pagination',
	},
  
	navigation: {
	  nextEl: '.swiper-button-next',
	  prevEl: '.swiper-button-prev',
	},
  
	scrollbar: {
	  el: '.swiper-scrollbar',
	},
  });