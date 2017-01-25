"use strict";

// Этот код можно менять как угодно
var items = {
    "milk": {price: 5.5, type: "Groceries"},
    "eggs": {price: 3.0, type: "Groceries"},
    "coca-cola": {price: 0.4, type: "Groceries"},
    "amoxicillin": {price: 6.7, type: "Groceries"},
    "aspirin": {price: 0.2, type: "PrescriptionDrug"},
    "marijuana": {price: 1.4, type: "PrescriptionDrug"},
    "hamburger": {price: 2, type: "PreparedFood"},
    "ceasar salad": {price: 4.2, type: "PreparedFood"},
};

class Item {
    constructor(name){
        this._price = items[name].price;
        this._type = items[name].type;
        this._name = name;
    }

    get price() {
        return this._price;
    }

    get type() {
        return this._type;
    }

    get name() {
        return this._name;
    }
}

var states = {
    "Alabama": {
        "baseTax": 0.04,
        "itemTypeTaxes": {
            "PrescriptionDrug": "no tax",
        },
    },
    "Alaska": {
        "baseTax": 0,
        "itemTypeTaxes": {
        },
    },
    "Arizona": {
        "baseTax": 0.056,
        "itemTypeTaxes": {
            "Groceries": "no tax",
            "PrescriptionDrug": "no tax",
        },
    },
    "Arkansas": {
        "baseTax": 0.065,
        "itemTypeTaxes": {
            "Groceries": 0.015,
            "PrescriptionDrug": "no tax",
        },
    },
    "California": {
        "baseTax": 0.0075,
        "itemTypeTaxes": {
            "Groceries": "no tax",
            "PrescriptionDrug": "no tax",
        },
    },
    "Colorado": {
        "baseTax": 0.029,
        "itemTypeTaxes": {
            "Groceries": "no tax",
            "PrescriptionDrug": "no tax",
        },
    },
    "Connecticut": {
        "baseTax": 0.0635,
        "itemTypeTaxes": {
            "Groceries": "no tax",
            "PrescriptionDrug": "no tax",
        },
    },
    "Tennessee": {
        "baseTax": 0.07,
        "itemTypeTaxes": {
            "Groceries": 0.05,
        },
    },
    "Texas": {
        "baseTax": 0.0625,
        "itemTypeTaxes": {
            "Groceries": "no tax",
            "PrescriptionDrug": "no tax",
        },
    },
};

class State {
    constructor(name) {
        this._name = name;
        this._baseTax = states[this._name]['baseTax'];
        this._itemTypeTaxes = states[this._name]['itemTypeTaxes'];
    }

    get name() {
        return this._name;
    }

    calculatePriceFor(item) {
        return (1 + this._getTaxModifier(item.type)) * item.price;
    }

    _getTaxModifier(itemType) {
        var itemTypeTaxModifier = itemType in this._itemTypeTaxes
            ? this._itemTypeTaxes[itemType] : 0;
        if (itemTypeTaxModifier === "no tax") {
            return 0;
        }
        return this._baseTax + itemTypeTaxModifier;
    }
}

class TaxCalculator {
    // У этой функции нелья менять интерфейс
    // Но можно менять содержимое
    calculateTax() {
        var ordersCount = this._getOrdersCount();
        var state = this._getSelectedState();
        this._print(`----------${state.name}-----------`);
        for (var i = 0; i < ordersCount; i++) {
            var item = this._getSelectedItem(i);
            var result = state.calculatePriceFor(item);
            this._print(`${item.name}: $${result.toFixed(2)}`);
        }
        this._print(`----Have a nice day!-----`);
    }

    _getSelectedItem(i) {
        return new Item(getSelectedItem());
    }

    _getSelectedState() {
        return new State(getSelectedState());
    }

    _getOrdersCount() {
        return getOrdersCount();
    }

    _print(text) {
        console.log(text);
    }
}

class TestableTaxCalculator extends TaxCalculator
{
    constructor(state, items) {
        super();
        this._state = state;
        this._items = items;
        this._ordersCount = items.length;
        this._lines = '';
    }

