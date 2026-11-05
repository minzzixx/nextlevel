const productList = document.querySelector('.products');
const detail = document.querySelector('.product-detail');
let previousTrigger = null;
let selectedCategory = '전체';
let listPosition = { x: 0, y: 0 };
const categoryButtons = document.querySelectorAll('.category');

function selectCategory(category) {
  selectedCategory = category;
  let visibleCount = 0;
  for (const card of productList.children) {
    card.hidden = category !== '전체' && card.dataset.category !== category;
    if (!card.hidden) visibleCount++;
  }
  for (const button of categoryButtons) {
    const selected = button.dataset.category === selectedCategory;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  }
  productList.setAttribute('aria-label', `${category} 상품 ${visibleCount}종`);
}

for (const button of categoryButtons) {
  button.addEventListener('click', () => selectCategory(button.dataset.category));
}

function openProduct(product, photo, trigger) {
  previousTrigger = trigger;
  listPosition = { x: window.scrollX, y: window.scrollY };
  detail.querySelector('#detail-title').textContent = product.name;
  detail.querySelector('.detail-category').textContent = product.category;
  detail.querySelector('.detail-usage').textContent = product.usage;
  detail.querySelector('.detail-story').textContent = product.story;
  let detailPhoto = photo.cloneNode(true);
  if (product.detailImage) {
    detailPhoto = document.createElement('img');
    detailPhoto.className = 'detail-poster';
    detailPhoto.src = product.detailImage;
    detailPhoto.alt = product.detailAlt || product.alt;
    detailPhoto.decoding = 'async';
  }
  detail.querySelector('.detail-image').replaceChildren(detailPhoto);
  document.body.style.top = `-${listPosition.y}px`;
  document.body.classList.add('detail-open');
  detail.showModal();
  detail.scrollTop = 0;
}

detail.querySelector('.detail-close').addEventListener('click', () => detail.close());
// Native dialog also supports Escape and keeps keyboard focus inside the detail.
detail.addEventListener('close', () => {
  document.body.classList.remove('detail-open');
  document.body.style.top = '';
  previousTrigger?.focus({ preventScroll: true });
  window.scrollTo({ left: listPosition.x, top: listPosition.y, behavior: 'instant' });
});

for (const product of window.products) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.productId = product.id;
  card.dataset.category = product.category;
  const photo = document.createElement('div');
  photo.className = 'photo';
  if (product.image) {
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.alt;
    image.decoding = 'async';
    if (product.crop) {
      const [x, y, width, height] = product.crop;
      photo.classList.add('photo-crop');
      photo.style.aspectRatio = `${width} / ${height}`;
      image.style.width = `${product.sourceSize[0] / width * 100}%`;
      image.style.height = `${product.sourceSize[1] / height * 100}%`;
      image.style.left = `${-x / width * 100}%`;
      image.style.top = `${-y / height * 100}%`;
    }
    photo.append(image);
  } else {
    const pending = document.createElement('span');
    pending.textContent = '그립톡 사진 준비 중';
    photo.append(pending);
  }
  if (product.additionalImages) {
    photo.classList.add('photo-sticker-set');
    const accents = document.createElement('div');
    accents.className = 'sticker-accents';
    for (const asset of product.additionalImages) {
      const image = document.createElement('img');
      image.src = asset.image;
      image.alt = asset.alt;
      image.decoding = 'async';
      accents.append(image);
    }
    photo.append(accents);
  }
  if (product.limited) {
    const badge = document.createElement('span');
    badge.className = 'limited-badge';
    badge.textContent = '한정판';
    photo.append(badge);
  }
  const title = document.createElement('h2');
  title.textContent = product.name;
  title.id = `product-${product.id}`;
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'card-trigger';
  trigger.setAttribute('aria-labelledby', title.id);
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.append(photo, title);
  trigger.addEventListener('click', () => openProduct(product, photo, trigger));
  card.append(trigger);
  productList.append(card);
}
selectCategory(selectedCategory);
