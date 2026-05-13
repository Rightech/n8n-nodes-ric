import {IDataObject, INodeType, INodeTypeData, INodeTypes, IVersionedNodeType, NodeHelpers} from "n8n-workflow";
import {RightechIotCore} from "../../RightechIotCore.node.js";

export class NodeTypes implements INodeTypes {
    nodeTypes: INodeTypeData = {};

    getByName(nodeType: string): INodeType | IVersionedNodeType {
        return this.nodeTypes[nodeType].type;
    }

    getKnownTypes(): IDataObject {
        return this.nodeTypes;
    }

    addNode(nodeTypeName: string, nodeType: INodeType | IVersionedNodeType) {
        const loadedNode = {
            [nodeTypeName]: {sourcePath: '', type: nodeType},
        };

        this.nodeTypes = {...this.nodeTypes, ...loadedNode};
    }

    getByNameAndVersion(nodeType: string, version?: number): INodeType {
        if (!this.nodeTypes[nodeType]) {
            throw new Error(`Unexpected node type ${nodeType}`);
        }
        return NodeHelpers.getVersionedNodeType(this.nodeTypes[nodeType].type, version);
    }
}

export const nodeTypes = new NodeTypes();

nodeTypes.addNode('@rightech/n8n-nodes-ric.rightechIotCore', new RightechIotCore());
nodeTypes.addNode('CUSTOM.rightechIotCore', new RightechIotCore());
