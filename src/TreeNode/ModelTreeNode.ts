import TreeNode from "./TreeNode";
import TreeNodeData from "../Types/TreeNodeData";

class ModelTreeNode extends TreeNode<ModelTreeNode> {
    toData() : TreeNodeData {
        return [
            this.className,
            this.export ? this.export() : undefined,
            Object.fromEntries(Object.entries(this.childs).map(([childName, child]) => [childName, child.toData()]))
        ];
    }
    kill() {
        Object.values(this.childs).forEach(child => {
            child.kill();
        });
        this.emit("dead");
    }
}

export default ModelTreeNode;