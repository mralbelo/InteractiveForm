// Basic Info Selectors
const nameInput = document.getElementById('name');
const mailInput = document.getElementById('mail');
const titleInput = document.getElementById('title');
const otherTitle = document.getElementById('other-title');

// T-Shirt Info Selectors
const sizeSelect = document.getElementById('size');
const designSelect = document.getElementById('design');
const colorSelect = document.getElementById('color');

// Activities Selectors
const activities = document.querySelectorAll('.activities input');

// Payment Info Selectors
const paymentDropdown = document.getElementById('payment');
const creditCard = document.getElementById('credit-card');
const paypal = document.getElementById('paypal');
const bitcoin = document.getElementById('bitcoin');

// Submit Button Selector
const submitButton = document.querySelector("button[type='submit']");

// Regular Expressions
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const creditCardRegex = /^(\d-?){13,16}$/;
const zipCodeRegex = /^(\d-?){5}$/;
const cvvRegex = /^(\d-?){3}$/;


var totalCost = 0;

nameInput.focus();
otherTitle.remove();

titleInput.addEventListener("input", e => {
    if (e.target.value == 'other') {
        titleInput.parentNode.insertBefore(otherTitle, titleInput.nextElementSibling);
        document.getElementById('other-title').focus();
    } else {
        otherTitle.remove();
    }
});

// Stores Colors divided by theme
var themes = {
    jsPuns: [],
    iLovePuns: []
};
for (let i = 0; i < (colorSelect.options.length); i++) {
    var colorOption = colorSelect[i];
    const color = { value: colorOption.value, text: colorOption.text };
    if (colorOption.text.toUpperCase().indexOf('JS Puns'.toUpperCase()) > -1) {
        themes.jsPuns.push(color);
    } else {
        themes.iLovePuns.push(color);
    }
}

// Hides Color Data by Default
showColorData(0);

// This function will show or hide de Color options based on the param
function showColorData(state) {
    // 0 = hide, 1 = JsPuns, 2 = iLovePuns
    optionsLength = colorSelect.options.length;

    switch (state) {
        case 2:
            for (let i = optionsLength; i >= 0; i--) {
                colorSelect.options.remove(optionsLength);
                optionsLength -= 1;
            }
            for (let i = 0; i < themes.iLovePuns.length; i++) {
                elementProps = {
                    element: 'option',
                    content: themes.iLovePuns[i].text,
                    attr: [
                        { key: 'value', value: themes.iLovePuns[i].value }
                    ]
                }
                const element = createElement(elementProps);
                colorSelect.appendChild(element);
            }
            break;
        case 1:
            for (let i = optionsLength; i >= 0; i--) {
                colorSelect.options.remove(optionsLength);
                optionsLength -= 1;
            }
            for (let i = 0; i < themes.jsPuns.length; i++) {
                elementProps = {
                    element: 'option',
                    content: themes.jsPuns[i].text,
                    attr: [
                        { key: 'value', value: themes.jsPuns[i].value }
                    ]
                }
                const element = createElement(elementProps);
                colorSelect.appendChild(element);
            }
            break;
        default:
            for (let i = optionsLength; i >= 0; i--) {
                colorSelect.options.remove(optionsLength);
                optionsLength -= 1;
            }

            if (designSelect.selectedIndex === 0) {
                const colorDefault = document.createElement('option');
                colorDefault.text = 'Please select a T-shirt theme';
                colorSelect.appendChild(colorDefault);
            }
            break;
    }
}

// Listens to the Design dropdown and show/hide Color dropdown data
designSelect.addEventListener("input", e => {
    if (e.target.value === designSelect.options[0].value) {
        showColorData(0);
    } else if (e.target.value === designSelect.options[1].value) {
        showColorData(1);
    } else if (e.target.value === designSelect.options[2].value) {
        showColorData(2);
    }
});


activitiesList = [];
indexActivities();
function indexActivities() {
    for (i = 0; i < activities.length; i++) {
        const dataCost = activities[i].getAttribute('data-cost');
        const name = activities[i].getAttribute('name');
        const date = activities[i].getAttribute('data-day-and-time');
        activitiesList[i] = { dataCost: dataCost, name: name, date: date };
    }
}

// Add an event listener to each input and adds the function checkAvailability
activities.forEach(activities => activities.addEventListener("input", e => { checkAvailability(e); }));

function checkAvailability(event) {
    const dataCost = +event.target.getAttribute('data-cost');
    const name = event.target.getAttribute('name');
    const date = event.target.getAttribute('data-day-and-time');

    showTotal();
    updateActivities(event.target.checked);

    function showTotal() {
        totalCost = 0;
        const parent = activities[0].parentNode.parentNode;
        const child = document.getElementById('totalCost');
        if (document.getElementById('totalCost')) {
            parent.removeChild(child);
        }
        for (let i = 0; i < activities.length; i++) {
            if (activities[i].checked) {
                totalCost += +activities[i].getAttribute('data-cost');
            }
        }

        if (totalCost > 0) {
            const total = createElement({ element: 'div', content: `Total: $${totalCost}`, attr: [{ key: 'id', value: 'totalCost' }] });
            parent.appendChild(total);
        }

    }

    function updateActivities(checked) {
        if (date) {
            for (let i = 0; i < activitiesList.length; i++) {
                if (date.indexOf(activitiesList[i].date) > -1 && name != activitiesList[i].name) {
                    const elementToHide = document.getElementsByName(activitiesList[i].name)[0];
                    if (checked) {
                        elementToHide.setAttribute('disabled', true);
                    } else {
                        elementToHide.removeAttribute('disabled');
                    }
                }
            }
        }


    }

}