    _getOrdersCount() {
        return this._ordersCount;
    }

    _getSelectedItem(i) {
        return new Item(this._items[i]);
    }

    _getSelectedState() {
        return new State(this._state);
    }

    _print(text) {
        this._lines = this._lines + text + '\n';
    }

    getPrintedLines() {
        return this._lines;
    }
}

//############################
//Production - код:
calculateTaxes();

//############################
//Тесты:
var tests = [
    () => assertEquals(3.0 * (1 + 0.04), new State("Alabama").calculatePriceFor(new Item("eggs"))),
    () => assertEquals(0.4 * (1 + 0.015 + 0.065), new State("Arkansas").calculatePriceFor(new Item("coca-cola"))),
    () => assertEquals(6.7 * (1 + 0.0), new State("Alaska").calculatePriceFor(new Item("amoxicillin"))),
    () => assertEquals(6.7 * (1 + 0.0), new State("California").calculatePriceFor(new Item("amoxicillin"))),
    () => assertEquals(2 * (1 + 0.0635), new State("Connecticut").calculatePriceFor(new Item("hamburger"))),

    () => assertEquals(5.5 * (1 + 0.07 + 0.05), new State("Tennessee").calculatePriceFor(new Item("milk"))),
    () => assertEquals(2 * (1 + 0.07), new State("Tennessee").calculatePriceFor(new Item("hamburger"))),
    () => assertEquals(0.2 * (1 + 0.07), new State("Tennessee").calculatePriceFor(new Item("aspirin"))),

    () => assertEquals(5.5 * (1 + 0.0), new State("Texas").calculatePriceFor(new Item("milk"))),
    () => assertEquals(2 * (1 + 0.0625), new State("Texas").calculatePriceFor(new Item("hamburger"))),
    () => assertEquals(0.2 * (1 + 0.0), new State("Texas").calculatePriceFor(new Item("aspirin"))),


    function () {
        let calculator = new TestableTaxCalculator("Colorado", ["milk", "hamburger"]);
        calculator.calculateTax();
        let expected = '----------Colorado-----------\n'
            + 'milk: $5.50\n'
            + 'hamburger: $2.06\n'
            + '----Have a nice day!-----\n';
        var actual = calculator.getPrintedLines();
        if (expected === actual) {
            return 0;
        }
        console.error(`Fail! Expected:\n\n ${expected}, Actual:\n\n ${actual}`);
        return -1;
    }
];

//Раскомментируйте следующую строчку для запуска тестов:
runAllTests (tests);

//############################
//Код ниже этой строчки не надо менять для выполнения домашней работы

function calculateTaxes() {
    var calculator = new TaxCalculator();
    calculator.calculateTax();
}

function getSelectedItem() {
    var items = ["milk", "eggs", "coca-cola", "amoxicillin", "aspirin", "marijuana", "hamburger", "ceasar salad"];
    return items[Math.floor(Math.random() * items.length)];
}

function getSelectedState() {
    var state = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut"];
    return state[Math.floor(Math.random() * state.length)];
}

function getOrdersCount() {
    return Math.floor(Math.random() * 3) + 1;
}

//############################
// Кустарный способ писать тесты

function assertEquals(expected, actual) {
    var epsilon = 0.000001;
    var difference = Math.abs(expected - actual);
    if (difference > epsilon || difference === undefined || isNaN(difference)) {
        console.error(`Fail! Expected: ${expected}, Actual: ${actual}`);
        return -1;
    }
    return 0;
}

function runAllTests(tests) {
    var failedTests = tests
        .map((f) => f())
        .map((code) => {
            if (code === -1) {
                return 1
            } else {
                return 0
            }
        })
        .reduce((a, b) => a + b, 0);

    if (failedTests === 0) {
        console.log(`Success: ${tests.length} tests passed.`);
    }
    else {
        console.error(`Fail: ${failedTests} tests failed.`);
    }
}