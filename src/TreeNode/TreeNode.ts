
import EventEmitter from "wolfy87-eventemitter";
import TreeNodeData from "../Types/TreeNodeData";

declare interface TreeNode<T extends TreeNode<T>> {
    on(event : "childAdded", listener : (childName : string, treeNode : T) => void) : this
    on(event : "childRemoved", listener : (childName : string) => void) : this
    on(event: string, listener: Function): this
    on(event: RegExp, listener: Function): this
    on(event : "dead", listener: () => void) : this

    emit(event : "childAdded", childName : string, treeNode : T) : this
    emit(event : "childRemoved", childName : string) : this
    emit(event : "dead") : this
    emit(event : string, ...args : any): this
    emit(event : RegExp, ...args : any): this

    import(data : any): void
    export(): any
}

class TreeNode<T extends TreeNode<T>> extends EventEmitter { //It's just Model, so almost properties are public.
    className: any;
    childs: { [childName: string]: T; };
    constructor(className : any, data : any, childs : {[childName : string] : T}) {
        super();
        this.className = className;
        this.childs = childs;

        this.import ? this.import(data) : 0;
    }
    addChild(childName : string, treeNode : T) {
        this.childs[childName] = treeNode;
        this.emit("childAdded", childName, treeNode);
        return treeNode;
    }
    getChild(childName : string) {
        return this.childs[childName];
    }
    getChilds() {
        return this.childs;
    }
    removeChild(childName : string) {
        const child = this.childs[childName];
        delete this.childs[childName];
        this.emit("childRemoved", childName);
        return child;
    }
}

export default TreeNode;