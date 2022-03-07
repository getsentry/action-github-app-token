import {createAppAuth} from '@octokit/auth-app';
import {Octokit} from '@octokit/rest';
import {Endpoints} from '@octokit/types';
import * as core from '@actions/core';

import {paginateRest} from '@octokit/plugin-paginate-rest';

const paginateOctokit = Octokit.plugin(paginateRest);

type listInstallationsResponse =
  Endpoints['GET /app/installations']['response'];

async function run(): Promise<void> {
  try {
    const privateKey: string = core.getInput('private_key');
    const appId: string = core.getInput('app_id');
    const scope: string = core.getInput('scope');
    const appOctokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId,
        privateKey,
      },
      baseUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
    });

    const installations: listInstallationsResponse =
      await appOctokit.apps.listInstallations();
    let installationId = installations.data[0].id;
    if (scope !== '') {
      const loginName: string = scope.split('/')[0]; // if scope set repository, loginName is username
      const scopedData = installations.data.find(
        (item) => item.account?.login === loginName
      );
      if (scopedData === undefined) {
        throw new Error(`set scope is ${scope}, but installation is not found`);
      }
      installationId = scopedData.id;
    }

    // This is untyped
    // See: https://github.com/octokit/core.js/blob/master/src/index.ts#L182-L183
    const resp = await appOctokit.auth({
      type: 'installation',
      installationId,
    });

    if (!resp) {
      throw new Error('Unable to authenticate');
    }
    // @ts-expect-error
    const installationToken = resp.token;

    // Need to check accessibility if scope set repository
    if (scope !== '' && scope.split('/').length === 2) {
      await isExistRepositoryInGitHubApps(installationToken, scope);
    }

    core.setSecret(installationToken);
    core.setOutput('token', installationToken);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

async function isExistRepositoryInGitHubApps(
  installationToken: string,
  repository: string
): Promise<void> {
  const installationOctokit = new paginateOctokit({
    auth: installationToken,
    baseUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
  });

  for await (const response of installationOctokit.paginate.iterator(
    'GET /installation/repositories'
  )) {
    if (response.data.find((r) => r.full_name === repository)) {
      return undefined;
    }
  }

  throw new Error(`GitHub Apps can't accessible repository (${repository})`);
}

run();