// Sets Initial Paymente Method to Credit Card
paymentDropdown.value = 'credit card';

// Disables the "Select Payment Method" option
paymentDropdown[0].setAttribute('disabled', true);

// Removes paypal and bitcoin divs
paypal.remove();
bitcoin.remove();

// Listens for Payment Dropdown and changes the payment option according to the selection
paymentDropdown.addEventListener("input", e => {
    creditCard.remove();
    paypal.remove();
    bitcoin.remove();
    switch (e.target.value) {
        case 'credit card':
            paymentDropdown.parentNode.append(creditCard);
            break
        case 'paypal':
            paymentDropdown.parentNode.append(paypal);
            break;
        case 'bitcoin':
            paymentDropdown.parentNode.append(bitcoin);
            break;
        default:
            break;

    }
});

const creditCardFields = document.querySelectorAll('#credit-card input');

// Validations
submitButton.addEventListener("click", e => {
    if (nameInput.value == '') {
        showError(nameInput.previousElementSibling, true, 'Please enter your name');
        e.preventDefault();
    }

    if (!emailRegex.test(mailInput.value)) {
        showError(mailInput.previousElementSibling, true, 'Please enter a valid email');
        e.preventDefault;
    }

    if (document.querySelectorAll('.activities input:checked').length == 0) {
        showError(document.querySelector('.activities legend'), true);
        e.preventDefault();
    }

    if (paymentDropdown.value === 'credit card') {
        if (!creditCardRegex.test(creditCardFields[0].value)) {
            var ccErr = 'Please enter a credit card number';
            if(creditCardFields[0].value.length < 13 && creditCardFields[0].value.length != 0 || creditCardFields[0].value.length > 16){
                ccErr = 'Please enter a number that is between 13 and 16 digits long';
            }
            showError(creditCardFields[0].previousElementSibling, true, ccErr);
            e.preventDefault();
        }
        if (!zipCodeRegex.test(creditCardFields[1].value)) {
            showError(creditCardFields[1].previousElementSibling, true);
            e.preventDefault();
        }
        if (!cvvRegex.test(creditCardFields[2].value)) {
            showError(creditCardFields[2].previousElementSibling, true);
            e.preventDefault();
        }
    }
});

nameInput.addEventListener("keydown", e => {
    if (e.target.value != '') {
        showError(nameInput.previousElementSibling, false);
    }
});
mailInput.addEventListener("keydown", e => {
    if (emailRegex.test(e.target.value)) {
        showError(mailInput.previousElementSibling, false);
    }
});
activities[0].addEventListener("input", e => {
    if (e.target.length != 0) {
        showError(document.querySelector('.activities legend'), false);
    }
});

creditCardFields.forEach(cc => cc.addEventListener("keyup", e => {
    switch (e.target.name) {
        case 'user-cc-num':
            if (creditCardRegex.test(e.target.value)) {
                showError(e.target.previousElementSibling, false);
            } else {
                var ccErr = 'Please enter a credit card number';
                if(e.target.value.length > 16){
                    ccErr = 'Please enter a number that is between 13 and 16 digits long';
                    showError(e.target.previousElementSibling, true, ccErr);
                }
            }
            break;
        case 'user-zip':
            if (zipCodeRegex.test(e.target.value)) {
                showError(e.target.previousElementSibling, false);
            }
            break;
        case 'user-cvv':
            if (cvvRegex.test(e.target.value)) {
                showError(e.target.previousElementSibling, false);
            }
            break;
        default:
            break;
    }
}));


function showError(element, show, errorMessage) {
    if (show) {
        if (!element.classList.contains('error')) {
            element.className = 'error';
            if (errorMessage) {
                error = {
                    element: 'div',
                    attr: [
                        {key: 'class', value: 'error-message'}
                    ],
                    content: errorMessage
                }
                const err = createElement(error);
                element.parentNode.insertBefore(err, element.nextElementSibling.nextElementSibling);
            }
        }
    } else {
        if (element.classList.contains('error')) {
            element.classList.remove('error');
            const errorElement = element.nextElementSibling.nextElementSibling;
            if (errorElement.className == 'error-message') {
                errorElement.remove();
            }
        }
    }
}


function createElement(element) {
    const ele = document.createElement(element.element);
    if (element.attr) {
        for (let i = 0; i < element.attr.length; i++) {
            ele.setAttribute(element.attr[i].key, element.attr[i].value);
        }
    }
    if (element.content) {
        ele.textContent = element.content;
    }
    return ele;
}
