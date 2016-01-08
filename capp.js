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
        self.initInteractions();
    };

    this.initInteractions = function(){
        $('capp-menu-label').click(function(){
            $(this).parent().toggleClass('expanded');
        })
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