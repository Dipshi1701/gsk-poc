/**
 * Add Hyperchat adapter
 * @param   {array}     array   Adapters array
 * @param   {object}    conf    Hyperchat configuration
 * @return  {array}             Adapters array
 */
export default function(adapters, conf) {

  // Hyperchat configuration
  window.SDKHCAdapter.configure(conf);

  // Escalation adapter
  adapters[adapters.length] = window.SDKNLEscalation2(window.SDKHCAdapter.checkEscalationConditions);
  // Hyperchat adapter
  adapters[adapters.length] = window.SDKHCAdapter.build();

  return adapters;
}
