// adds "spacer" to "input#id" every "characterNumber" characters
function addSpacer(id, spacer, characterNumber) {
    // getting element
    let element = document.getElementById(id);
    // setting number of characters to split accordingly
    let regexSplit = new RegExp(`.{1,${characterNumber}}`, 'g');
    // setting the spacer between the split characters
    let regexJoin = new RegExp(`${spacer}`, 'g');
    // adding the event listener to use the regexSplit and regexJoin
    element.addEventListener('input', () => {
        if (element.value) {
            let elementValue = element.value.replace(regexJoin, "");
            let elementValueSplit = elementValue.match(regexSplit);
            element.value = elementValueSplit.join(spacer);
        }
    });
}

//checks who the card issuer is
function getCardIssuer(partialCreditCardNumber) {
    // setting each card issuer specific regex
    const visaRegex = /^4/;
    const mastercardRegex = /^5[1-5]/;
    const amexRegex = /^3[47]/;
    const discoverRegex = /^(6011|65|64[4-9]|622)/;
    // returning each card issuer according to the regex
    if (visaRegex.test(partialCreditCardNumber)) {
        return "visa";
    } else if (mastercardRegex.test(partialCreditCardNumber)) {
        return "mastercard";
    } else if (amexRegex.test(partialCreditCardNumber)) {
        return "amex";
    } else if (discoverRegex.test(partialCreditCardNumber)) {
        return "discover";
    } else {
        return "card";
    }
}

// Prevents keys on input#id if it doesn't match regexValue or if it's longer than or equal to wantedLength
function preventKeys(id, regexValue, wantedLength) {
    // setting regexValue to a new regular expression
    const regex = new RegExp(regexValue);
    // getting element
    const element = document.getElementById(id);
    // adding event listener to prevent keypresses that don't match regex or that are too long
    element.addEventListener('keypress', (event) => {
        if (!regex.test(event.key)) {
            event.preventDefault();
        } else if (wantedLength && event.target.value.length >= wantedLength) {
            event.preventDefault();
        }
    });
}

// displays logo in card number input
function showCardIssuer() {
    document.getElementById("cardNumber").addEventListener('input', function () {

        let cardProvider = getCardIssuer(this.value.replace(/ /g, ""));
        this.style.setProperty('--cardImage', `url(./images/${cardProvider}.svg)`);
    });
}

//Checks if expiry date is valid and if not colors it red.
function checkExpiry() {
    const expiry = document.getElementById('expiry');

    expiry.addEventListener('input', function () {
        if (this.value.slice(0, 2) > 12 || this.value.slice(0, 2) === "00") {
            this.style.setProperty('--accent-color', 'red');
        } else if (this.value.length === 5 && !isDateAfterToday(this.value)) {
            this.style.setProperty('--accent-color', 'red');

        }
        else {
            this.style.setProperty('--accent-color', '#621aff');
        }
    });
}

//Checks if date is after today
function isDateAfterToday(inputDate) {
    //Getting current date and splitting it into month and years
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // splitting input date into month and years
    const [month, year] = inputDate.split('/');

    //adjusting the year to 4 digits
    const adjustedYear = currentYear.toString().slice(0, 2) + year;

    const compareDate = new Date(adjustedYear, +month - 1, 31);
    // returning if current date is before the input date
    return (compareDate >= currentDate && adjustedYear - currentYear <= 10);




}

//Validates all inputs

function validateInputs(e) {
    e.preventDefault();
    ("valdating");
    const form = e.target;
    const fullName = document.getElementById('name');
    const cardNumber = document.getElementById('cardNumber');
    const expiry = document.getElementById('expiry');
    const cvc = document.getElementById('cvc');
    const discount = document.getElementById('discount');
    let alert = "";
    let testsFailed = 0;
    if (!/ /.test(fullName.value)) {
        fullName.style.setProperty("--accent-color", "red");
        alert += `Please input a valid full name.\n`;
        testsFailed++;
    }
    if (!/[0-9]{16}/g.test(cardNumber.value.replace(/ /g, ""))) {
        cardNumber.style.setProperty("--accent-color", "red");
        alert += `Please input a valid card number.\n`;
        testsFailed++;
    }
    if (checkExpiry(expiry.value) && expiry.value.length === 5 && expiry.value.slice(0, 2) !== "00") {
        alert += `Please input a valid expiry date.\n`;
        testsFailed++;
    }
    if (cvc.value.length !== 3) {
        cvc.style.setProperty("--accent-color", "red");
        alert += `Please input a valid cvc.\n`;
        testsFailed++;
    }
    if (discount.value != "" && !/^[A-Z0-9]*-[A-Z0-9]*-[A-Z0-9]*$/i.test(discount.value)) {
        discount.style.setProperty("--accent-color", "red");
        alert += `Please input a valid discount code.\n`;
        testsFailed++;
    }
    if (testsFailed > 0) {
        window.alert(alert);
    } else {
        form.submit();
    }
}

//if card is amex change cvc to 4 chars.
function changeCVC() {
    //remove listeners
    const clone = cvc.cloneNode(true);
    cvc.parentNode.replaceChild(clone, cvc);
    clone.focus();
    if (getCardIssuer(cardNumber.value) === "amex") {
        preventKeys('cvc', `^[0-9]$`, 4);
    } else {
        preventKeys('cvc', `^[0-9]$`, 3);
    }
    cvc.addEventListener("focus", changeCVC);
}
cvc.addEventListener("focus", changeCVC);

discount.addEventListener("input", (event) => {
    event.target.value = event.target.value.toUpperCase();
    const applyDiscount = document.getElementById("apply-discount");
    if (/^[A-Z]{8}-\d{2}-[A-Z]{3}$/.test(event.target.value)) {
        event.target.style.setProperty("--accent-color", "#631aff");
        applyDiscount.style.color = "#631aff";
        applyDiscount.removeAttribute("disabled");
    } else {
        applyDiscount.setAttribute("disabled", "");
        applyDiscount.style.color = "#631aff6a";
        event.target.style.setProperty("--accent-color", "red");
    }
});

checkExpiry();
preventKeys('name', "^[a-zA-Z ]$");
preventKeys('cardNumber', "^[0-9]$");
preventKeys('expiry', "^[0-9]$");
preventKeys('discount', "[\-A-Za-z0-9]");
addSpacer('cardNumber', ' ', 4);
addSpacer('expiry', '/', 2);
showCardIssuer();

// Apply discount

const applyDiscount = document.getElementById("apply-discount");
applyDiscount.addEventListener("click", (event) => {
    console.log(event.target);
    if (!event.target.getAttribute("disabled")) {
        discount.style.setProperty("--accent-color", "#11d100b0");
        discount.setAttribute("readonly", "");
    }
});

// form validation
document.querySelector('#creditCardForm').addEventListener('submit', validateInputs);