// css
import './styles/reset.css';
import './styles/style.scss';

// js
import { initScroll } from './js/scroll';
import { initLoadImages } from './js/images';

document.addEventListener('DOMContentLoaded', () => {
  initLoadImages();
  initScroll();
});
