const core = require('@actions/core');
const io = require('@actions/io');

const path = require('path');
const fs = require('fs');

const http_request = require('./http_request');

import express = require('express');


async function run() {
    let ak = core.getInput('access-key-id', { required: true });
    let sk = core.getInput('access-key-secret', { required: true });
    let region = core.getInput('region', { required: true });
    let url = `https://swr-api.${region}.myhuaweicloud.com/v2/manage/utils/secret?projectname=${region}`;
    http_request.init_sign({AccessKey:`${ak}`, SecretKey:`${sk}`});
    secret = http_request.hw_request("POST", url, "", {})
    console.debug(`${JSON.stringify({ secret })}`)
}

run().catch(e => core.setFailed(e));
