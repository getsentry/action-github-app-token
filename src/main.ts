import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";
import { Endpoints } from "@octokit/types";
import * as core from "@actions/core";

async function run(): Promise<void> {
  try {
    const privateKey: string = core.getInput("private_key");
    const id: string = core.getInput("app_id");
    const scope: string = core.getInput("scope");
    const appOctokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        id,
        privateKey,
      },
      baseUrl: process.env.GITHUB_API_URL || "https://api.github.com",
    });

    type listInstallationsResponse = Endpoints["GET /app/installations"]["response"];

    const installations: listInstallationsResponse = await appOctokit.apps.listInstallations();
    let installationId = installations.data[0].id;
    if (scope !== "") {
      const scopedData = installations.data.find(
        (item) => item.account.login === scope
      );
      if (scopedData === undefined) {
        throw new Error(`set scope is ${scope}, but installation is not found`);
      }
      installationId = scopedData.id;
    }

    const resp = await appOctokit.auth({
      type: "installation",
      installationId,
    });
    // @ts-ignore
    core.setOutput("token", resp.token);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
