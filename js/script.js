'use strict'

class GoodsItem {
  constructor(title, price) {
    this.title = title;
    this.price = price;
  }
  render() {
    return `<div class="goods-item" data-title="${this.title}" data-price="${this.price}" ><h3>${this.title}</h3><p >${this.price}</p></div>`;
  }
}

class GoodsList {
  constructor() {
    this.goods = [];
  }

  fetchGoods() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', './JSON/goods.json');
      xhr.responseType = 'text';
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();

      resolve = (content) => {
        this.goods = JSON.parse(content);
        this.render('.goods-list');
        this.summ('.header');
      };

      reject = (e) => {
        console.log(e);
      }
    });
  }

  render(selector = 'body') {
    let listHtml = '';
    this.goods.forEach(({ title, price }) => {
      const goodItem = new GoodsItem(title, price);
      listHtml += goodItem.render();
    });
    const goodList = document.querySelector(selector);
    goodList.insertAdjacentHTML('afterbegin', listHtml);
  }

  summ(selector = 'body') {
    let sum = 0;
    this.goods.forEach(({ price }) => {
      sum += price;
    });
    const header = document.querySelector(selector);
    header.insertAdjacentHTML('afterbegin', `<div class="sum-goods">Суммарная стоимость всех товаров: ${sum} &euro; </div>`);
  }

}

class CartItem {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
  fetchItem() {
    return { title: this.name, price: this.price }
  }
}

class Cart {
  constructor(items) {
    this.cart = [];
    this.items = items;
  }

  pushItems() {
    this.cart.push(this.items);
  }
}

window.onload = () => {
  new GoodsList().fetchGoods();

  const goodItems = document.querySelectorAll('.goods-item');

  goodItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      const dataTitle = e.currentTarget.getAttribute('data-title');
      const dataPrice = e.currentTarget.getAttribute('data-price');

      const cartItem = new CartItem(dataTitle, dataPrice).fetchItem();
      console.log(cartItem);

      const cart = new Cart(cartItem);
      console.log(cart.pushItems());
    })
  });

};
