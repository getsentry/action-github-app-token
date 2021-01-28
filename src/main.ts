import * as core from "@actions/core";

import getInstallToken from "./getInstallToken";

/**
 * This is only used for GitHub Actions, we also publish `getInstallToken.ts` to npm
 */
async function run(): Promise<void> {
  try {
    const privateKey: string = core.getInput("private_key");
    const id: string = core.getInput("app_id");
    const token = getInstallToken(id, privateKey);

    core.setOutput("token", token);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
