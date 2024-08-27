const updateDataForm = document.getElementById('updateDataForm');
updateDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(updateDataForm);
    // update the local storage with the new data
    for (let key of formData) {
        console.log(key);
        if (key[0] == 'cv') {
            const reader = new FileReader();
            reader.onload = async (e) => {
            chrome.storage.local.set({ cv: e.target.result });
            };
            reader.readAsDataURL(key[1]);
        }
        else {
            chrome.storage.local.set({ [key[0]] : key[1] }).then(() => {
            console.log("Value ", key[0], " is set to " + key[1]);
        });
        }
    }
});

const openUpdateDataForm = document.getElementById('openUpdateDataForm');
openUpdateDataForm.addEventListener('click', async () => {
    updateDataForm.style.display = 'table';
});