import {createAppAuth} from '@octokit/auth-app';
import {Octokit} from '@octokit/rest';
import * as core from '@actions/core';

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

    const response = await appOctokit.apps
      .getOrgInstallation({org: scope})
      .catch(async (error) => {
        if (error.status === 404) {
          return await appOctokit.apps
            .getUserInstallation({username: scope})
            .catch((nestederror) => {
              if (nestederror.status === 404) {
                throw new Error(
                  `set scope is ${scope}, but installation is not found`
                );
              }
              throw nestederror;
            });
        }
        throw error;
      });
    const installationId = response.data.id;

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
    core.setSecret(resp.token);
    // @ts-expect-error
    core.setOutput('token', resp.token);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
