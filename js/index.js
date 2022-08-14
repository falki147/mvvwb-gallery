(function (document, PhotoSwipe, PhotoSwipeUI_Default) {
    var pswp = document.getElementsByClassName("pswp");

    if (pswp.length === 0) {
        var html = '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button> <button class="pswp__button pswp__button--share" title="Share"></button> <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button> <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"> </button> <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"> </button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>';
        document.write(html);
        pswp = document.getElementsByClassName("pswp");
    }

    var items = [];
    var galleries = document.getElementsByClassName("gallery");

    for (var i = 0; i < galleries.length; ++i) {
        var images = galleries[i].getElementsByTagName("img");
        var j;

        for (j = 0; j < images.length; ++j) {
            var src = images[j].getAttribute("data-src");
            var width = images[j].getAttribute("data-width");
            var height = images[j].getAttribute("data-height");

            if (!src || !width || !height)
                continue;

            items.push({
                src: src, w: parseInt(width), h: parseInt(height)
            });
        }

        var links = galleries[i].getElementsByTagName("a");

        for (j = 0; j < links.length; ++j) {
            var index = items.findIndex(function (item) {
                return decodeURI(item.src) == decodeURI(links[j].href);
            });
            
            if (index < 0)
                continue;

            links[j].addEventListener("click", function (index, e) {
                var options = {
                    index: index,
                    history: false
                };

                var gal = new PhotoSwipe(pswp[0], PhotoSwipeUI_Default, items, options);
                gal.init();

                e.preventDefault();
            }.bind(null, index));
        }
    }
})(document, PhotoSwipe, PhotoSwipeUI_Default);
