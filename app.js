// css
import './styles/reset.css';
import './styles/style.scss';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import imgsLoaded from 'imagesloaded';

gsap.registerPlugin(ScrollTrigger);

function initLoadImages() {
  const loader = document.querySelector('#loader');
  const loaderBar = document.querySelector('#loader .loader__line__bar');

  const imagesLoaded = imgsLoaded(document.querySelectorAll('img'), {}, () => {
    console.log('all images loaded');

    loader.classList.add('complete');
  });

  const totalImages = imagesLoaded.images.length;
  let currentImagesLoaded = 0;
  let percentage = 1;

  imagesLoaded.on('progress', (instance, image) => {
    currentImagesLoaded = imagesLoaded.progressedCount;
    percentage = Math.ceil((currentImagesLoaded / totalImages) * 100);

    loaderBar.style.width = `${percentage}%`;
  });
}

function initScroll() {
  const lenis = new Lenis({ smoothWheel: true, lerp: 0.05 });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

function initImagesAppearOnScroll() {
  const images = document.querySelectorAll('.photo__grid__img');

  images.forEach((img) => {
    const tl = gsap.timeline({
      defaults: {
        duration: 0.8,
        ease: 'power2.inOut',
      },
      scrollTrigger: {
        start: 'top 80%',
        trigger: img,
      },
    });

    tl.fromTo(
      img,
      { scale: 1.025, y: 45, autoAlpha: 0 },
      { scale: 1, y: 0, autoAlpha: 1 }
    );
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLoadImages();
  initScroll();
  initImagesAppearOnScroll();
});
