# Log in to a container registry
Use this GitHub Action to [log in to a private container registry](https://docs.docker.com/engine/reference/commandline/login/) of [HuaweiCloud Cloud Container Registry](https://support.huaweicloud.com/swr/). Once login is done, the next set of actions in the workflow can perform tasks such as building, tagging and pushing containers.
```yaml
- uses: aliyun/acr-login@v1
  with:
    login-server: '<login server>' # example: https://my-test-registry.cn-hangzhou.cr.aliyuncs.com
    region-id: '<region id>' # example: cn-hangzhou
    access-key-id: '<access key id>'
    access-key-secret: '<access key secret>'
    instance-id: '<registry instance id>'
```
