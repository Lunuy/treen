
import TreeNode from "../TreeNode/TreeNode";
import ControllerTreeNodeData from "../Types/ControllerTreeNodeData";
import ControllerTreeNode from "../TreeNode/ControllerTreeNode";

function buildControllerTreeNode(getTreeNodeClass : ((className : any) => typeof ControllerTreeNode), target : TreeNode<any>, controllerTreeNodeData? : ControllerTreeNodeData) : ControllerTreeNode {
    if(!controllerTreeNodeData) {
        controllerTreeNodeData = [undefined,  {}];
    }
    const data = controllerTreeNodeData[0];
    const childs = Object.fromEntries(Object.keys(target.childs).map((childName) => {
        return [childName, buildControllerTreeNode(getTreeNodeClass, target.childs[childName], controllerTreeNodeData[1][childName])];
    }));
    return new (getTreeNodeClass(target.className))(target.className, data, childs, target, getTreeNodeClass);
}

export default buildControllerTreeNode;