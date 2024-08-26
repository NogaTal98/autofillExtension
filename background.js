const autofill = document.getElementById('autofill');

// When the user clicks on the extension action
autofill.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  // add a text to the page
  async function addText(tab) {
  // add a text to the page
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: async () => {
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
          // chrome.storage.local.get(["name"]).then((result) => {
          //   console.log("Value is " + result["name"]);
          // });
          if (checkFields(input, /name/i)) {
            if (checkFields(input, /first/i)) {
              chrome.storage.local.get(["name"]).then((result) => {
                setValue(input, result["name"].split(' ')[0]);
              });
            } else if (checkFields(input, /last/i)) {
              chrome.storage.local.get(["name"]).then((result) => {
                setValue(input, result["name"].split(' ')[1]);
              });
            } else {
              chrome.storage.local.get(["name"]).then((result) => {
              setValue(input, result["name"]);
            });}
          } else if (checkFields(input, /mail/i)) {
            chrome.storage.local.get(["email"]).then((result) => {
              setValue(input, result["email"]);
            });
          } else if (checkFields(input, /phone|tel/i)) {
            chrome.storage.local.get(["phone"]).then((result) => {
              setValue(input, result["phone"]);
            });
          } else if (checkFields(input, /linkedin/i)) {
            chrome.storage.local.get(["linkedin"]).then((result) => {
              setValue(input, result["linkedin"]);
            });
          } else if (checkFields(input, /github/i)) {
            chrome.storage.local.get(["github"]).then((result) => {
              setValue(input, result["github"]);
            });
          } else if (checkFields(input, /portfolio|Website/i)) {
            chrome.storage.local.get(["portfolio"]).then((result) => {
              setValue(input, result["portfolio"]);
            });
          } else if (checkFields(input, /address|city/i)) {
            chrome.storage.local.get(["address"]).then((result) => {
              setValue(input, result["address"]);
            });
          } else if (checkFields(input, /desired|pay/i)) {
            chrome.storage.local.get(["desiredPay"]).then((result) => {
              setValue(input, result["desiredPay"]);
            });
          }
        });
      }, 1000);
    }
  });
}
  addText(tab);
});