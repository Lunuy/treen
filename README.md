Treen
-------

# Treen
Treen is a javascript tree structure library for model-controller(view) structure.
Tree node has two types : Model, Controller.
Model is a just model. It stores data, and can has method for convenience.
Controller depend on other Tree node, mainly it's used to show / transform / compute Model data, it works like View and Controller in MVC pattern.   
   
It doesn't support very deep(over call stack) JSON. If you need it, tell me why. I'll update.

# Install
```bash
npm install treen
```
```js
const treen = require("treen");
```

# Classes

## TreeNode
It's a parent class of ModelTreeNode, ControllerTreeNode.
It can be loaded from data. It has methods used to control child TreeNodes, and it extends eventemitter for child Add / Remove and dead event.

## ModelTreeNode
It's a just model. It stores data and it's the center of ControllerTreeNode's communication.

## ControllerTreeNode
It depend on target TreeNode(ModelTreeNode or ControllerTreeNode).
It's used to do any works using data(or method) that TreeNode has.
Show data, transform data, update data, etc.
It works like View and Controller in MVC pattern.

# Example
```js
// "console.log(Math.max(...))" code realtime compile example. (To javascript)
// Sorry, It doesn't have code relationed to event, I will update code soon.

const { ModelTreeNode, ControllerTreeNode, buildModelTreeNode, buildControllerTreeNode } = require("treen");

const treeNodeClassesObj = {
    Log: class Log extends ModelTreeNode {
        getContent(treeNode = this) {
            return treeNode.childs.content;
        }
    },
    Max: class Max extends ModelTreeNode{
        getArgs(treeNode = this) {
            return Object.values(treeNode.childs);
        }
    },
    Number: class Number extends ModelTreeNode {
        import(data) {
            this.value = data;
        }
        export() {
            return this.value;
        }

        setValue(value) {
            this.value = value;
        }
        getValue() {
            return this.value;
        }
    }
};

const compilerJSNodeClassesObj = {
    Log: class Log extends ControllerTreeNode {
        compile() {
            return `console.log(${this.target.getContent(this).compile()})`;
        }
    },
    Max: class Max extends ControllerTreeNode {
        import(data) {
            this.space = data ? data.space : false;
        }
        export() {
            return {
                space: this.space
            };
        }

        compile() {
            return `Math.max(${this.target.getArgs(this).map(compiler => compiler.compile()).join(","+(this.space ? " " : ""))})`;
        }
    },
    Number: class Number extends ControllerTreeNode {
        compile() {
            return `${this.target.getValue()}`;
        }
    }
};

const treeNodeData = [
    "Log",
    {},
    {
        "content":[
            "Max",
            {},
            {
                "0":[
                    "Number",
                    5,
                    {}
                ],
                "1":[
                    "Number",
                    6,
                    {}
                ]
            }
        ]
    }
];

const treeNode = buildModelTreeNode(className => treeNodeClassesObj[className], treeNodeData);
const compilerJSTreeNode = buildControllerTreeNode(className => compilerJSNodeClassesObj[className], treeNode);

console.log(compilerJSTreeNode);
console.log(JSON.stringify(treeNode.toData()));

console.log("No space compile -------------");
console.log(compilerJSTreeNode.compile());
console.log(JSON.stringify(compilerJSTreeNode.toData()));
compilerJSTreeNode.target.getContent(compilerJSTreeNode).space = true;

console.log("Yes space compile -------------");
console.log(compilerJSTreeNode.compile());
console.log(JSON.stringify(compilerJSTreeNode.toData()));
```