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
  constructor(method, path) {
    this.method = method;
    this.path = path;
    this.goods = [];
  }

  fetchGoods() {
    const promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(this.method, this.path);
      xhr.responseType = 'text';
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response)
          }
        }
        xhr.send();
      }
    });

    promise
      .then((response) => {
        this.goods = JSON.parse(response);
        this.render('.goods-list');
        this.summ();
        this.goodsSelect('.goods-item');
      })
      .catch((err) => {
        console.log(err);
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

  summ() {
    let sum = 0;
    this.goods.forEach(({ price }) => {
      sum += price;
      this.renderButton('.header', sum);
    });
  }

  renderButton(selector = 'body', sum) {
    const header = document.querySelector(selector);
    header.insertAdjacentHTML('afterbegin', `<div class="sum-goods">Суммарная стоимость всех товаров: ${sum} &euro; </div>`);
  }

  goodsSelect(selector = 'body') {
    const cart = new Cart();
    const goodItems = document.querySelectorAll(selector);
    goodItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        const dataTitle = e.currentTarget.getAttribute('data-title');
        const dataPrice = e.currentTarget.getAttribute('data-price');
        const cartItem = new CartItem(dataTitle, dataPrice).fetchItem();
        cart.pushItems(cartItem);
      })
    });
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
  constructor() {
    this.cart = [];
  }

  pushItems(items) {
    let count = 0;
    this.cart.push(items);
    //console.log(this.cart.length);
    const cartButton = document.querySelector('.cart-button');
    console.log(this.cart);
    this.cart.forEach((item) => {
      count += parseFloat(item.price);
    });
    cartButton.innerHTML = `Товаров в корзине: ${this.cart.length} на сумму: ${count} &euro;`;
  }
}

window.onload = () => {
  new GoodsList('GET', './JSON/goods.json').fetchGoods();
};
