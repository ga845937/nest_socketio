import { apmServerURL as serverUrl, nodeEnv } from "@env";
import { name as serviceName } from "@packageJson";
import elasticApmNode from "elastic-apm-node";

export const elasticAPM = elasticApmNode.start({
    serviceName,
    serverUrl,
    environment: nodeEnv
});
