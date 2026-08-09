function changeMenu(step) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.remove('active'));

    const selectedMenu = document.querySelector(`.nav-item[data-step='${step}']`);
    const selectedTab = document.getElementById(`step${step}`);

    if (selectedMenu) selectedMenu.classList.add('active');
    if (selectedTab) selectedTab.classList.add('active');

    if (step === 3) {
        showSummary();
    }
}

function nextStep(step) {
    if (step === 2) {
        const ip = document.getElementById('ipinp').value;
        if (!isValidIP(ip)) {
            alert('لطفاً یک آدرس IP معتبر وارد کنید.');
            return;
        }
        showSummary();
    }
    changeMenu(step + 1);
}

function pastStep(step) {
    changeMenu(step - 1);
}

function isValidIP(ip) {
    if (ip.trim() === '') {
        return true;
    }

    const regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    return regex.test(ip);
}

function showSummary() {
    const service = document.querySelector('input[name="service"]:checked');
    let serviceText = 'انتخاب نشده';

    if (service) {
        const title = service.parentElement.querySelector('.stat-title');
        serviceText = title ? title.innerText : 'یک خدمت';
    }

    const ip = document.getElementById('ipinp').value || '-';
    const network = document.getElementById('ntwk').value || '-';

    document.getElementById('resultService').innerText = serviceText;
    document.getElementById('resultIP').innerText = ip;
    document.getElementById('resultNet').innerText = network;
}

function updateCards() {
    fetch('info.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('t1').textContent = data.length;
            const vpnCount = data.filter(item => item.accesses.includes('vpn')).length;
            const databaseCount = data.filter(item => item.accesses.includes('database')).length;
            const errorCount = data.filter(item => item.priority === 'important').length;

            document.getElementById('t2').textContent = vpnCount;
            document.getElementById('t3').textContent = databaseCount;
            document.getElementById('t4').textContent = errorCount;
        })
        .catch(error => {
            console.error(error);
            document.getElementById('t1').textContent = '-';
            document.getElementById('t2').textContent = '-';
            document.getElementById('t3').textContent = '-';
            document.getElementById('t4').textContent = '-';
        });
}

function initInteractions() {
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', function () {
            alert('درخواست شما ثبت شد.');
        });
    }

    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', () => {
            const input = card.querySelector('input[name="service"]');
            if (input) {
                input.checked = true;
            }
        });
    });
}

updateCards();
setInterval(updateCards, 2000);
initInteractions();
