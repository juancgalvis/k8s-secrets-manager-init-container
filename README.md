![build](https://github.com/juancgalvis/k8s-secrets-manager-init-container/workflows/build/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/juancgalvis/k8s-secrets-manager-init-container/badge.svg)](https://coveralls.io/github/juancgalvis/k8s-secrets-manager-init-container)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=juancgalvis_k8s-secrets-manager-init-container&metric=alert_status)](https://sonarcloud.io/dashboard?id=juancgalvis_k8s-secrets-manager-init-container)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=juancgalvis_k8s-secrets-manager-init-container&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=juancgalvis_k8s-secrets-manager-init-container)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=juancgalvis_k8s-secrets-manager-init-container&metric=bugs)](https://sonarcloud.io/dashboard?id=juancgalvis_k8s-secrets-manager-init-container)
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/juancgalvis/k8s-secrets-manager-init-container/blob/master/LICENSE)

# k8s Secrets Manager Init Container

k8s Secrets Manager Init Container allows you to use external secret
management systems, like [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)

## How it works

The project is a `Secrets Loader` which works as an init container obtaining the value of the
secret and mapping it into an environment variable file, there is currently connection to AWS
Secrets Manager, but you can contribute and develop another connector.

## How to use it

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  volumes:
  - name: shared-data
    emptyDir: {}
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'source /credentials/secrets.conf && echo $SECRET_KEY']
    volumeMounts:
    - name: shared-data
      mountPath: /credentials
  initContainers:
  - name: get-secrets
    image: juancgalvis/secrets-manager-init-container:1.0.2
    volumeMounts:
    - name: shared-data
      mountPath: /credentials
    env:
    - name: SECRET
      value: 'my-aws-secret-name'
    - name: EXPORT_PATH
      value: '/credentials/db.conf'
    - name: SECRET_MAP
      value: '{"password":"PG_PASSWORD","username":"PG_USER","host":"PG_HOST","dbname":"PG_DATABASE","port":"PG_PORT"}'
```

In the previous example in AWS Secrets Manager there is a secret named `my-aws-secret-name` which
has the following structure:

```json
{
  "password": "password_value",
  "username": "username_value",
  "host": "host_value",
  "dbname": "dbname_value",
  "port": 5432
}
```

The output of this init container will be a file like the following:

```bash
export PG_PASSWORD=password_value
export PG_USER=username_value
export PG_HOST=host_value
export PG_DATABASE=dbname_value
export PG_PORT=5432

```

If the SECRET_MAP variable is not configured the output would be:

```bash
export password=password_value
export username=username_value
export host=host_value
export dbname=dbname_value
export port=5432

```

The above file can be loaded into environment variables in linux using
the `source` command. (`source /credentials/db.conf`)

If the secret is not a json for example:

```text
THIS_IS_MY_SECRET
```

The environment variable file will be:

```bash
export SECRET=THIS_IS_MY_SECRET

```

### Parameterization variables

There are general variables and each secrets provider can has own variables.

#### General variables

| env         | required | default | description                                                                                        |
|-------------|----------|---------|----------------------------------------------------------------------------------------------------|
| PROVIDER    |    ✅    | AWS     | Secrets manager provider                                                                           |
| SECRET      |    ✅    |         | Secret key                                                                                         |
| EXPORT_PATH |    ✅    |         | Shared volume absolute export file path                                                            |
| TIMEOUT     |          | 10000   | Timeout to obtain the secret, if the timeout is reached the container will end with System.exit(1) | 
| SECRET_MAP  |          |         | JSON Secret key to Secret env map                                                                  |

#### AWS Provider variables

| env                   | required | default             | description                       |
|-----------------------|----------|---------------------|-----------------------------------|
| AWS_REGION            |          | us-east-1           | region where the secret is stored |
| AWS_ACCESS_KEY_ID     |          | taken from the node |                                   |
| AWS_ACCESS_KEY_SECRET |          | taken from the node |                                   |

#### Memory provider

This provider is for test only

| env       | required | default | description                                                                                        |
|-----------|----------|---------|----------------------------------------------------------------------------------------------------|
| SECRET    |    ✅    | In this provider this env var should,have the expected secret value, for example `{"key":"value"}` |
| TEST_WAIT |          | 0       | Taken time to write the secret to the environment variable file                                                        |

# Contributing

Contributions are always welcome, whether it's modifying source code to add new features or bug fixes or simply documenting.

You can also can create issues for development discussion.

# License

This project is licensed under MIT, see the [License](https://github.com/juancgalvis/k8s-secrets-manager-init-container/blob/master/LICENSE)
