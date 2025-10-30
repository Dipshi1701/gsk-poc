export function saveButtonId(buttonId) {
  console.log('@@@@ - saveButtonId', buttonId);
  window.inbStorage.set('buttonId', buttonId);
}

export function loadButtonId() {
  const buttonId = window.inbStorage.get('buttonId');
  console.log('@@@@ - loadButtonId', buttonId);
  return buttonId;
}
