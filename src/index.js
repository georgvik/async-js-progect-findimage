import axios from 'axios';

import Swal from 'sweetalert2';

let page = 1;
let perPage = 40;
const key = '39073314-4c0c083064b1c4280cbf2c6ac';
let sum = 40;

const gallery = document.querySelector('.gallery');
const input = document.querySelector('input');
const form = document.querySelector('.search-form');
const button = document.querySelector('.load-more');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Get Array data
  getImage().then(response => {
    const data = response.data.hits;
    console.log(data);
    if (data.length === 0) {
      return Swal.fire({
        title: 'Error!',
        text: 'Sorry, there are no images matching your search query. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
    alert(`Hooray! We found ${response.data.totalHits} images.`);
    let make = data
      .map(el => {
        return `<div class="photo-card">
      <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes:</b>${el.likes}
        </p>
        <p class="info-item">
          <b>Views:</b>${el.views}
        </p>
        <p class="info-item">
          <b>Comments:</b>${el.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b>${el.downloads}
        </p>
      </div>
    </div>`;
      })
      .join('');
    gallery.insertAdjacentHTML('afterbegin', make);
    button.classList.remove('in-active');
  });
});

async function getImage() {
  const q = input.value;
  return await axios(
    `https://pixabay.com/api/?key=${key}&image_type=photo&orientation=horizontal&q=${q}&safesearch=true&page=${page}&per_page=${perPage}`
  );
}

async function moreLoadImage() {
  const q = input.value;
  page = page + 1;
  return await axios(
    `https://pixabay.com/api/?key=${key}&image_type=photo&orientation=horizontal&q=${q}&safesearch=true&page=${page}&per_page=${perPage}`
  );
}
// Click button more image
button.addEventListener('click', function () {
  moreLoadImage().then(response => {
    const data = response.data.hits;
    const totalHits = response.data.totalHits;
    sum = sum + data.length;
    console.log(sum);
    if (sum >= totalHits) {
      button.classList.add('in-active');
      setTimeout(function () {
        Swal.fire({
          title: 'Warning!',
          text: "Were sorry, but you've reached the end of search results.",
          icon: 'warning',
          confirmButtonText: 'Ok',
        });
      }, 2000);
    }
    let make = data
      .map(el => {
        return `<div class="photo-card">
      <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes:</b>${el.likes}
        </p>
        <p class="info-item">
          <b>Views:</b>${el.views}
        </p>
        <p class="info-item">
          <b>Comments:</b>${el.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b>${el.downloads}
        </p>
      </div>
    </div>`;
      })
      .join('');
    gallery.insertAdjacentHTML('beforeend', make);
  });
});

input.addEventListener('change', function () {
  // Clear form
  gallery.textContent = '';
  button.classList.add('in-active');
});
