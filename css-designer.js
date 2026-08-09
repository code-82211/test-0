const shapes = [];
let selectedId = null;
let nextId = 1;

const defaultStyles = {
    rectangle: {
        width: '180px',
        height: '120px',
        backgroundColor: '#60a5fa',
        borderColor: '#1d4ed8',
        borderRadius: '18px',
        color: '#ffffff',
        left: '40px',
        top: '40px',
        text: 'مستطیل',
        icon: ''
    },
    circle: {
        width: '140px',
        height: '140px',
        backgroundColor: '#10b981',
        borderColor: '#047857',
        borderRadius: '50%',
        color: '#ffffff',
        left: '260px',
        top: '40px',
        text: 'دایره',
        icon: ''
    },
    line: {
        width: '220px',
        height: '6px',
        backgroundColor: '#0f172a',
        borderColor: '#0f172a',
        borderRadius: '999px',
        color: '#ffffff',
        left: '540px',
        top: '80px',
        text: '',
        icon: ''
    },
    icon: {
        width: '110px',
        height: '110px',
        backgroundColor: '#f97316',
        borderColor: '#c2410c',
        borderRadius: '24px',
        color: '#ffffff',
        left: '40px',
        top: '220px',
        text: '',
        icon: 'bi-star-fill'
    },
    text: {
        width: '220px',
        height: '64px',
        backgroundColor: '#f8fafc',
        borderColor: '#94a3b8',
        borderRadius: '14px',
        color: '#0f172a',
        left: '220px',
        top: '220px',
        text: 'متن نمونه',
        icon: ''
    }
};

const canvas = document.getElementById('canvas');
const selectedLabel = document.getElementById('selectedLabel');
const styleWidth = document.getElementById('styleWidth');
const styleHeight = document.getElementById('styleHeight');
const styleBg = document.getElementById('styleBg');
const styleBorder = document.getElementById('styleBorder');
const styleRadius = document.getElementById('styleRadius');
const styleText = document.getElementById('styleText');
const styleIcon = document.getElementById('styleIcon');
const cssCode = document.getElementById('cssCode');

function addShape(type) {
    const newShape = {
        id: nextId++,
        type,
        className: `shape-${nextId}`,
        styles: { ...defaultStyles[type] }
    };
    shapes.push(newShape);
    selectedId = newShape.id;
    renderCanvas();
    renderProperties();
    generateCss();
}

function renderCanvas() {
    canvas.innerHTML = '';
    shapes.forEach(shape => {
        const element = document.createElement('div');
        element.className = `shape-item ${shape.type}`;
        element.dataset.id = shape.id;
        element.dataset.name = `shape-${shape.id}`;
        applyShapeStyles(element, shape.styles);

        if (shape.icon) {
            const icon = document.createElement('i');
            icon.className = `shape-icon bi ${shape.icon}`;
            element.appendChild(icon);
        }

        if (shape.text && shape.type !== 'icon') {
            const text = document.createElement('span');
            text.textContent = shape.text;
            text.style.pointerEvents = 'none';
            element.appendChild(text);
        }

        if (selectedId === shape.id) {
            element.classList.add('selected');
        }

        element.addEventListener('click', (event) => {
            event.stopPropagation();
            selectShape(shape.id);
        });

        canvas.appendChild(element);
    });
}

function applyShapeStyles(element, styles) {
    element.style.width = styles.width;
    element.style.height = styles.height;
    element.style.backgroundColor = styles.backgroundColor;
    element.style.border = `2px solid ${styles.borderColor}`;
    element.style.borderRadius = styles.borderRadius;
    element.style.color = styles.color;
    element.style.left = styles.left;
    element.style.top = styles.top;
    element.style.position = 'absolute';
    element.style.display = 'flex';
    element.style.flexDirection = 'column';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
}

function selectShape(id) {
    selectedId = id;
    renderCanvas();
    renderProperties();
}

function clearSelection(event) {
    if (event.target === canvas) {
        selectedId = null;
        renderCanvas();
        renderProperties();
    }
}

