import imgsLoaded from 'imagesloaded';

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
