import TreeNodeData from "../Types/TreeNodeData";
import ModelTreeNode from "../TreeNode/ModelTreeNode";

function buildModelTreeNode(getTreeNodeClass : ((className : any) => typeof ModelTreeNode), treeNodeData : TreeNodeData) : ModelTreeNode {
    const data = treeNodeData[1];
    const childs = Object.fromEntries(Object.entries(treeNodeData[2]).map(([childName, treeNodeData]) => {
        return [childName, buildModelTreeNode(getTreeNodeClass, treeNodeData)];
    }));
    return new (getTreeNodeClass(treeNodeData[0]))(treeNodeData[0], data, childs);
}

export default buildModelTreeNode;