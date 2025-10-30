/**
 * Get Inbenta SDK script
 * @param   {object}  conf     Script configuration
 * @param   {object}  product  Product type
 * @return  {object}           Inbenta SDK Script
 */
 export default function(conf, product) {
  var script = {};

  // Set script src & type
  script.type = 'text/javascript';
  script.src = 'https://sdk.inbenta.io/' + product + '/' + conf.version + '/inbenta-' + product + '-sdk.js'

  // Set script integrity
  if (conf.integrity) {
    script.integrity = conf.integrity;
    script.crossorigin = 'anonymous'
  }

  return script;
}
