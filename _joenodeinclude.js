/* JavaScript include for: Json Object Editor
last updated: CH March 2014
*/

var includes = "";
var projectName = 'JsonObjectEditor';
var web_dir = '//'+location.hostname+':80/JsonObjectEditor/';


var
scripts_dir = web_dir+"js/",
scripts = [];
if (typeof jQuery == 'undefined') {  
   scripts.push("jquery-1.11.0.min.js");
}
if (typeof Craydent == 'undefined') {  
   scripts.push("craydent-1.7.21.js");
}
scripts.push(
	"JsonObjectEditor.jquery.craydent.js",
	"leaflet.js",
	"esri-leaflet-geocoder.js",
	
	"zebra_datepicker.js"
	
);

var
styles_dir = web_dir+"css/",
styles =[
   "leaflet.css",
   "esri-leaflet-geocoder.css",
   "joe-styles.css"
],
script,style,sc,st,
sc_len = scripts.length,st_len = styles.length;

//scripts
for(sc = 0; sc < sc_len; sc++){
	script = scripts[sc];
	includes+='<script type="text/javascript" src="'+scripts_dir+script+'"></script>';
}
//styles
for(st = 0; st < st_len; st++){
	style = styles[st];
	includes+='<link href="'+styles_dir+style+'" rel="stylesheet" type="text/css">';
}

includes+='';


document.write(includes);