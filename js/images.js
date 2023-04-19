import imgsLoaded from 'imagesloaded';
import { gsap } from 'gsap';

export function initLoadImages() {
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
    const result = image.isLoaded ? 'loaded' : 'broken';

    currentImagesLoaded = imagesLoaded.progressedCount;
    percentage = Math.ceil((currentImagesLoaded / totalImages) * 100);

    loaderBar.style.width = `${percentage}%`;
  });
}

export function initImageSlider() {
  const images = document.querySelectorAll('.photo__grid__img');
  const container = document.querySelector('.photo__container');
  const closeContainerBtn = container.querySelector('.photo__container__close');
  const centerSlide = container.querySelector('.center__slide');

  const allImgSrcs = [];

  let containerOpen = false;

  closeContainerBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (containerOpen) {
      containerCloseTransition();
    }
  });

  images.forEach((img) => {
    const imgSrc = img.dataset.imgSrc;
    allImgSrcs.push(imgSrc);

    img.addEventListener('click', (e) => {
      if (!containerOpen) {
        containerOpenTransition();

        document.documentElement.style.setProperty(
          '--slideBackgroundUrl',
          `url('${imgSrc}')`
        );
      }
    });
  });

  function containerOpenTransition() {
    gsap.to(container, {
      pointerEvents: 'all',
      opacity: 1,
      duration: 0.4,
      ease: 'power3.inOut',
    });

    containerOpen = true;
  }

  function containerCloseTransition() {
    gsap.to(container, {
      pointerEvents: 'none',
      opacity: 0,
      duration: 0.3,
      ease: 'power3.inOut',
    });

    containerOpen = false;
  }
}
