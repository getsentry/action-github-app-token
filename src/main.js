// import {createAppAuth} from '@octokit/auth-app';
// import {Octokit} from '@octokit/rest';
// import {Endpoints} from '@octokit/types';
// import * as core from '@actions/core';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = {next: verb(0), throw: verb(1), return: verb(2)}),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {value: op[1], done: false};
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return {value: op[0] ? op[1] : void 0, done: true};
    }
  };
// type listInstallationsResponse =
// Endpoints['GET /app/installations']['response'];
function decodePem(encodedPemFile) {
  return __awaiter(this, void 0, void 0, function () {
    var decoded;
    return __generator(this, function (_a) {
      decoded = function (str) {
        return Buffer.from(encodedPemFile, 'base64').toString('binary');
      };
      console.log(decoded);
      return [2 /*return*/, ''];
    });
  });
}
// async function createAppJWT(github_appId: number, pem_content: string) : Promise<String> {
//   const { createAppAuth } = require("@octokit/auth-app");
//   const auth = createAppAuth({
//     appId: github_appId,
//     privateKey: github_appId,
//   });
//   const appAuthentication = await auth({
//     type: "app",
//   });
//   console.log(appAuthentication)
//   return ""
// }
// async function run(): Promise<void> {
//   try {
//     const privateKey: string = core.getInput('private_key');
//     const appId: string = core.getInput('app_id');
//     const scope: string = core.getInput('scope');
//     const appOctokit = new Octokit({
//       authStrategy: createAppAuth,
//       auth: {
//         appId,
//         privateKey,
//       },
//       baseUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
//     });
//     const installations: listInstallationsResponse =
//       await appOctokit.apps.listInstallations();
//     let installationId = installations.data[0].id;
//     if (scope !== '') {
//       const scopedData = installations.data.find(
//         (item) => item.account?.login === scope
//       );
//       if (scopedData === undefined) {
//         throw new Error(`set scope is ${scope}, but installation is not found`);
//       }
//       installationId = scopedData.id;
//     }
//     // This is untyped
//     // See: https://github.com/octokit/core.js/blob/master/src/index.ts#L182-L183
//     const resp = await appOctokit.auth({
//       type: 'installation',
//       installationId,
//     });
//     if (!resp) {
//       throw new Error('Unable to authenticate');
//     }
//     // @ts-expect-error
//     core.setSecret(resp.token);
//     // @ts-expect-error
//     core.setOutput('token', resp.token);
//   } catch (error) {
//     if (error instanceof Error) {
//       core.setFailed(error.message);
//     }
//   }
// }
function exec(encoded_pem) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      decodePem(encoded_pem);
      return [2 /*return*/];
    });
  });
}
console.log('Initt!!');
var encoded =
  'LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBbHI5THBkVXJDNkdrSDNOOXR6emw2SkFjaUlISllGQVMySWFlRmJMMmFOOWFwUUt5ClVaVngxbnBJamc4UWZXeGpzZjdXanV0anhudHBCLzc1VGxFMW5nSXZLNlhaMVdBbHRvL0p3WkxHMTA1eExSckMKZytwMkVJNVVPZ2JXbWdveDJiU2hibnJyWnJmTW9JYytqTm9rN2dKaDNyelBQZ3BGOXVuSVdoTlVvZHFFTElDSQoxSlFNZ2RObSt6OWZtRVE3OXVvUHlhZGxQVGxIS0FmVGdUdk82SCtaelpRK2cwV1RNR1M5Ukl3S0N2QXJMQkJ1CnBETVBYN3dGcS91MjNBdXd3bHl4U3ZvMlJodkFBNndMN01mNjZsYVk5a3I1YnBoMjcrNzExMFFZR2FRWWJROEMKSFZzbFJCdHFJY3lSZThuWHMzUVY1QkhqVm54Q2dkUEFMRlBIY1FJREFRQUJBb0lCQURpbUlwTnJEQVlPOUZJdApZR3pmb2JaSGtiRnF0SFpSSVFQbGNyck15ZlNYR3NVdndqc09ZZjByYnVDVG9LckJkS1dMRXE0YW55QVRlR0RjCjNHc2w4WFF6ZGU1OUlPTWlnb21jZDBFYkcwWUY0Rm9HMkZvaVhjUFMrS3ZscmZldEpSYWUzcHRaN2VSbjVhbmQKcVEvZFdrdG04Y2gyUTVzWTJUbjBtS25nNGNrQWRVZWxkSXpKamlUNGVzY0dEZGk4cUl3VnVjNjZ5dE9HT0gycApBZHlmd1hrR3V0S09QUjlvR09jMUdHWGZDWlhUVk8yWG9RRUZBanhuQUJ6TU1LanFTdGg3K3haT3Q3Y3NGMmFqClltYmMrMXVkZWxYdjJLbThwYVBmQ0dTRkp5S1VvUzFwOUlFbklvNkJjcHlOQ0VERWR6UThvdis3WVpOSlF4bjEKWXhyMUlRRUNnWUVBeC9BSlZ6Sk9xSXFxbWtmVENlQ3lxUmtJdElKSml1b2tsbnJFUjk1eWdxem5rbjBUYTBjRQo1NXJqV2tiQmRLRWJXdnFWZEVlbWtvMFAweHlnaUVRSzJJRmlwZStUbDNHaTdFTUQxbDRSODRMZXNDbnlaWklTCjFBSGNFTWlaVjlkNFlQMW1kcjZuRzYvb0JxK3IvVFlBa2pQMTdCYzBSWm9VSEhqeG52YWZDOGtDZ1lFQXdRUkQKclFRZ0d3S2JtZHIwdERKSWJHWVJoczZUQkF1alEyakVwdnBLNnhqS1Z5SFhSVVREZVQxTDFtSUxIcEtSb3BKawovMWdlMmpHcXgwbi84WFlyVEkvbndSTGViZDlJMFkvbDNBNkh4VFJtck81VnJuODBzSEFLczNWa1VmNmJtM2xhCjhFcHFwMituTEdxYTc5b01ZVGxFb0ZaWGVEN3ZOb0lKM2k1dFlta0NnWUFKVEhpaXZZdzYrbmdFeE9Kanl6ZUQKOWM0WjF4VmtpSTg3RUdxZ2pRLzJVK1JSUTgvclpWb3RDMThYaThMamticWIrSnVLMU9wQ1ZwMHR6RjhLOTE4cAp3cHE3N1BDSVVwaXBORlN4VzU2cUhLUU92V1N3cEtLTGlhcWFmVG5rZy9qdFNkdkNHZ3ZibGNyTXhNN1M3L2dHCjFMUFRUeUQzTzd0RHQ3eEZFR05GUVFLQmdGQkY3Yjl2RDhzcjhucXlUVU1FQm9yT2lFdUFialFvZ3VYdUZKczkKVFJzcFhEMlFuVzc1Z2pKU0E5Qk5Sa0tZd21qU2FaNm9qMncvYTc4bVQ0T2ttYTFsekFUSVRDbDF5MXNjZFlSbgpwcCtsZzI0NFVQb1pmVmhEd0srU0N2N3UzTmgwU0JYWFhUUDFnNWs5WE9LVDFNSTZod2dINEtqcHc2THZ3aHJkClJEREJBb0dCQUtQaXF2NThubVFyRG9ZUnBKQlIrdWZqaGFhaGVvR2NlR2h0RTUvMFJEL0JGc1g4bW5kMXFzeHgKWnIxWlE1eElvVXh0T3dUMHZkd0FMOWN0OVk4cmhERkxORVo3Rkcza3lxZTNpNlFkZ3BXSk1RUFpIcjBPdzN1OQpTVDZJdldSbTQ2dHFodkM1NHZuN2Jza3V1aVByaElFbjFYRnF0TkFEVktERVIzeUVkbWQ4Ci0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg==';
exec(encoded);
// run();
// Getting action input values
//const privateKey: string = core.getInput('private_key');
//const appId: string = core.getInput('app_id');
//const base64PemKey: string = core.getInput('base64_pem_key');
//const repoName: string = core.getInput('repo_name');
//const installationId: string = core.getInput('installation_id');
