const core = require('@actions/core');
const io = require('@actions/io');

const path = require('path');
const fs = require('fs');

//npm install @huaweicloud/huaweicloud-sdk-core
//npm install @huaweicloud/huaweicloud-sdk-devstar

import express = require('express');
import { DevStarClient } from "@huaweicloud/huaweicloud-sdk-devstar/v1/DevStarClient";
import { BasicCredentials } from "@huaweicloud/huaweicloud-sdk-core/auth/BasicCredentials";


function getRegistryEndpoint(regionId) {
    return `https://swr.${regionId}.myhuaweicloud.com`
}

async function run() {
    let ak = core.getInput('access-key-id', { required: false });
    let sk = core.getInput('access-key-secret', { required: false });
    let regionId = core.getInput('region-id', { required: false });
    let endpoint = getRegistryEndpoint(regionId);

    const basicCredentials = new BasicCredentials()
        .withAk(ak)
        .withSk(sk)
        .withProjectId(projectId)

    const client = DevStarClient.newBuilder()
        .withCredential(basicCredentials)
        .withEndpoint(endpoint)
        .build()

    loginServer = getRegistryEndpoint(regionId)

    //let authenticationToken = Buffer.from(`${username}:${password}`).toString('base64');
    let authenticationToken = "fake"

    let config = {
        "auths": {
            [loginServer]: {
                auth: authenticationToken
            }
        }
    }

    const runnerTempDirectory = process.env['RUNNER_TEMP']; // Using process.env until the core libs are updated
    const dirPath = path.join(runnerTempDirectory, `docker_login_${Date.now()}`);
    await io.mkdirP(dirPath);
    const dockerConfigPath = path.join(dirPath, `config.json`);
    core.debug(`Writing docker config contents to ${dockerConfigPath}`);
    fs.writeFileSync(dockerConfigPath, JSON.stringify(config));
    core.exportVariable('DOCKER_CONFIG', dirPath);
    console.log('DOCKER_CONFIG environment variable is set');
}

run().catch(e => core.setFailed(e));
