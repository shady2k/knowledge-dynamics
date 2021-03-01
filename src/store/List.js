import utils from './utils';

export default class List {
    constructor(title) {
        this.title = title;
        this.length = 0;
        this.schema = [];
        this.blocks = [];
    }

    addToTheEnd(obj) {
        const block = new Block(obj.data);
        this.blocks.push(block);
        this.schema.push(
            new Node(block.id)
        );
        this.length++;
    }

    getElementTitle() {
        return this.title;
    }

    getStructureLength() {
        return this.length;
    }

    getStructure() {
        const structure = this.schema.map((item) => {
            const block = this.getBlock(item.blockId);
            item.data = block.data;
            item.blockId = block.id;
            return item;
        });
        return structure;
    }

    getBlock(blockId) {
        return this.blocks.find((element) => {
            if (element.id == blockId) return element;
        });
    }

    changeBlock(blockId, obj) {
        this.blocks.some((element) => {
            if (element.id == blockId) {
                element.data = obj.data;
                return;
            }
        });
    }
}

class UIBlock {
    constructor(data = '') {
        this.id = utils.generateUUID();
        this.data = data;
    }    
}

class Block {
    constructor(data = '') {
        this.id = utils.generateUUID();
        this.data = data;
    }    
}

class Node {
    constructor(blockId, children = []) {
        this.id = utils.generateUUID();
        this.blockId = blockId || null;
        this.children = children;
        this.parent = null;
    }

    clone() {
        let that = Object.assign(new Node(), this);
        that.children = this.children.map((n) => n.clone());
        return that;
    }

    add(...children) {
        for (let child of children) {
            this.children.push(child);
        }
        return this;
    }

    traverse(callback, traversal = Node.Traversal.BreadthFirst) {
        traversal.call(this, callback);
        return this;
    }

    reduce(callback, initial, mode) {
        let acc = initial;
        this.traverse((n) => (acc = callback(acc, n)), mode);
        return acc;
    }

    every(callback) {
        return this.reduce((a, n) => a && callback(n), true);
    }

    some(callback) {
        return this.reduce((a, n) => a || callback(n), false);
    }

    find(callback, mode) {
        return this.reduce(
            (a, n) => a || (callback(n) ? n : false),
            false,
            mode
        );
    }

    includes(value) {
        return this.some((n) => n.value === value);
    }
}