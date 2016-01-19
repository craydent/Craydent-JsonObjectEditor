/**
 * Created by Corey on 12/23/2015.
 */

function CraydentApp(specs){
    if(typeof specs == "boolean"){
        specs = {autoInit:specs}
    }
    var self=this;
    var dspecs = {
        theme:'light',
        container:$('body')
    };
    var specs = specs.merge(specs);
    this.constructComponent = function(componentName){
      self[componentName] = {};

    };


    /*----------------------BEGIN WRAPPER ----------------------*/
    this.Wrapper = {};
    var Wrapper = this.Wrapper;
    Wrapper.render = function(target){
        var h = '<capp-wrapper></capp-wrapper>';
        return h;
    };

    /*----------------------END WRAPPER -------------------------*/


    /*----------------------BEGIN HEADER ----------------------*/
    this.Header = {};
    var Header = this.Header;
    Header.render = function(target){
        var h = '<capp-header class="'+specs.theme+'-bg"></capp-header>';

    };
    /*----------------------END HEADER -------------------------*/
    /*----------------------BEGIN BODY -------------------------*/
    this.Body ={};

    /*----------------------END BODY ----------------------*/

    /*----------------------BEGIN VIEWS ----------------------*/
    this.Views = {};
    this.Views.show = function(schema,subset,specs){
        var adds = {schema:schema};
        if(subset){
            adds.subset = subset;
        }
        $.extend(adds,specs ||{});
        goJoe(schema,adds);
    };

    /*----------------------END VIEWS -------------------------*/


    /*----------------------BEGIN INIT ----------------------*/
    this.init = function(s){
        specs = specs.merge((s||{}));
        //componetize('capp-header');
        self.initSVGs();
        self.initInteractions();
    };

    this.initSVGs = function(){
        /*
         * Replace all SVG images with inline SVG
         */
        jQuery('img.svg').each(function(){
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            jQuery.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = jQuery(data).find('svg');

                // Add replaced image's ID to the new SVG
                if(typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if(typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass+' replaced-svg');
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');

                // Replace image with new SVG
                $img.replaceWith($svg);

            }, 'xml');

        });
    };
    this.initInteractions = function(){
        $('capp-menu-label').click(function(){
            $(this).parent().toggleClass('expanded').siblings().removeClass('expanded');

        });
        $('capp-panel capp-menu-label').on('dblclick',function(){
            $(this).parents('capp-panel').toggleClass('expanded');
        });
        $('capp-panel-toggle,.capp-panel-toggle').click(function(){
            $(this).parents('capp-panel').toggleClass('expanded');
        });
        $('capp-menu-toggle').click(function(){
            $('capp-wrapper').toggleClass('expanded');
        });
        $('capp-panel').hover(
            function(){
                $(this).addClass('capp-targeted');
                window.__cpt = setTimeout(function(){
                    $('.capp-targeted').addClass('expanded');
            },1000)}
            ,function(){

                clearTimeout(window.__cpt);
                $('.capp-targeted').removeClass('expanded').removeClass('capp-targeted');
            }
        )
    };

    if(specs.autoInit){
        self.init();
    }
    /*----------------------END INIT ----------------------*/

    return this;
}

function componetize(name,createdCallback,specs){
    var specs = specs || {};

    var componentPrototype = Object.create(HTMLElement.prototype);
    componentPrototype.createdCallback = createdCallback || function() {
        //this.textContent = 'component: '+name;
    };
    componentPrototype.merge(specs);

    document.registerElement(name,{prototype:componentPrototype})
}