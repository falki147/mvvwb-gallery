<?php
/**
 * Renders the gallery to HTML to the output buffer
 */

if (!class_exists('MVVWBTemplateGallery')) {
    /**
     * Wraps the render function in a class
     */
    class MVVWBTemplateGallery {
        /**
         * Renders the HTML to the output buffer
         *
         * @param object[] $attachments the attached images to the gallery
         */
        public static function buildContent($attachments) {
            $args = foogallery_gallery_template_arguments();

            echo '<div class="gallery">';

            $ind = 1;

            foreach ($attachments as $attachment) {
                $url = static::getURL($attachment, $args);

                if ($url !== '') {
                    echo '<a';
                    echo ' href="', esc_url($url), '" ';
                    echo ' data-pswp-width="', esc_attr($attachment->width), '"';
                    echo ' data-pswp-height="', esc_attr($attachment->height), '"';
                    echo ' data-cropped="true"';
                    echo '>';
                }
                
                $alt = $attachment->alt;

                if ($alt === '')
                    $alt = "Bild $ind";

                $title = $attachment->caption;

                echo '<img src="', foogallery_attachment_html_image_src($attachment, $args), '"';
                echo ' alt="', esc_attr($alt), '"';

                if ($title !== '' && $title !== $alt)
                    echo ' title="', esc_attr($title), '"';

                if (!empty($args['width']) && !empty($args['height']))
                    echo " style=\"width: {$args['width']}px; height: {$args['height']}px\"";

                echo '>';

                if ($url !== '')
                    echo '</a>';

                ++$ind;
            }

            echo '</div>';
        }

        /**
         * Gets the URL from an attachment
         * 
         * @param object $attachment the attachment object
         * @param string $args the type of the attachment URL
         * @return string either the URL or an empty string
         */
        public static function getURL($attachment, $args) {
            switch ($args) {
            case 'page':
                return get_attachment_link($foogallery_attachment->ID);
            case 'custom':
                if (!isset($args['custom_link']))
                    return $attachment->custom_url;

                return $args['custom_link'];
            case 'none':
                return '';
            default:
                return $attachment->url;
            }
        }
    }
}

/** Render the gallery */
MVVWBTemplateGallery::buildContent(
    foogallery_current_gallery_attachments_for_rendering()
);
