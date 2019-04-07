//
var targetUrl = "";

/*
  Displays a notification with the current time. Requires "notifications"
  permission in the manifest file (or calling
  "Notification.requestPermission" beforehand).
*/
function show(msg, timeout) {
  var time = /(..)(:..)/.exec(new Date()); // The prettyprinted time.
  var hour = time[1] % 12 || 12; // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.

  if (timeout == "") {
    timeout = 2000;
  }
  var notificationHandle = new Notification(
    hour + time[2] + ' ' + period, {
      icon: 'assets/icon-large.png',
      body: msg,
      tag: "bgNotify"
    }
  );

  // hide notification after timeout ms
  setTimeout(notificationHandle.close.bind(notificationHandle), timeout);

}

//
handleStateChange = function (e) {
  if (this.readyState == 4 && this.status == 200) {
    show(targetUrl + " requested", 2000);
  } else if (this.status != 0 && this.status != 200) {
    var msg = "XMLHttpRequest " + targetUrl + " failed: readyState=" + this.readyState + ", this.status=" + this.status;
    console.log(msg);
    show(msg, 5000);
  }
};

//
openAndCloseLink = function (e) {
  //
  targetUrl = e.linkUrl;

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = handleStateChange;
  xhr.open("GET", targetUrl, true);
  xhr.send();

};

//
chrome.contextMenus.create({
  title: "Open link in background",
  contexts: ["link"],
  onclick: openAndCloseLink
});