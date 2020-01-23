// console.log(Math.max(...)) code compile example. (To javascript)
// Math.max를 console.log찍는 코드를 컴파일을 하는 예제 (JS로)

const { ModelTreeNode, ControllerTreeNode, buildModelTreeNode, buildControllerTreeNode } = require("../dist");

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
const compilerJSTreeNode = buildControllerTreeNode(className => compilerJSNodeClassesObj[className], treeNode, [null,{"content":[{"space":false},{"0":[null,{}],"1":[null,{}]}]}]);

console.log(compilerJSTreeNode);
console.log(JSON.stringify(treeNode.toData()));

console.log(compilerJSTreeNode.compile());
console.log(JSON.stringify(compilerJSTreeNode.toData()));
compilerJSTreeNode.target.getContent(compilerJSTreeNode).space = false;
console.log(compilerJSTreeNode.compile());
console.log(JSON.stringify(compilerJSTreeNode.toData()));