function renderProperties() {
    const shape = shapes.find(item => item.id === selectedId);
    if (!shape) {
        selectedLabel.textContent = 'عنصری انتخاب نشده';
        styleWidth.value = 120;
        styleHeight.value = 120;
        styleBg.value = '#60a5fa';
        styleBorder.value = '#1d4ed8';
        styleRadius.value = 18;
        styleText.value = '';
        styleIcon.value = '';
        return;
    }

    const styles = shape.styles;
    selectedLabel.textContent = `انتخاب شده: ${shape.type} #${shape.id}`;
    styleWidth.value = parseInt(styles.width, 10);
    styleHeight.value = parseInt(styles.height, 10);
    styleBg.value = styles.backgroundColor;
    styleBorder.value = styles.borderColor;
    styleRadius.value = parseInt(styles.borderRadius, 10) || 0;
    styleText.value = styles.text || '';
    styleIcon.value = styles.icon || '';
}

function setSelectedStyle(prop, value) {
    const shape = shapes.find(item => item.id === selectedId);
    if (!shape) return;
    shape.styles[prop] = value;
    if (prop === 'borderRadius' && shape.type === 'circle') {
        shape.styles.borderRadius = '50%';
    }
    renderCanvas();
    generateCss();
}

function setSelectedContent(text) {
    const shape = shapes.find(item => item.id === selectedId);
    if (!shape) return;
    shape.styles.text = text;
    renderCanvas();
    generateCss();
}

function setSelectedIcon(icon) {
    const shape = shapes.find(item => item.id === selectedId);
    if (!shape) return;
    shape.styles.icon = icon;
    renderCanvas();
    generateCss();
}

function deleteSelected() {
    if (!selectedId) return;
    const index = shapes.findIndex(item => item.id === selectedId);
    if (index === -1) return;
    shapes.splice(index, 1);
    selectedId = null;
    renderCanvas();
    renderProperties();
    generateCss();
}

function duplicateSelected() {
    const shape = shapes.find(item => item.id === selectedId);
    if (!shape) return;
    const clone = {
        id: nextId++,
        type: shape.type,
        className: `shape-${nextId}`,
        styles: { ...shape.styles, left: `${parseInt(shape.styles.left, 10) + 40}px`, top: `${parseInt(shape.styles.top, 10) + 40}px` }
    };
    shapes.push(clone);
    selectedId = clone.id;
    renderCanvas();
    renderProperties();
    generateCss();
}

function clearCanvas() {
    shapes.length = 0;
    selectedId = null;
    renderCanvas();
    renderProperties();
    generateCss();
}

function generateCss() {
    if (shapes.length === 0) {
        cssCode.value = '/* در اینجا کد CSS شکل‌های ساخته‌شده نمایش داده می‌شود */';
        return;
    }

    const lines = shapes.map(shape => {
        const selector = `.shape-${shape.id}`;
        const styles = shape.styles;
        const properties = [
            `width: ${styles.width};`,
            `height: ${styles.height};`,
            `background-color: ${styles.backgroundColor};`,
            `border: 2px solid ${styles.borderColor};`,
            `border-radius: ${styles.borderRadius};`,
            `color: ${styles.color};`,
            `position: absolute;`,
            `left: ${styles.left};`,
            `top: ${styles.top};`,
            `display: flex;`,
            `align-items: center;`,
            `justify-content: center;`,
            `padding: 10px;`
        ];

        return `${selector} {
    ${properties.join('\n    ')}
}`;
    });

    cssCode.value = lines.join('\n\n');
}

function copyCss() {
    cssCode.select();
    document.execCommand('copy');
    const button = document.querySelector('.designer-header .button-primary');
    const original = button.textContent;
    button.textContent = 'کپی شد';
    setTimeout(() => {
        button.innerHTML = '<i class="bi bi-clipboard"></i> کپی CSS';
    }, 1000);
}

renderProperties();
generateCss();
