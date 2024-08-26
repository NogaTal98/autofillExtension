const btn = document.getElementById('button');

// When the user clicks on the extension action
btn.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  // add a text to the page
  async function addText(tab) {
  // add a text to the page
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: async () => {
      let data = await fetch(chrome.runtime.getURL('/data/data.json'))
      .then((resp) => resp.json());
      //console.log(data);

      let cv = await fetch(chrome.runtime.getURL('/data/CV.pdf'))
      .then((resp) => {
        let b = resp.blob();
        let metadata = {
          type: "application/pdf",
        };
        return new File([b], "CV.pdf", metadata);
      });

      const checkFields = (input, regex) => {
        return regex.test(input.name) || regex.test(input.id) || regex.test(input.placeholder) || regex.test(input.ariaLabel) || regex.test(input.class);
      };

      const setValue = (input, value) => {
        input.value = value;
        const event = new Event("change", { bubbles: !0, });
        input.dispatchEvent(event);
      }

      const inputs = document.querySelectorAll('input');
      
      inputs.forEach(input => {
        if (/file/i.test(input.type) && checkFields(input, /cv|resume|file/i)) {
          const dt = new DataTransfer();
          dt.items.add(cv);
          input.files = dt.files;
          const event = new Event("change", { bubbles: !0, });
          input.dispatchEvent(event);
        }
      });

      setTimeout(() => {
        inputs.forEach(input => {
          if (checkFields(input, /name/i)) {
            if (checkFields(input, /first/i)) {
              setValue(input, data.name.split(' ')[0]);
            } else if (checkFields(input, /last/i)) {
              setValue(input, data.name.split(' ')[1]);
            } else {setValue(input, data.name);}
          } else if (checkFields(input, /mail/i)) {
            setValue(input, data.mail);
          } else if (checkFields(input, /phone|tel/i)) {
            setValue(input, data.phone);
          } else if (checkFields(input, /linkedin/i)) {
            setValue(input, data.linkedin);
          } else if (checkFields(input, /github/i)) {
            setValue(input, data.github);
          } else if (checkFields(input, /portfolio|Website/i)) {
            setValue(input, data.portfolio);
          } else if (checkFields(input, /address|city/i)) {
            setValue(input, data.address);
          } else if (checkFields(input, /desired|pay/i)) {
            setValue(input, data.desiredPay);
          }
        });
      }, 1000);
    }
  });
}
  addText(tab);
});