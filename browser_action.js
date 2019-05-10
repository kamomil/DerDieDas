'use strict';

(function() {
  var eventKey = 0;
  var d = null;
  var area = null;
  var lnkDiv = null;

  var r = function() {
    var a;
    if (a = area.value.replace(/^\s+|\s+$/g, "")) {
      /** @type {string} */
      lnkDiv.innerHTML = "Searching...";
      d.disabled = true;
      eventKey++;
      chrome.runtime.sendMessage({
        type : "fetch_html",
        eventKey : eventKey,
        query : a
      }, render);
    }
  };

  var render = function(i) {
  console.log("render")
  console.log(i)
    if (i.eventKey === eventKey) {
      if (i.meaningObj)
        lnkDiv.innerHTML = i.meaningObj;
      else
        lnkDiv.innerHTML = "No definition found.";
      d.disabled = false;
    }
  };
  d = document.getElementById("define-btn");
  area = document.getElementById("query-field");
  lnkDiv = document.getElementById("status-msg");
  area.focus();
  d.addEventListener("click", r, false);
  area.addEventListener("keydown", function(event) {
    if (13 === event.keyCode) {//Enter keyshort
      r();
    }
  }, false);
  chrome.tabs.query({
    active : true,
    currentWindow : true
  }, function(a) {
    if (a.length) {
      console.assert(1 === a.length);
      chrome.tabs.sendMessage(a[0].id, {
        type : "get_selection"
      }, function(doc) {
        if (doc && doc.selection) {
          area.value = doc.selection;
          r();
        }
      });
    }
  });
})();
