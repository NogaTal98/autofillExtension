const form = document.getElementById('form');
const openForm = document.getElementById('openForm');
const aoutofill = document.getElementById('autofill');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    // update the local storage with the new data
    for (let key of formData) {
        console.log(key);
        if (key[0] == 'cv') {
            const reader = new FileReader();
            reader.onload = async (e) => {
            chrome.storage.local.set({ cv: {
                data: e.target.result,
                name: key[1].name
            } });
            };
            reader.readAsDataURL(key[1]);
        }
        else {
            chrome.storage.local.set({ [key[0]] : key[1] });
        }
    }
    form.style.display = 'none';
    openForm.style.display = 'block';
    window.location.reload();
});

openForm.addEventListener('click', async () => {
    form.style.display = 'table';
    openForm.style.display = 'none';
    document.body.style.width = '400px';
    aoutofill.style.display = 'none';
});