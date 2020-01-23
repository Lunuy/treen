/*
# 이상적 트리 도구를 만들기 위한 예제
콘솔에 문자열을 출력하는 코드를 여러가지 언어로 컴파일하는 예제입니다.
편의를 위해 동적 타입 언어를 사용합니다.

# 요구 조건
각 구문들이 객체(또는 유사한 형태)로 이루어져 계층적으로 이루어져 있어야 한다. O
구조의 변화에 대한 실시간 이벤트가 존재해야 한다. X

# 흐름
(코드)데이터 => (객체로 변환 또는 그대로) => 실시간 컴파일러
*/

const codeData = {
    type:"log",
    childs:{
        content:{
            type:"string",
            data:{
                value:"HI\\\""
            },
            childs:{}
        }
    }
};

const strCodeData = JSON.stringify(codeData);

class TreeNode {
    constructor(data, childs) {
        this.data = data;
        this.childs = childs;
    }
}

class ControllerTreeNode extends TreeNode {
    constructor(data, childs, target) {
        super(data, childs);
        this.target = target;
    }
}

const typeClasses = {
    log: class Log extends TreeNode {
        getContent() {
            return this.childs.content;
        }
    },
    string: class String extends TreeNode {
        getValue() {
            return this.data.value;
        }
    }
};

const compilerJSTypeClasses = {
    log: class Log extends ControllerTreeNode {
        compile() {
            return `console.log(${this.childs.content.compile()})`;
        }
    },
    string: class String extends ControllerTreeNode {
        compile() {
            return `"${this.target.getValue().replace(/\\/g, "\\\\").replace(/\"/g, "\\\"")}"`;
        }
    }
}

const compilerPyTypeClasses = {
    log: class Log extends ControllerTreeNode {
        compile() {
            return `print(${this.childs.content.compile()})`;
        }
    },
    string: class String extends ControllerTreeNode {
        compile() {
            return `"${this.target.getValue().replace(/\\/g, "\\\\").replace(/\"/g, "\\\"")}"`;
        }
    }
}

// 파싱할때 순서가... 점점 깊게가 아니고 점점 얕게일수밖에 없다.
// 이래선 데이터와 식별자를 구별할 수가 없음.(데이터의 표현에 제약이 생김)
/*
const code = JSON.parse(strCodeData, (key, value) => {
    console.log("KEY : ", key);
    if(value instanceof Object) {
        if(key === "childs") {
            return value;
        }
        if(key === "data") {
            return value;
        }
        return new typeClasses[value.type](value.data, value.childs);
    }
    return value;
});*/

function parseTreeNode(typeClasses, jsonData) {
    const childs = Object.fromEntries(Object.entries(jsonData.childs).map(([name, jsonData]) => {
        return [name, parseTreeNode(typeClasses, jsonData)];
    }));
    return new typeClasses[jsonData.type](jsonData.data, childs);
}

function parseControllerTreeNode(typeClasses, jsonData, target) {
    const childs = Object.fromEntries(Object.entries(jsonData.childs).map(([name, jsonData]) => {
        return [name, parseControllerTreeNode(typeClasses, jsonData, target.childs[name])];
    }));
    return new typeClasses[jsonData.type](jsonData.data, childs, target);
}

const code = parseTreeNode(typeClasses, codeData);
const compilerJS = parseControllerTreeNode(compilerJSTypeClasses, {
    type:"log",
    childs:{
        content:{
            type:"string",
            childs:{}
        }
    }
}, code);
const compilerPy = parseControllerTreeNode(compilerPyTypeClasses, {
    type:"log",
    childs:{
        content:{
            type:"string",
            childs:{}
        }
    }
}, code);

console.log(code.getContent().getValue());
console.log(`JS : ${compilerJS.compile()}`);
console.log(`Py : ${compilerPy.compile()}`);


/*
특수한 경우가 아니라면 대부분의 경우 ControllerTreeNode와 TreeNode의 모든 노드는 1:1로 매칭됩니다.
특수한 경우라면 그건 다른 라이브러리를 쓰심을 추천드립니다.

근데 TreeNode랑 그걸 컨트롤하는 애들이 1:1로 매칭되지 않아야 되는 경우가 있긴 있나요?
암만 봐도 있을 수가 없는데 ..
아시는 분은 연락좀 주세용
*/