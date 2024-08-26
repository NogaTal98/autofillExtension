const updateDataForm = document.getElementById('updateDataForm');

updateDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(updateDataForm);

    
    // update the local storage with the new data
    for (let key of formData) {
        console.log(key);
        chrome.storage.local.set({ [key[0]] : key[1] }).then(() => {
            console.log("Value ", key[0], " is set to " + key[1]);
        });
    }
});