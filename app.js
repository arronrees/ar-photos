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

function initCursorFollow() {
  const cursor = document.querySelector('#cursor');
  const cursorIconOpen = document.querySelector('#cursor .cursor__icon--open');
  const cursorIconClose = document.querySelector(
    '#cursor .cursor__icon--close'
  );

  let cursorX = 0;
  let cursorY = 0;

  let ballX = 0;
  let ballY = 0;

  let speed = 0.1;

  function animate() {
    let distX = cursorX - ballX;
    let distY = cursorY - ballY;

    ballX = ballX + distX * speed;
    ballY = ballY + distY * speed;

    cursor.style.left = `${ballX}px`;
    cursor.style.top = `${ballY}px`;

    requestAnimationFrame(animate);
  }

  animate();

  function cursorFollow({ pageX, pageY, target }) {
    cursorX = pageX;
    cursorY = pageY;

    if (target.classList.contains('image__popup__box')) {
      cursor.classList.add('cursor--img');
    } else {
      cursor.classList.remove('cursor--img');
    }

    if (target.classList.contains('photo__container__cover')) {
      cursor.classList.add('cursor--icon--close');
      cursorIconClose.classList.add('cursor__icon--show');
    } else {
      cursor.classList.remove('cursor--icon--close');
      cursorIconClose.classList.remove('cursor__icon--show');
    }

    if (target.classList.contains('photo__grid__img')) {
      cursor.classList.add('cursor--icon--open');
      cursorIconOpen.classList.add('cursor__icon--show');
    } else {
      cursor.classList.remove('cursor--icon--open');
      cursorIconOpen.classList.remove('cursor__icon--show');
    }
  }

  document.addEventListener('mousemove', cursorFollow);
}

function imagesAppearOnScroll() {
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

function imagePopup() {
  const container = document.querySelector('#photo__container');
  const containerCover = container.querySelector('.photo__container__cover');
  const popup = container.querySelector('.image__popup__container');
  const popupImage = popup.querySelector('.image__popup__box');
  const popupCover = popup.querySelector('.image__popup__cover');

  gsap.set([container, containerCover, popup], {
    xPercent: -105,
    scale: 1,
  });

  const images = document.querySelectorAll('.photo__grid__img');

  // open popup
  images.forEach((img) => {
    const imageSrc = img.querySelector('img').src;
    const imageWidth = img.querySelector('img').naturalWidth;
    const imageHeight = img.querySelector('img').naturalHeight;

    const opentl = gsap.timeline({
      defaults: { duration: 0.725, ease: 'power1.inOut' },
    });

    img.addEventListener('click', (e) => {
      document.body.style.overflowY = 'hidden';

      let height = 0;
      let width = 0;

      if (imageWidth > imageHeight) {
        width = '80vw';
        height = `${(imageHeight / imageWidth) * 100 * 0.8}vw`;
      } else {
        height = '80vh';
        width = `${(imageWidth / imageHeight) * 100 * 0.8}vh`;
      }

      if (imageWidth === 0 || imageHeight === 0) {
        width = '80vw';
        height = '80vh';
      }

      popupImage.style.backgroundImage = `url('${imageSrc}')`;
      popup.style.width = `${width}`;
      popup.style.height = `${height}`;

      opentl
        .fromTo(
          [container, containerCover],
          { xPercent: -105, skewX: 9 },
          {
            xPercent: 0,
            skewX: 0,
            stagger: 0.08,
          }
        )
        .fromTo(
          popup,
          { xPercent: -105, skewX: 9 },
          {
            xPercent: 0,
            skewX: 0,
            stagger: 0.08,
          },
          '-=0.23'
        )
        .fromTo(popupCover, { xPercent: 0 }, { xPercent: 105 }, '-=0.18')
        .fromTo(popupImage, { scale: 1.15 }, { scale: 1 }, '-=0.725');
    });
  });

  const closeTl = gsap.timeline({
    defaults: { duration: 0.5, ease: 'power1.inOut' },
  });

  // close popup
  container.addEventListener('click', ({ target }) => {
    if (target === containerCover) {
      document.body.style.overflowY = 'visible';

      closeTl
        .fromTo(popupCover, { xPercent: -105 }, { xPercent: 0 })
        .fromTo(
          popup,
          {
            xPercent: 0,
            skewX: 0,
            stagger: 0.08,
          },
          { xPercent: 105, skewX: -9 },
          '-=0.28'
        )
        .fromTo(
          [container, containerCover],
          {
            xPercent: 0,
            skewX: 0,
            stagger: 0.05,
          },
          { xPercent: 105, skewX: -9 }
        )
        .to([container, containerCover], { skewX: 0 });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLoadImages();
  initScroll();
  initCursorFollow();
  imagesAppearOnScroll();
  imagePopup();
});
