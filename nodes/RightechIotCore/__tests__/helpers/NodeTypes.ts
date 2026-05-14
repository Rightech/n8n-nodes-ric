import {IDataObject, INodeType, INodeTypeData, INodeTypes, IVersionedNodeType, NodeHelpers} from "n8n-workflow";
import {RightechIotCore} from "../../RightechIotCore.node.js";
import {ManualTrigger} from "../n8n-stubs/ManualTrigger/ManualTrigger.node.js";
import {Set} from "../n8n-stubs/Set/Set.node.js";

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
// todo: it could be possible to take nodes from n8n-nodes-base package, but theres too many dependencies
nodeTypes.addNode('n8n-nodes-base.manualTrigger', new ManualTrigger());
nodeTypes.addNode('n8n-nodes-base.set', new Set());
