import PhotoSwipeLightbox from 'photoswipe/dist/photoswipe-lightbox.esm';
import '../style/style.scss';

for (const gallery of document.querySelectorAll('.gallery')) {
  const lightbox = new PhotoSwipeLightbox({
    gallery,
    children: 'a',
    pswpModule: () => import('photoswipe'),
    loop: false
  });
  lightbox.init();
}
