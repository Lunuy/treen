
import TreeNode from "./TreeNode";
import ControllerTreeNodeData from "../Types/ControllerTreeNodeData";
import buildControllerTreeNode from "../Util/buildControllerTreeNode";

interface ControllerTreeNode extends TreeNode<ControllerTreeNode> {
    tag(target : TreeNode<any>) : void
}

class ControllerTreeNode extends TreeNode<ControllerTreeNode> {
    target: TreeNode<any>;
    constructor(className : any, data : any, childs : {[childName : string] : ControllerTreeNode}, target : TreeNode<any>, getTreeNodeClass : ((className : any) => typeof ControllerTreeNode)) {
        super(className, data, childs);
        this.target = target;
        this.tag && this.tag(target); //여기서 target에 대한 뭔가를 연결합니다.

        const targetListeners = {
            childAdded : (childName : string, child : TreeNode<any>) => {
                //컨트롤러에도 똑같은 child를 추가합니다.
                return this.addChild(childName, buildControllerTreeNode(getTreeNodeClass, child));
            },
            childRemoved: (childName : string) => {
                //컨트롤러에도 똑같은 child를 제거합니다.
                return this.removeChild(childName);
            },
            dead : () => {
                this.emit("dead");
                this.target.removeListeners(targetListeners);
            }
        }
        this.target.addListeners(targetListeners);
    }
    toData() : ControllerTreeNodeData {
        return [
            this.export ? this.export() : undefined,
            Object.fromEntries(Object.entries(this.childs).map(([childName, child]) => [childName, child.toData()]))
        ];
    }
}

export default ControllerTreeNode;