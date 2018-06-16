// ищем все карточки товара по всему дереву
var product = document.querySelectorAll('.product__wrapper');
var offerItem = document.querySelectorAll('.offer__item');
var offerLink = document.querySelectorAll('.offer__link');
var subtitle = document.querySelectorAll('.product__subtitle');
var frame = document.querySelectorAll('.product__frame');

// ловим ховер над карточкой
frame.addEventListener('mouseover', function(){
  if (frame.classList.contains('product__frame--default')) {
    frame.classList.remove('product__frame--default');
    frame.classList.add('product__frame--hover');
  }
  });