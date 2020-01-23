
type TreeNodeData = [
    any, //treeNodeClass name, any로 하는게 ID 영역 확장에 용이해 보임
    any, //data
    {
        [childName : string] : TreeNodeData
    } //childs
]

export default TreeNodeData;