import cytoscape from 'cytoscape';
import { enableRipple } from '@syncfusion/ej2-base';
// import euler from 'cytoscape-euler';
import { script } from './script';
import World from './world';
import cola from 'cytoscape-cola';
import generateTransactionLog from './generate';

import { Slider } from '@syncfusion/ej2-inputs';
import { Button } from '@syncfusion/ej2-buttons';
import { TransactionRecord } from './models';

// register nodeHtmlLabel extension
var nodeHtmlLabel = require('cytoscape-node-html-label');
nodeHtmlLabel(cytoscape);

enableRipple(true);
cytoscape.use(cola);

const canvas = document.getElementById('cc-demo');
const logDiv = document.getElementById('transaction_log');
let cy = null;
let world = null;

var mainNodeDiameter = 20;
var otherNodesDiameter = 17;
const layoutCoseOptions = {
    name: 'cose',
    padding: 100,
    nodeOverlap: 10,
    idealEdgeLength: function (edge) {
        switch (edge.data().type) {
            case 1:
                return 30;
            case 2:
            case 3:
                return 120;
            case 0:
            default:
                return 45;
        }
    },
    edgeElasticity: function (edge) {
        switch (edge.data().type) {
            case 1:
                return 50;
            case 2:
            case 3:
                return 200;
            case 0:
            default:
                return 100;
        }
    },
    nestingFactor: 1.2,
    initialTemp: 100,
    coolingFactor: 0.99,
    minTemp: 10.0,
    gravity: 1.4
};

const style: cytoscape.Stylesheet[] = [
    {
        selector: 'node', // default node style
        style: {
            'width': mainNodeDiameter + 'px',
            'height': mainNodeDiameter + 'px',
            'overlay-padding': '5px',
            'overlay-opacity': 0,
            'z-index': 10,
            'border-width': 2,
            'border-opacity': 0
        }
    },
    {
        selector: 'node[type=0]',
        style: {
            'background-color': '#7CACC2'
        }
    },
    {
        selector: 'node[type=1]',
        style: {
            'width': otherNodesDiameter + 'px',
            'height': otherNodesDiameter + 'px',
            'background-color': '#969696'
        }
    },
    {
        selector: 'node[type=2]',
        style: {
            'width': otherNodesDiameter + 'px',
            'height': otherNodesDiameter + 'px',
            'background-color': '#463231'
        }
    },
    {
        selector: 'edge', // default edge style
        style: {
            'curve-style': 'unbundled-bezier',
            'control-point-distance': 30,
            'control-point-weight': 0.5,
            'opacity': 0.9,
            'overlay-padding': '3px',
            'overlay-opacity': 0,
            'label': 'data(amt)',
            'font-family': 'FreeSet,Arial,sans-serif',
            'font-size': 9,
            'font-weight': 'bold',
            'text-background-opacity': 1,
            'text-background-color': '#ffffff',
            // 'text-background-padding': 3,
            'text-background-shape': 'roundrectangle',
            'width': 1
        }
    },
    {
        selector: 'edge[type=0]',
        style: {
            'color': '#AAAAAA',
            'line-color': '#AAAAAA',
            'target-arrow-shape': 'triangle-backcurve',
            'target-arrow-color': '#AAAAAA'
        }
    },
    {
        selector: 'edge[type=1]',
        style: {
            'color': '#B659C7',
            'line-color': '#B659C7',
            'target-arrow-shape': 'triangle-backcurve',
            'target-arrow-color': '#B659C7'
        }
    },
    {
        selector: 'edge[type=2]',
        style: {
            'color': '#D9952F',
            'line-color': '#D9952F',
            'target-arrow-color': '#D9952F'
        }
    },
    {
        selector: 'edge[type=3]',
        style: {
            'color': '#C13131',
            'line-color': '#C13131',
            'target-arrow-shape': 'triangle-backcurve',
            'target-arrow-color': '#C13131'
        }
    },
    {
        selector: 'node:selected',
        style: {
            'border-width': 2,
            'border-style': 'solid',
            'border-color': '#3f3f3f',
            'border-opacity': 1
        }
    }
];


var networkGrowthRate: number = 0.3;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var transactions: TransactionRecord[];
var nextTransactionIdx: number = 0;

async function logTransaction(transaction) {
    var ele = document.createElement('div');
    ele.innerHTML = transaction.from + " -> " + transaction.to + "  $" + transaction.amt;
    logDiv.appendChild(ele);
}


async function advanceSimulation() {

    if (nextTransactionIdx === transactions.length) {
        console.log('done');
        return false;
    }

    var next = transactions[nextTransactionIdx++];
    logTransaction(next);
    world.addPromise(
        next.from,
        next.to,
        next.amt,
        '$');
    return true;
}


async function runSimulation() {
    transactions = generateTransactionLog(50, networkGrowthRate);
    nextTransactionIdx = 0;

    cy.layout(layoutCoseOptions).run();

    var keepGoing = true;
    while (keepGoing) {
        keepGoing = await advanceSimulation();
        await sleep(200);
        cy.layout(layoutCoseOptions).run();
    }
}

function initGraph() {

    const graphElements = {
        nodes: [],
        edges: []
    };

    cy = cytoscape({
        container: canvas,
        elements: graphElements,
        style: style,
        layout: layoutCoseOptions
    });

    cy.nodeHtmlLabel([
        {
            query: 'node:selected',
            cssClass: 'cy-title',
            valign: 'top',
            valignBox: 'top',
            tpl: function (data) {
                return '<p class="cy-title__name">' + data.name + '</p>' +
                    '<p  class="cy-title__info">' + data.id + '</p>';
            }
        }]);

    world = new World(cy);

    cy.on('tap', function () {
        // nceScript();
        // doLayout();
    });

    cy.animate({
        zoom: 0.5
    }, {
        duration: 100
    });

    cy.layout(layoutCoseOptions).run();

    const growthRateSlider = new Slider({
        min: 0,
        max: 150,
        value: 30,
        ticks: {
            placement: 'Before',
            largeStep: 10,
            smallStep: .5
        },
        change: function (settings) {
            networkGrowthRate = settings.value[0] / 150;
        }
    });
    growthRateSlider.appendTo('#growth-rate-slider');

    var button = new Button({ content: 'go', cssClass: 'e-flat e-primary' });
    button.appendTo('#go-button');
    document.getElementById('go-button').onclick = () =>  runSimulation();

    // button.addEventListener('click', () => console.log('hi') );
}

function doLayout() {
    cy.layout(layoutCoseOptions).run();
}

function doStep(step) {
    console.log(step);
    if (step.type === 'mutual') {
        world.addMutual(
            step.to,
            step.from,
            step.amt,
            step.currency);
    }
    else if (step.type === 'promise') {
        world.addPromise(
            step.from,
            step.to,
            step.amt,
            step.currency);
    }
    else if (step.type === 'users') {
        step.users.forEach((name: string) => {
            world.addUser(name);
        });
    }
    else if (step.type === 'reset') {
        world.reset();
    }
    else if (step.type === 'reciprocity') {
        world.reciprocity(step.users);
    }
}

let next = 0;
let done = false;
function advanceScript() {
    if (!done) {
        doStep(script[next]);
        next++;
    }
    done = next >= script.length;
}


initGraph();

// const updateWorld = debounce(createWorld, 250);
