import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

export default async function getToken(
  appId: string,
  privateKey: string
): Promise<string> {
  const appOctokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
    },
  });

  const { data } = await appOctokit.apps.listInstallations();

  const resp = await appOctokit.auth({
    type: "installation",
    installationId: data[0].id, // TODO: Is this a problem if there are multiple installs?
  });

  // The typing is incomplete, `resp` is `unknown`
  // @ts-ignore
  return resp.token;
}
