import {RightechIotCore} from "../RightechIotCore.node.js";
import {expect, it} from "vitest";

it('All node properties declare visibility', () => {
    const nodes = (new RightechIotCore).description.properties;
    for (const node of nodes) {
        if (node.name !== 'resource') {
            expect(node.displayOptions, `Parameter ${node.name} is missing display options`).toBeDefined();
        }
    }
})
