
type ControllerTreeNodeData = [
    any, //data
    {
        [childName : string] : ControllerTreeNodeData
    } //childs}
];

export default ControllerTreeNodeData;