

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  // add a text to the page
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: () => {
      let data = {
        "name": "Noga Tal",
        "mail": "isanyo.noga@gmail.com",
        "phone": "0526605398",
        "linkdin": "https://www.linkedin.com/in/noga-tal-8b6b5b1b4/",
        "github": "https://github.com/NogaTal98",
        "portfolio": "https://noga-portfolio.web.app/"
      };

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