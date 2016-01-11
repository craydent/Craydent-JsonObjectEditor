/*----------------------------------------------------------------------------------------------------------------
    //SCHEMAS
 /---------------------------------------------------------------------------------------------------------------*/
function extendDefaultSchema(schemaName,extendWith,nickname){
var defs= {
        __collection: schemaName,
    _title: (nickname||schemaName).capitalize()+' | ${name}',
    _listWindowTitle: (nickname||schemaName).capitalize()+'s',
    sorter:['name'],
    //dataset: function(){return getNPCData(schemaName)},
    _listID: '_id',
    _listTitle:'<joe-title>${name}</joe-title>'+'<div class="joe-subtext">${_id}</div>'
};
    return $.extend(defs,(extendWith||{}))
}
function codeField(name,comment){
    return {name:name,comment:comment||'',type:'code',asFunction:true}
}

var JOEschemas = function() {
    return {

        'method':{
            fields:[
                'api_item_name',

                'documentation_content',
                'name',
                'class',

                //'global_function',
                'source_code',
                'parameters',
                'count',
                '_id'
            ],
            stripeColor:function(item){

                if(!item.comments){
                    return;
                }
                if(item.comments.error){
                    return '#cc0000';
                }

                if(item.comments.featured){
                    return '#00cc00';
                }
                return '#ccc';
            },
            headerMenu:function() {
                //_joe.buttons.previous,
                return [_joe.buttons.previous,_joe.buttons.next]
            },
            headerListMenu:[
                {name:'Props'},
                {name:'Methods'}
            ],
            sorter:['name','class','!count'],
            subsets:function(){
                var subs = [];
                  _joe.getDataset('api').map(function(a){
                  subs.push($.extend({filter:{class: a.name}},a));
                  });
                return subs;
            },
            filters:/*function(item){
                var f = */[
                    {name:'featured',filter:{'comments.featured':true}},
                    {name:'doc error',filter:{'comments.error':{$exists:true}}}
                ]/*;
                return f;
            }*/,

            idprop:'_id',
            _listTitle:
            '<joe-full-right><div class="joe-subtext">${class}</div>' +
            '<div class="joe-subtext">${itemtype}</div><div class="joe-subtext">x${count}</div></joe-full-right>'
            +'<joe-title>' +
            '<span style="font-weight:normal">${class}.</span>${name}</joe-title>' +
            '<joe-content>${this.comments.description} </joe-content>'+
            '<joe-subtext${parameters}</joe-subtext>',
            _title:'&fnof; ${name}',
            _listMenuTitle:function(item){
                return _joe.current.subset.name +' Methods';
            },
            listmenu:[],
            itemMenu:function(item){
                var tagsButtons = [];
                item.tags.map(function(tag){
                    tagsButtons.push({name:tag,action:'_joe.toggleFilterObject(\'tag\',{tags:{$in:[\''+tag+'\']}})'})
                });
                return tagsButtons;
            }
        },

    //PROPERTY//
        'property':{
            sorter:['name'],
            menu:[
                //--.buttons.view_object
            ],
            subsets:function(){
                var subs = [];
                _joe.getDataset('api').map(function(a){
                    subs.push($.extend({filter:{class: a.name}},a));
                });
                return subs;
            },
            filters:function(item){
                var f = [
                    {name:'sub properties',filter:{subproperties:{$exists:true}}},
                    {name:'top level',filter:{depth:1}}
                ];
                return f;
            },
            itemExpander:function(property){
                if(property.subproperties && property.subproperties.length){
                    var html = '';
                    property.subproperties.map(function(sub){
                        html+=_joe.renderFieldListItem(_joe.search(sub)[0]||false);
                    });

                    return html;
                }
                return false;
            },
            idprop:'_id',
            _listTitle:
            '<div class="full-right"><div class="joe-subtext">${class}</div><div class="joe-subtext">${itemtype}</div></div>'
            +'<div class="joe-title"><span style="font-weight:normal">${class}.</span>${name}</div>',
            _title:' ${name}',
            _listMenuTitle:'Properties | ${_listCount}',
            listMenu:[],
            fields:[
                'api_property_name',
                {name:'value',type:'content',run:function(item,prop){
                    return '<pre>'+JSON.stringify(prop.value,'','\t')+'</pre>';
                }},
               // 'documentation_content',
                {name:'subproperties',type:'objectReference',
                    values:function(){return App.Data.method.concat(App.Data.property).sortBy('name');},
                    locked:true,
                    condition:function(item){return item.subproperties && item.subproperties.length; },
                    template:'<joe-title>${propname}</joe-title>'+'<div class="subtext">${name}</div>'

                },
                'name',
                'class',
                '_id'
            ]
        },
    //SCHEMA//
        'schema':{
            _title:'Schema > ${name}',
            onPanelShow:function(){
              return true;
            },
            headerMenu:function() {
                //_joe.buttons.previous,
                return [_joe.buttons.previous,_joe.buttons.next]
            },
            fields:[
                'name',
                {name:'idprop', comment:'The property to use as the id, default to _id'},
                '_title',
                {section_start:'List View'},
                    '_listMenuTitle','sorter',
                    {name:'subsets', asFunction:true,type:function(item){
                        return 'code';
                        if(!item.subsets || $.type(item.subsets) == 'function'){
                            return 'code';
                        }
                        return 'objectList';
                    },properties:['name','filter','id'],format:function(propVal,propObj,item){
                        if($.type(propVal) == 'array'){
                            return [propVal];
                        }
                    }},
                    {name:'filters', asFunction:true,type:function(item){
                        return 'code';
                        if(!item.filters || $.type(item.filters) == 'function'){
                            return 'code';
                        }
                        return 'objectList';
                    },properties:['name',{name:'filter',type:'rendering'},'id']},
                    'numCols','hideNumbers',
                    codeField('stripeColor','string (or function) for web/hex color with # in hex. Colors left border'),
                    codeField('bgColor','string (or function) for web/hex color with # in hex. Colors whole list item'),
                    {name:'searchables',comment:'array of properties to keyword search on.'},
                    codeField('itemMenu','array (or function) of buttons that show up in the list view, autohides if empty'),
                    codeField('itemExpander','html (or function) of content for expander, autohides if empty.'),
                {section_end:'List View'},
                {name:'onPanelShow',comment:'function to call when joe Panel is finished being rendered and shown.',
                type:'code'},

                {section_start:'Menus'},
                    {name:'menu', comment:'array of buttons to put on the details menu.'},
                    {name:'listMenu', comment:'array of buttons to put on the list view.'},
                    {name:'headerMenu', comment:'array of buttons to add to the header'},
                    {name:'headerListMenu', comment:'array of buttons to add to the header when in list mode'},
                {section_end:'Menus'},

                {name:'listAction',type:'code',height:'50px',comment:'Ovverides the default onclick action for the list view.'}
            ]
        },
    //FIELD//
        'field': {
            fields: [
                'name',
                'comment',
                'display',
                'label',
                'type',
                'values',
                'locked',
                'required',
                'hidden',
                'condition',
                'height',
                'width',

                'template',
                'run',

                'goto'

            ]
        }

    };
};
//END SCHEMAS
/*----------------------------------------------------------------------------------------------------------------
 //FIELDS
 /---------------------------------------------------------------------------------------------------------------*/

