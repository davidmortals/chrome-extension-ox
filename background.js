//
var targetUrl = "";

/*
  Displays a notification with the current time. Requires "notifications"
  permission in the manifest file (or calling
  "Notification.requestPermission" beforehand).
*/
function show() {
  var time = /(..)(:..)/.exec(new Date()); // The prettyprinted time.
  var hour = time[1] % 12 || 12; // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
  var notificationHandle = new Notification(
    hour + time[2] + ' ' + period, {
      icon: 'assets/icon-large.png',
      body: targetUrl + " requested",
      tag: "bgNotify"
    }
  );

  setTimeout(notificationHandle.close.bind(notificationHandle), 3000);

}

//
handleStateChange = function (e) {
  if (this.readyState == 4 && this.status == 200) {
    show(targetUrl);
  } else if (this.status != 0 && this.status != 200) {
    console.log("XMLHttpRequest " + targetUrl + " failed: readyState=" + this.readyState + ", this.status=" + this.status);
  }
};

//
openAndCloseLink = function (e) {
  //
  targetUrl = e.linkUrl;
  // chrome.tabs.create({url: targetUrl});

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