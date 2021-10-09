import { TransactionRecord, TransactionNode } from './models';
import pd from 'probability-distributions';
import faker from 'faker';

var nodes: TransactionNode[] = new Array<TransactionNode>();
var trans: TransactionRecord[] = new Array<TransactionRecord>();

const DEFAULT_PROB_NEW_NODE = 0.3;

function makeNode() {
    const fakeName = faker.name.firstName() + ' ' + faker.name.lastName();
    var node = new TransactionNode(fakeName);
    nodes.push(node);
    return node;
}

function randomPaymentAmount(): number {
    var tmp = pd.rnorm(1, 800, 500)[0];
    while (tmp < 0) {
        tmp = pd.rnorm(1, 800, 500)[0];
    }
    return Math.round(tmp);
}

function ensureNode(probe_idx: number) {
    if (probe_idx < nodes.length)
        return nodes[probe_idx];
    else
        return makeNode();
}

function generateTransaction( timeStep: number, probNewNode: number) {
    const [from_idx, to_idx] = pd.rint(2, 0, Math.round(nodes.length * (1 + probNewNode)), 1);
    var from: TransactionNode = ensureNode(from_idx);
    var to: TransactionNode = ensureNode(to_idx);
    var amt = randomPaymentAmount();
    const transaction = new TransactionRecord(timeStep, from.name, to.name, amt);
    trans.push(transaction);
    return transaction;
}


function generateTransactionLog(steps, probNewNode: number= DEFAULT_PROB_NEW_NODE) {
    var timeStep: number = 0;
    while (timeStep < steps) {
        generateTransaction(timeStep++, probNewNode);
    }
    return trans;
}

// const result = generateTransactionLog(200);
// console.log(result);


export default generateTransactionLog;