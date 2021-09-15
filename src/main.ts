import {Octokit} from '@octokit/rest';
import * as core from '@actions/core';
import {createAppAuth} from '@octokit/auth-app';

async function getAuthenticatedApp(
  githubAppId: string,
  pemContent: string
): Promise<Octokit> {
  // Create octokit app with basic app id authentication
  const appOctokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: githubAppId,
      privateKey: pemContent,
    },
    baseUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
  });

  return appOctokit;
}

async function getJWT(appOctokit: Octokit): Promise<void> {
  // Get Github App JWT using the appOctokit object
  try {
    const appAuthentication: any = await appOctokit.auth({type: 'app'});
    core.setSecret(appAuthentication.token);
    core.setOutput('jwt_token', appAuthentication.token);
  } catch (error: any) {
    const errormessage =
      'Not able to retrieve a JWT: ' + new Error(error).message;
    core.setFailed(errormessage);
    throw new Error(errormessage);
  }
}

async function findProperInstallationId(
  appOctokit: Octokit,
  installationId: string
): Promise<string> {
  // Either confirm if given installation id is valid or find the first occurrence in the installation list
  let installation;

  const installations = await appOctokit.apps.listInstallations();
  if (installationId) {
    installation = installations?.data.find(
      (item: any) => item.id === Number(installationId)
    );
  } else {
    installation = installations?.data[0];
  }

  const resp = installation ? installation.id.toString() : '';
  return Promise.resolve(resp);
}

async function getInstallationAccessToken(
  appOctokit: Octokit,
  installationId: string
): Promise<void> {
  // Get Installation Access-Token
  try {
    const resp: any = await appOctokit.auth({
      type: 'installation',
      installationId,
    });
    core.setSecret(resp.token);
    core.setOutput('installation_access_token', resp.token);
  } catch (error: any) {
    const errormessage =
      'Not able to retrieve the installation access token: ' +
      new Error(error).message;
    core.setFailed(errormessage);
    throw new Error(errormessage);
  }
}

async function run(
  encoded_pem: string,
  appId: string,
  installationId: string
): Promise<void> {
  const decodedPem = Buffer.from(encoded_pem, 'base64').toString('binary');
  const appOctokit = await getAuthenticatedApp(appId, decodedPem);
  await getJWT(appOctokit);
  const verifiedInstallationId = await findProperInstallationId(
    appOctokit,
    installationId
  );

  if (verifiedInstallationId) {
    await getInstallationAccessToken(appOctokit, verifiedInstallationId);
  } else {
    console.log('Not able to find a valid installation id');
  }
}

// Collecting inputs
const appId: string = core.getInput('app_id');
const encodedPemFile: string = core.getInput('base64_pem_key');
const installationId: string = core.getInput('installation_id');
run(encodedPemFile, appId, installationId);
