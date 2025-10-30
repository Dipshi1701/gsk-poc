/*
|---------------------------------------------------
|          Functions + external libraries
|---------------------------------------------------
|
| >> WARNING!
|
| Function and external libraries used to build the
| application customizations. Please, be carefull if
| you want to modify this section.
|
*/

/**
 * Load script dynamically and instantly trigger a function
 * @param  {object || string}     script    Script attributes
 * @param  {function}             callback  Function to be triggered when the file is completely loaded
 */
export default function(script, callback) {
  var dom = document.createElement('script');
  if (callback) dom.onload = callback;
  script.type ? dom.type = script.type : dom.type = 'text/javascript';
  if (typeof (script) === 'object') {
    if (script.src) dom.src = script.src;
    if (script.integrity) dom.integrity = script.integrity;
    if (script.crossorigin) dom.crossOrigin = script.crossorigin;
  } else if (typeof (script) === 'string') {
    dom.src = script;
  } else {
    throw new Error('Helper - importScript: script argument passed is not valid');
  }
  document.getElementsByTagName('head')[0].appendChild(dom, document.currentScript);
}
