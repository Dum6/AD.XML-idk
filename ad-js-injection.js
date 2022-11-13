var VungleHelper = {};

VungleHelper.setSKPresentation = function (eventType, presentationType, presentationOptions = null) {
  var creativeEventTypes = {
    skPresentationASOIInteraction: 'asoi-interaction',
    skPresentationASOIComplete: 'asoi-complete',
    skPresentationCTAClick: 'cta-click',
  };
  var objectKey = Object.keys(creativeEventTypes).find((key) => creativeEventTypes[key] === eventType);

  if (objectKey) {
    var skPresentationSettings = {};
    skPresentationSettings[objectKey] = { presentationType: presentationType, presentationOptions: presentationOptions };
    window.sendMessage('ad-event-sk-presentation', skPresentationSettings);
  }
};

VungleHelper.dismissSKOverlay = function () {
  window.sendMessage('ad-event-sk-dismiss');
};

var clickEvent = (function () {
  if ('ontouchstart' in document.documentElement === true) {
    return 'touchstart';
  }
  return 'click';
}());


window.callSDK = function (action) {
  parent.postMessage(action, '*');
};


window.actionClicked = function (action) {
  parent.postMessage(action, '*');
};


window.open = function () {

  parent.postMessage('download', '*');
};

window.addEventListener(clickEvent, function () {
  parent.postMessage('interacted', '*');
});

window.addEventListener(clickEvent, function (e) {

  let clientX = 0;
  let clientY = 0;
  clientX = e.touches ? e.touches[0].clientX : e.clientX;
  clientY = e.touches ? e.touches[0].clientY : e.clientY;
  parent.postMessage('clickEvent|' + clientX + '|' + clientY, '*');
});

document.addEventListener('DOMContentLoaded', function () {
  window.sendMessage('ad-event-loaded');
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    e.preventDefault();
  }
});

function sendEvent(name, obj) {
  if (typeof obj === 'undefined') {
    obj = {};
  }
  var event = new CustomEvent(name, { 'detail': obj });
  window.dispatchEvent(event);
}

Event.prototype.stopPropagation = function () {

};

window.sendMessage = function (title, obj) {

  var data = {
    title: title,
    content: obj,
  };

  window.parent.postMessage(data, '*');
};

window.receiveMessage = function (e) {
  if (e.data.length === 0 || typeof e.data.title === 'undefined') {
    return;
  }

  window.processMessage(e.data.title, e.data.content || {});
  sendEvent(e.data.title, e.data.content || {});
};

window.processMessage = function (title, content) {
  if (title === 'ad-event-init') {
    VungleHelper.tokens = content.tokens;
    VungleHelper.closeDelay = content.closeDelay;
    VungleHelper.rewardedAd = content.rewardedAd;
  }
};

window.addEventListener('message', window.receiveMessage);

window.sendInstructions = function () {
  window.sendMessage('ad-event-child-instructions', window.vungleSettings);
};

if (typeof window.vungleSettings !== 'undefined') {
  window.sendInstructions();
}
