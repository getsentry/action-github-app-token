import {createAppAuth} from '@octokit/auth-app';
import {Octokit} from '@octokit/rest';
import * as core from '@actions/core';

async function run(): Promise<void> {
  try {
    const privateKey: string = core.getInput('private_key');
    const id: string = core.getInput('app_id');
    const appOctokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        id,
        privateKey,
      },
      baseUrl: process.env['GITHUB_API_URL'] || 'https://api.github.com',
    });

    const {data} = await appOctokit.apps.listInstallations();

    const resp = await appOctokit.auth({
      type: 'installation',
      installationId: data[0].id,
    });
    // @ts-ignore
    core.setOutput('token', resp.token);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
