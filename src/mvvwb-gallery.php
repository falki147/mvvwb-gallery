<?php
/**
 * Plugin Name: MVVWB-Gallery
 * Description: Gallery Template for Foogallery for the MVVWB Site
 * Version: 1.0.0
 * Author: Florian Preinfalk
 * Author URI: http://www.preinfalk.co.at
 */

if (!defined('MVVWB_GALLERY_TEMPLATE_BASE'))
    define('MVVWB_GALLERY_TEMPLATE_BASE', plugin_dir_url(__FILE__));

if (!defined('MVVWB_GALLERY_TEMPLATE_VERSION'))
    define('MVVWB_GALLERY_TEMPLATE_VERSION', '1.0.0');

if (!class_exists('MVVWBTemplate')) {
    class MVVWBTemplate {
        function __construct() {
            // Global filters
            $this->addFilter('foogallery_gallery_templates', 'addTemplate');
            $this->addFilter('foogallery_gallery_templates_files', 'registerFile');
    
            // Specific filters
            $this->addFilter('foogallery_preview_arguments', 'previewArguments', false);
            $this->addFilter('foogallery_calculate_thumbnail_dimensions', 'calculateThumbnailDimensions', false);
            $this->addFilter('foogallery_template_thumbnail_dimensions', 'templateThumbnailDimensions', false);
            $this->addFilter('foogallery_gallery_template_arguments', 'galleryTemplateArguments', false);
            $this->addFilter('foogallery_located_template', 'locatedTemplate', false);
        }
    
        public function registerFile($extensions) {
            $extensions[] = __FILE__;
            return $extensions;
        }
    
        public function addTemplate($galleryTemplates) {
            $galleryTemplates[] = [
                'slug'            => 'mvvwb-gallery',
                'name'            => __('MVVWB', 'mvvwb-gallery'),
                'preview_support' => true,
                'preview_css'     => MVVWB_GALLERY_TEMPLATE_BASE . 'style.css',
                'fields'          => [
                    [
                        'id'      => 'thumbnail_dimensions',
                        'title'   => __('Thumbnail Size', 'mvvwb-gallery'),
                        'desc'    => __('Choose the size of your thumbs.', 'mvvwb-gallery'),
                        'type'    => 'thumb_size',
                        'default' => [
                            'width' => get_option('thumbnail_size_w'),
                            'height' => get_option('thumbnail_size_h'),
                            'crop' => true
                        ]
                    ],
                    [
                        'id'      => 'thumbnail_link',
                        'title'   => __('Thumbnail Link', 'mvvwb-gallery'),
                        'default' => 'image' ,
                        'type'    => 'thumb_link',
                        'spacer'  => '<span class="spacer"></span>',
                        'desc'    => __('You can choose to either link each thumbnail to the full size image or to the image\'s attachment page.', 'mvvwb-gallery')
                    ]
                ]
            ];
    
            return $galleryTemplates;
        }
    
        function previewArguments($args, $postData) {
            $args['thumbnail_dimensions'] = $postData[FOOGALLERY_META_SETTINGS]['default_thumbnail_dimensions'];
            return $args;
        }
    
        function calculateThumbnailDimensions($dimensions, $arguments) {
            if (array_key_exists('thumbnail_dimensions', $arguments))
                return [
                    'height' => intval($arguments['thumbnail_dimensions']['height']),
                    'width' => intval($arguments['thumbnail_dimensions']['width']),
                    'crop' => '1'
                ];
            
            return null;
        }
    
        function templateThumbnailDimensions($dimensions, $foogallery) {
            $dimensions = $foogallery->get_meta('default_thumbnail_dimensions', [
                'width' => get_option('thumbnail_size_w'),
                'height' => get_option('thumbnail_size_h')
            ]);
    
            $dimensions['crop'] = true;
            return $dimensions;
        }
    
        function galleryTemplateArguments($args) {
            $args = foogallery_gallery_template_setting('thumbnail_dimensions', []);
            $args['crop'] = '1';
            $args['link'] = foogallery_gallery_template_setting('thumbnail_link', 'image');
            return $args;
        }
    
        public function locatedTemplate() {
            wp_enqueue_script(
                'mvvwb-gallery',
                MVVWB_GALLERY_TEMPLATE_BASE . 'index.js',
                [],
                MVVWB_GALLERY_TEMPLATE_VERSION
            );

            foogallery_enqueue_style(
                'mvvwb-gallery',
                MVVWB_GALLERY_TEMPLATE_BASE . 'style.css',
                [],
                MVVWB_GALLERY_TEMPLATE_VERSION
            );
        }
    
        private function addFilter($id, $function, $global = true) {
            if ($global)
                add_filter($id, [ $this, $function ]);
            else
                add_filter("$id-mvvwb-gallery", [ $this, $function ]);
        }
    }    
}

new MVVWBTemplate();
