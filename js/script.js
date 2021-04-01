'use strict'

class GoodsItem {
  constructor(title, price) {
    this.title = title;
    this.price = price;
  }
  render() {
    return `<div class="goods-item" data-title="${this.title}" data-price="${this.price}"><h3>${this.title}</h3><p >${this.price} &#8381;</p></div>`;
  }
}

class GoodsList {
  constructor(method, path) {
    this.method = method;
    this.path = path;
    this.goods = [];
  }

  fetchGoods() {
    // console.log (this.method, this.path);
    const promise = new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open(this.method, this.path);
      xhr.responseType = 'text';
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response)
          }
        };
      };
      xhr.send();
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
  };

  render(selector = 'body') {
    let listHtml = '';
    this.goods.forEach(({ title, price }) => {
      const goodItem = new GoodsItem(title, price);
      listHtml += goodItem.render();
    });
    const goodList = document.querySelector(selector);
    goodList.insertAdjacentHTML('afterbegin', listHtml);
  };

  summ() {
    let sum = 0;
    this.goods.forEach(({ price }) => {
      sum += price;
    });
    this.renderButton('.header', sum);
  };

  renderButton(selector = 'body', sum) {
    const header = document.querySelector(selector);
    header.insertAdjacentHTML('afterbegin', `<div class="sum-goods">Общая стоимость всех товаров: ${sum} &#8381;</div>`);
  };

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
  };
};

class CartItem {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  };

  fetchItem() {
    return { title: this.name, price: this.price }
  };
};

class Cart {
  constructor() {
    this.cart = [];
    this.cartButton = document.querySelector('.cart-button');
    this.cartView = document.querySelector('.cart-view');
    this.cartViewClose = document.querySelector('.cart-view-close');
    this.cartViewInfo = document.querySelector('.cart-view-info');
  };

  pushItems(items) {
    this.cart.push(items);
    this.showCart(this.cart);
    this.showButtonSumm(this.cart);
  };

  showButtonSumm(items) {
    let count = 0;
    this.cartButton.innerHTML = '';
    if (items.length > 0) {
      items.forEach((item) => {
        count += parseFloat(item.price);
      });
      this.cartButton.innerHTML = `Товаров в корзине: ${this.cart.length} на сумму: ${count} &#8381;`;
    } else {
      this.cartButton.innerHTML = `Корзина`;
    };
  };

  showCart(items) {
    const cartLength = this.cart.length;
    this.cartButton.addEventListener('click', (e) => {
      this.cartView.classList.add('cart-view-active');
      if (cartLength > 0) {
        let goods = '';
        this.cartViewInfo.innerHTML = '';
        let index = 0;
        items.forEach(({ title, price }) => {
          goods += `<li class="cart-items" data-id="${index}" title="Удалить">${title} - ${price} &#8381;</li>`;
          index++;
        });
        this.cartViewInfo.innerHTML = `<ul class="cart-list">${goods}</ul>`;
        this.delItems();
      } else {
        this.cartViewInfo.innerHTML = 'В корзине нет товаров'
      };
    });
    this.cartViewClose.addEventListener('click', (e) => {
      this.cartView.classList.remove('cart-view-active');
    });
  };

  delItems() {
    const cartItems = document.querySelectorAll('.cart-items');
    cartItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-id');
        this.cart.splice(idx, 1);
        this.cartView.classList.remove('cart-view-active');
        this.showCart(this.cart);
        this.showButtonSumm(this.cart);
      });
    });
  }
};

window.onload = () => {
  new GoodsList('GET', './JSON/goods.json').fetchGoods();
  new Cart().showCart();
};
