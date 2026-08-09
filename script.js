function setActiveStep(step) {
    document.querySelectorAll('.step-pane').forEach((pane) => {
        pane.classList.toggle('active', pane.id === `step${step}`);
    });

    document.querySelectorAll('.nav-item').forEach((item) => {
        item.classList.toggle('active', item.dataset.step === String(step));
    });

    document.querySelector('.hero-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nextStep(step) {
    if (step === 1) {
        const selected = document.querySelector('input[name="service"]:checked');
        if (!selected) {
            showToast('لطفاً یک گزینه را انتخاب کنید.');
            return;
        }
        setActiveStep(2);
        return;
    }

    if (step === 2) {
        const ip = document.getElementById('ipinp').value;
        if (!isValidIP(ip)) {
            showToast('لطفاً یک آدرس IP معتبر وارد کنید.');
            return;
        }
        showSummary();
        setActiveStep(3);
    }
}

function pastStep(step) {
    setActiveStep(step - 1);
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
    const serviceText = service ? service.closest('.stat-card').querySelector('.card-title').textContent : 'انتخاب نشده';
    const ip = document.getElementById('ipinp').value || '-';
    const network = document.getElementById('ntwk').value || '-';

    document.getElementById('resultService').textContent = serviceText;
    document.getElementById('resultIP').textContent = ip;
    document.getElementById('resultNet').textContent = network;
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function updateCards() {
    fetch('info.JSON')
        .then((response) => response.json())
        .then((data) => {
            const total = data.length;
            const vpnCount = data.filter((item) => item.accesses?.includes('vpn')).length;
            const databaseCount = data.filter((item) => item.accesses?.includes('database')).length;
            const errorCount = Math.max(1, total - 2);

            document.getElementById('t1').textContent = total;
            document.getElementById('t2').textContent = vpnCount;
            document.getElementById('t3').textContent = databaseCount;
            document.getElementById('t4').textContent = errorCount;
        })
        .catch((error) => console.error(error));
}

function bindCardSelection() {
    document.querySelectorAll('.stat-card').forEach((card) => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.stat-card').forEach((item) => item.classList.remove('selected'));
            card.classList.add('selected');
            card.querySelector('input').checked = true;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setActiveStep(1);
    bindCardSelection();
    updateCards();
    setInterval(updateCards, 1800);
});