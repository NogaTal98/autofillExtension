// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  // add a text to the page
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: async () => {
      let data = await fetch(chrome.runtime.getURL('/data/data.json'))
      .then((resp) => resp.json());
      console.log(data);

      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        if (/name/i.test(input.name)) {
          if (/firstname/i.test(input.name)) {
            input.value = data.name.split(' ')[0];
          } else if (/lastname/i.test(input.name)) {
            input.value = data.name.split(' ')[1];
          }
          else {input.value = data.name;}
        } else if (/email/i.test(input.name)) {
          input.value = data.mail;
        } else if (/phone/i.test(input.name)) {
          input.value = data.phone;
        } else if (/linkedin/i.test(input.name)) {
          input.value = data.linkdin;
        } else if (/github/i.test(input.name)) {
          input.value = data.github;
        } else if (/portfolio/i.test(input.name)) {
          input.value = data.portfolio;
        }
      });
    }
  });
});