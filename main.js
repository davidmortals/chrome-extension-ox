openAndCloseLink = function(e){
  var targetUrl = e.linkUrl;
  chrome.tabs.create({url: targetUrl});
};

chrome.contextMenus.create({
  title: "Open and close link",
  contexts:["link"],
  onclick: openAndCloseLink
});