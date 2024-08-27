// Initialize the extension fields with the user's data from lical srorage
document.addEventListener('DOMContentLoaded', function() {
  updateField("name");
  updateField("email");
  updateField("phone");
  updateField("linkedin");
  updateField("github");
  updateField("portfolio");
  updateField("address");
  updateField("desiredPay");

  function updateField(field) {
    chrome.storage.local.get([field]).then((result) => {
    const name = document.getElementById(field);
    name.value = result[field];
    });
  }

  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime
    });
  }

  chrome.storage.local.get(["cv"]).then((result) => {
    if (result["cv"]) {
      const blob = dataURLtoBlob(result["cv"]);
      const dt = new DataTransfer();
      dt.items.add(new File([blob], "CV.pdf"));
      const input = document.getElementById("cv");
      input.files = dt.files;
      const event = new Event("change", { bubbles: !0, });
      input.dispatchEvent(event);
    }
  });
  
});

// When the user clicks on the extension action
const autofill = document.getElementById('autofill');
autofill.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  // add a text to the page
  async function addText(tab) {
    chrome.scripting.executeScript({
      target: {tabId: tab.id}, 
      function: async () => {

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
            function dataURLtoBlob(dataurl) {
              var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }
              return new Blob([u8arr], {
                type: mime
              });
            }

            chrome.storage.local.get(["cv"]).then((result) => {
              if (result["cv"]) {
                const blob = dataURLtoBlob(result["cv"]);
                const dt = new DataTransfer();
                dt.items.add(new File([blob], "CV.pdf"));
                input.files = dt.files;
                const event = new Event("change", { bubbles: !0, });
                input.dispatchEvent(event);
              }
            });
          }
        });

        setTimeout(() => {
          inputs.forEach(input => {
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