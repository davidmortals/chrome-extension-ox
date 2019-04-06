function openRaterFox() {
  chrome.tabs.create({
    'url': 'https://www.raterfox.com'
  });
}

function openNewTab() {
  chrome.tabs.create({
    'url': '/newtab.html'
  });
}

document.getElementById('open-raterfox').addEventListener('click', openNewTab());