var specs = function(){
    return {

        fields: {
            //all items
            api_item_name:{
                type:'content',
                template:'<joe-title>${class}.${name}(${parameters})</joe-title>'
            },
            api_property_name:{
                type:'content',
                template:'<joe-title>${class}.${name}</joe-title>'
            },
            //name: {label: '${} Name', onblur: 'updateSourceCode()',hidden:true},
            name: {label: '${} Name', onblur: 'updateSourceCode()',hidden:true},

            _id: {label: 'ID', type: 'guid'},
            description: {label: 'Description', type: 'code'},

            created: {label: 'created', type: 'text', width: '50%', locked: true},
            //function
            global_function: {label: 'Global', type: 'boolean', rerender:'source_code'},

            class:{display:'JS Class',locked:true,hidden:true},
            source_code: {
                label: 'Code', type: 'code',language:'javascript',
                value:function (item) {
                    // item = _joe.constructObjectFromFields()|| item;
                    var evalString = '';
                    try {
                        if (item.global_function) {
                            evalString = eval(item.name);
                        } else {

                            if (item.ref && eval(item.ref + '.' + item.name)) {
                                evalString = eval(item.ref + '.' + item.name);
                            } else {
                                evalString = (item.ref || 'object') + ' does not have the function ' + item.name;
                            }
                        }
                    } catch (e) {
                        evalString = 'Could not evalutate: \n' + e;
                    }
                    item.__source_code = evalString.toString();
                    item.__source_code_length = item.__source_code.length;
                    return evalString;
                },
                after:function(item){
                    return '<joe-fright>'+item.__source_code_length+' chars</joe-fright><joe-clear></joe-clear>';
                },
                height:'400px'
            },
           /* source_code2: {
                label: 'Code', type: 'content',
                run: function (item) {
                    // item = _joe.constructObjectFromFields()|| item;
                    var evalString = '';
                    try {
                        if (item.global_function) {
                            evalString = eval(item.name);
                        } else {

                            if (item.ref && eval(item.ref + '.' + item.name)) {
                                evalString = eval(item.ref + '.' + item.name);
                            } else {
                                evalString = (item.ref || 'object') + ' does not have the function ' + item.name;
                            }
                        }
                    } catch (e) {
                        evalString = 'Could not evalutate: \n' + e;
                    }

                    return '<code><pre>' + evalString + '</pre></code>';
                }
            },*/
            documentation_content: {
                label: 'Documentation', type: 'content',
                condition:function(item){return !$.isEmptyObject(item.comments)},
                run:function(item){
                    if(!item.comments){
                        return 'NO item comments /*|{}|*/ in function.';
                    }else if(item.comments.error){
                        return 'Error generating doc: '+item.comments.error;
                    }else{
                        var h = '';
                        for(var i in item.comments){
                            if(item.comments[i] === true || item.comments[i] === false){
                                h += '<br/><p class="joe-subtext"><b>'+i+': '+item.comments[i]+'</b></p>';
                            }else{
                                h += '<joe-subtitle class="joe-subtext"><b>'+i+'</b></joe-subtitle>' +
                                    '<p >'+item.comments[i]+'</p>';
                            }


                        }
                        return h;
                    }
                    return JSON.stringify(item.comments);
                }
            },
            documentation_comments: {
                label: 'Documentation', type: 'content',
                run:function(item){
                  return JSON.stringify(item.comments);
                },
                run2: function (item) {
                    // item = _joe.constructObjectFromFields()|| item;
                    var evalString = '';
                    try {
                        if (item.global_function) {
                            evalString = eval(item.name);
                        } else {

                            if (item.ref && eval(item.ref + '.' + item.name)) {
                                evalString = eval(item.ref + '.' + item.name);
                            } else {
                                evalString = (item.ref || 'object') + ' does not have the function ' + item.name;
                            }
                        }
                        var comments = /\/\*\|([\s\S]*)?\|\*\//;
                        var t = evalString.toString().match(comments);
                        logit(evalString);

                    } catch (e) {
                        evalString = 'Could not evalutate: \n' + e;
                    }
                    var html = '<code><pre>' + t[1] + '</pre></code>';
                    var domString = t[1].replace_all('*','').replace_all('\n','');
                    if(domString[domString.length-1] !='}'){
                        domString +='}';
                    }
                    try{
                        var domObj = eval(domString);
                        for(var prop in domObj){
                            html += '<div><b>'+prop+'</b>:'+domObj[prop]+'</div>';
                        }
                    }catch(e){
                        logit(e);

                        html ='<h4>'+e+'</h4>'
                        +'<code><pre>' + t[1] + '</pre></code>';
                        return html;
                    }
                    return html;
                }
            }
        },

        schemas:JOEschemas(),
        menu:[],
        autoInit:true,
        useBackButton:true,
        useHashlink:true,
        _title:'${itemtype} | ${display}',
        documentTitle:'${name}',
        container:'#joeHolder'
    }
};