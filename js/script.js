// Basic Info Selectors
const nameInput = document.getElementById('name');
const mailInput = document.getElementById('mail');
const titleInput = document.getElementById('title');

// T-Shirt Info Selectors
const sizeSelect = document.getElementById('size');
const designSelect = document.getElementById('design');
const colorSelect = document.getElementById('color');

// Activities Selectors
const activities = document.querySelectorAll('.activities input');

nameInput.focus();

titleInput.addEventListener("input", e => {
    if (e.target.value == 'other') {

        const otherElement = {
            element: 'input',
            attr:[
                {key:'id', value: 'other-title'},
                {key: 'placeholder', value: 'Your Job Role'}
            ]
        };

        const otherTitle = createElement(otherElement);

        titleInput.parentNode.insertBefore(otherTitle, titleInput.nextElementSibling);
        document.getElementById('other-title').focus();
    }
});

// Stores Colors divided by theme
var themes = {
    jsPuns: [],
    iLovePuns: []
};
for (let i = 0; i < (colorSelect.options.length); i++) {
    var colorOption = colorSelect[i];
    const color = {value: colorOption.value, text: colorOption.text};
    if(colorOption.text.toUpperCase().indexOf('JS Puns'.toUpperCase()) > -1) {
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
    optionsLength = colorSelect.options.length ; 
    if (state == 2) {
        for (let i = optionsLength; i >= 0; i--) {
            colorSelect.options.remove(optionsLength);
            optionsLength -= 1;
        }
        for (let i = 0; i < themes.iLovePuns.length; i++) {
            elementProps = {
                element: 'option',
                content: themes.iLovePuns[i].text,
                attr: [
                    {key: 'value', value: themes.iLovePuns[i].value}
                ]
            }
            const element = createElement(elementProps);
            colorSelect.appendChild(element);
        }
    } else if (state == 1) {
        for (let i = optionsLength; i >= 0; i--) {
            colorSelect.options.remove(optionsLength);
            optionsLength -= 1;
        }
        for (let i = 0; i < themes.jsPuns.length; i++) {
            elementProps = {
                element: 'option',
                content: themes.jsPuns[i].text,
                attr: [
                    {key: 'value', value: themes.jsPuns[i].value}
                ]
            }
            const element = createElement(elementProps);
            colorSelect.appendChild(element);
        }
    } else if (state == 0) {
        for (let i = optionsLength; i >= 0; i--) {
            colorSelect.options.remove(optionsLength);
            optionsLength -= 1;
        }
    
        if (designSelect.selectedIndex === 0) {
            const colorDefault = document.createElement('option');
            colorDefault.text = 'Please select a T-shirt theme';
            colorSelect.appendChild(colorDefault);
        }
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
for (i = 0; i < activities.length; i++) {
    const dataCost = activities[i].getAttribute('data-cost');
    const name = activities[i].getAttribute('name');
    const date = activities[i].getAttribute('data-day-and-time');
    activitiesList[i] = {dataCost: dataCost, name: name, date: date}
}

// Add an event listener to each input and add the function checkAvailability
activities.forEach(activities => activities.addEventListener("input", e => {checkAvailability(e);}));

function checkAvailability(event) {
    const dataCost = +event.target.getAttribute('data-cost');
    const name = event.target.getAttribute('name');
    const date = event.target.getAttribute('data-day-and-time');

    console.log(`target date ${date}`);

    if (totalCost <= 0) {
        const parent = activities[0].parentNode.parentNode;
        totalCost += +dataCost;
        const total = createElement({element: 'div', content: `Total: $${totalCost}`, attr: [{key: 'id', value: 'totalCost'}]});
        parent.appendChild(total);
    } else {
        const total = document.getElementById('totalCost');
        totalCost += +dataCost;
        total.innerText = `Total: $${totalCost}`;
    }

    for (let i = 0; i < activitiesList.length; i++) {

        if (date.indexOf(activitiesList[i].date) > -1) {
            console.log(`list date: ${activitiesList[i].date}`);
            activitiesList.splice(date, 1);
        }
        
    }
}

var totalCost = 0;
function totalCalculator(cost) {
    return totalCost = totalCost + cost;
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
