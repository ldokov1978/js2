'use strict'

const goods = [
  { title: 'Shirt', price: 150 },
  { title: 'Socks', price: 50 },
  { title: 'Jacket', price: 350 },
  { title: 'Shoes', price: 250 },
  {},
];

const renderGoodsItem = (title='Jeans', price=500) => {
  return `<div class="goods-item"><h3>${title}</h3><p>&euro; ${price}</p></div>`;
};

const renderGoodsList = (list) => {
  document.querySelector('.goods-list').innerHTML = (list.map(item => renderGoodsItem(item.title, item.price))).join('');
}

renderGoodsList(goods);