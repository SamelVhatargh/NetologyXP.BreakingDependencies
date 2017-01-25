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

var itemTypes =
    {
        "Groceries": {
            "Alabama": 0,
            "Alaska": 0,
            "Arizona": "",
            "Arkansas": 0.015,
            "California": "",
            "Colorado": "",
            "Connecticut": ""
        },
        "PrescriptionDrug": {
            "Alabama": "",
            "Alaska": 0,
            "Arizona": "",
            "Arkansas": "",
            "California": "",
            "Colorado": "",
            "Connecticut": ""
        }
    };

var taxes = {
    "Alabama": 0.04,
    "Alaska": 0,
    "Arizona": 0.056,
    "Arkansas": 0.065,
    "California": 0.075,
    "Colorado": 0.029,
    "Connecticut": 0.0635
};

class State {
    constructor(name) {
        this._name = name;
        this._base = taxes[this._name];
    }

    get name() {
        return this._name;
    }

    calculatePriceFor(item) {
        var result = null;
        if (item.type === "PreparedFood") {
            result = ( 1 + this._base) * item.price;
        }
        else {
            result = this._calc(item.type) * item.price + item.price;
        }
        return result;
    }

    _calc(itemType) {
        var itemTypeTaxModifier = itemTypes[itemType];
        if (itemTypeTaxModifier[this._name] === "") {
            return 0;
        }
        return this._base + itemTypeTaxModifier[this._name];
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