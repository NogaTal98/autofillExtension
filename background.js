// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  // add a text to the page
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: async () => {
      let data = await fetch(chrome.runtime.getURL('/data/data.json'))
      .then((resp) => resp.json());
      console.log(data);

      let cv = await fetch(chrome.runtime.getURL('/data/CV.pdf'))
      .then((resp) => {
        let b = resp.blob();
        let metadata = {
          type: "application/pdf",
        };
        return new File([b], "CV.pdf", metadata);
      });

      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        if (/name/i.test(input.name)) {
          if (/first/i.test(input.name)) {
            input.value = data.name.split(' ')[0];
          } else if (/last/i.test(input.name)) {
            input.value = data.name.split(' ')[1];
          }
          else {input.value = data.name;}
        } else if (/email/i.test(input.name)) {
          input.value = data.mail;
        } else if (/phone/i.test(input.name)) {
          input.value = data.phone;
        } else if (/linkedin/i.test(input.name) || /linked/i.test(input.placeholder)) {
          input.value = data.linkdin;
        } else if (/github/i.test(input.name)) {
          input.value = data.github;
        } else if (/portfolio/i.test(input.name)) {
          input.value = data.portfolio;
        } else if (/file/i.test(input.type)) {
          const dt = new DataTransfer();
          dt.items.add(cv);
          input.files = dt.files;

          const event = new Event("change", {
            bubbles: !0,
          });
          input.dispatchEvent(event);
        }
      });
    }
  });
});