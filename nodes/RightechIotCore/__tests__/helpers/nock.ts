import nock, {Scope} from "nock";

nock.emitter.on('no match', (req, options, body) => {
    console.error(`No match for ${req.method} ${req.path} ${JSON.stringify(options.headers)} ${body}`);
});

export function setupNock(): Scope {
    return nock('https://dev.rightech.io', {
        allowUnmocked: false,
        reqheaders: {
            Authorization: "Bearer test-token",
        }
    });
}
