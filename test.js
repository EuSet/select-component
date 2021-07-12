const input = document.querySelector('.js-search-select__input')
const main = document.querySelector('.js-search-select__main')
const backButton = document.querySelector('.js-search-select__close')
backButton.onclick = function () {
    document.querySelector('.search-select-modal').classList.remove('visible');

}
input.onclick = function () {
    open()
}

function open() {
    document.querySelector('.search-select-modal').classList.add('visible');
    document.getElementById('js-select').querySelectorAll('option').forEach(function (option) {
        recInitCheckboxes(option)
    })
    document.querySelectorAll('.search-select-modal__leaf:not(._no-children)').forEach(function (leaf) {
        changeViewOption(leaf)
    });
    document.querySelectorAll('.search-select-modal__leaf').forEach(function (leaf) {
        changeChildCheckbox(leaf)
    });
}
function changeChildCheckbox(leaf) {
    let checkboxContainer = leaf.querySelector('.search-select-modal__checkbox');
    checkboxContainer.querySelector('input').addEventListener('change', function (e) {
        leaf.querySelector('.search-select-modal__checkbox').classList.remove('_so-so');
        leaf.querySelectorAll('.search-select-modal__checkbox input').forEach(function (node) {
            node.checked = e.target.checked;
        });
        let parent = leaf.parentElement;

        while (parent) {
            if (parent.classList.contains('search-select-modal__leaf')) {
                updateLeafChildrenStatus(parent);
            }
            if (parent.classList.contains('search-select-modal__main')) {
                break;
            }

            parent = parent.parentElement;
        }

        onCheckboxChange();
    });
}
function changeViewOption(leaf) {
    let checkboxContainer = leaf.querySelector('.search-select-modal__checkbox');
    let btn = checkboxContainer.querySelector('.search-select-modal__arrow')
    btn.onclick = function (e) {
        e.preventDefault();
        if (e.target.classList.contains('opened')) {
            e.target.classList.toggle('opened');
            return leaf.classList.remove('_opened');
        } else {
            e.target.classList.toggle('opened');
            return leaf.classList.add('_opened')
        }
    }
}
function buildCheckbox(option) {
    let wrap = document.createElement('label');
    wrap.classList.add('search-select-modal__checkbox');
    let checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    let label = document.createElement('span');
    let labelInner = document.createElement('i');
    labelInner.textContent = option.textContent;
    label.appendChild(labelInner);
    wrap.appendChild(checkbox);
    wrap.appendChild(label);

    if (option.selected) {
        checkbox.checked = true;
    }

    checkbox.setAttribute('value', option.value);
    checkbox.addEventListener('change', onCheckboxChange);
    return wrap;
}

function recInitCheckboxes(option) {
    let container = document.createElement('div');
    container.classList.add('search-select-modal__leaf');

    let checkbox = buildCheckbox(option);

    container.appendChild(checkbox);
    main.appendChild(container)
    let level = +option.dataset.level || 1;
    let nextOption = option;
    container.classList.add('_level-' + level);
    let hasChildren = false;

    while (true) {
        nextOption = nextOption.nextElementSibling;
        if (!nextOption) break;
        let nextOptionLevel = +nextOption.dataset.level || 1;

        if (nextOptionLevel <= level) {
            break;
        } else if (nextOptionLevel === level + 1) {
            container.appendChild(recInitCheckboxes(nextOption));
            hasChildren = true;
        }
    }

    if (hasChildren === false) {
        container.classList.add('_no-children');
    } else {
        let button = document.createElement('button');
        button.classList.add('search-select-modal__arrow');
        container.querySelector('.search-select-modal__checkbox span i').prepend(button);
    }

    return container;
}

function onCheckboxChange() {
    document.querySelector('.js-search-select__counter').textContent = main.querySelectorAll('input:checked').length;
}

function updateLeafChildrenStatus(leaf) {
    let selfCheckbox = leaf.querySelector('.search-select-modal__checkbox input');
    let allChecked = true;
    let allNotChecked = true;
    let hasSoSo = false;
    leaf.querySelectorAll(':scope > .search-select-modal__leaf').forEach(function (child) {
        let checkboxStatus = child.querySelector('.search-select-modal__checkbox input').checked;

        if (checkboxStatus) {
            allNotChecked = false;
        } else {
            allChecked = false;
        }

        if (child.querySelector('.search-select-modal__checkbox').classList.contains('_so-so')) {
            hasSoSo = true;
        }
    });

    if (hasSoSo) {
        allNotChecked = allChecked = false;
    }

    if (allChecked && selfCheckbox.checked === false) {
        selfCheckbox.checked = true;
    }

    if (allNotChecked && selfCheckbox.checked !== false) {
        selfCheckbox.checked = false;
    }

    leaf.querySelector('.search-select-modal__checkbox').classList.toggle('_so-so', !allNotChecked && !allChecked);

    if (!allNotChecked && !allChecked) {
        leaf.querySelector('.search-select-modal__checkbox input').checked = false;
    }
}

