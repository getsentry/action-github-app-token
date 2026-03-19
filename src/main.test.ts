import {jest, describe, test, expect, beforeEach} from '@jest/globals';

jest.unstable_mockModule('@actions/core', () => ({
  getInput: jest.fn(),
  setSecret: jest.fn(),
  setOutput: jest.fn(),
  setFailed: jest.fn(),
}));

jest.unstable_mockModule('@octokit/rest', () => ({
  Octokit: jest.fn(),
}));

jest.unstable_mockModule('@octokit/auth-app', () => ({
  createAppAuth: jest.fn(),
}));

const core = await import('@actions/core');
const {Octokit} = await import('@octokit/rest');

type MockedCore = {
  [K in keyof typeof core]: jest.Mock;
};

const mockedCore = core as unknown as MockedCore;

const FAKE_PRIVATE_KEY =
  '-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----';
const FAKE_TOKEN = 'ghs_fake_installation_token_abc123';

function mockInputs(overrides: Record<string, string> = {}): void {
  const defaults: Record<string, string> = {
    private_key: FAKE_PRIVATE_KEY,
    app_id: '12345',
    scope: '',
    ...overrides,
  };
  (
    mockedCore.getInput as jest.Mock<(name: string) => string>
  ).mockImplementation((name: string) => defaults[name] || '');
}

function mockOctokit({
  installations = [{id: 1, account: {login: 'my-org'}}],
  authResponse = {token: FAKE_TOKEN},
  listInstallationsError,
  authError,
}: {
  installations?: {id: number; account: {login: string}}[];
  authResponse?: {token: string} | null;
  listInstallationsError?: Error;
  authError?: Error;
} = {}): void {
  const mockAuth = authError
    ? jest.fn<() => Promise<never>>().mockRejectedValue(authError)
    : jest
        .fn<() => Promise<typeof authResponse>>()
        .mockResolvedValue(authResponse);

  const mockListInstallations = listInstallationsError
    ? jest.fn<() => Promise<never>>().mockRejectedValue(listInstallationsError)
    : jest
        .fn<() => Promise<{data: typeof installations}>>()
        .mockResolvedValue({data: installations});

  (Octokit as unknown as jest.Mock).mockImplementation(() => ({
    apps: {listInstallations: mockListInstallations},
    auth: mockAuth,
  }));
}

beforeEach(() => {
  jest.resetAllMocks();
  delete process.env.GITHUB_API_URL;
});

async function runAction(): Promise<void> {
  await jest.isolateModulesAsync(async () => {
    await import('./main.js');
  });
}

describe('action-github-app-token', () => {
  test('masks the private key immediately', async () => {
    mockInputs();
    mockOctokit();

    await runAction();

    expect(mockedCore.setSecret).toHaveBeenCalledWith(FAKE_PRIVATE_KEY);
    // Private key should be masked before anything else happens
    const setSecretCalls = mockedCore.setSecret.mock.invocationCallOrder;
    const octokitConstructCalls = (Octokit as unknown as jest.Mock).mock
      .invocationCallOrder;
    expect(setSecretCalls[0]).toBeLessThan(octokitConstructCalls[0]);
  });

  test('masks the installation token', async () => {
    mockInputs();
    mockOctokit();

    await runAction();

    expect(mockedCore.setSecret).toHaveBeenCalledWith(FAKE_TOKEN);
  });

  test('outputs the installation token', async () => {
    mockInputs();
    mockOctokit();

    await runAction();

    expect(mockedCore.setOutput).toHaveBeenCalledWith('token', FAKE_TOKEN);
  });

  test('uses scoped installation when scope is set', async () => {
    mockInputs({scope: 'other-org'});
    const installations = [
      {id: 1, account: {login: 'my-org'}},
      {id: 2, account: {login: 'other-org'}},
    ];
    mockOctokit({installations});

    await runAction();

    expect(mockedCore.setOutput).toHaveBeenCalledWith('token', FAKE_TOKEN);
    expect(mockedCore.setFailed).not.toHaveBeenCalled();
  });

  test('fails when scope does not match any installation', async () => {
    mockInputs({scope: 'nonexistent-org'});
    mockOctokit({
      installations: [{id: 1, account: {login: 'my-org'}}],
    });

    await runAction();

    expect(mockedCore.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('nonexistent-org'),
    );
    expect(mockedCore.setOutput).not.toHaveBeenCalled();
  });

  test('fails when auth returns null', async () => {
    mockInputs();
    mockOctokit({authResponse: null});

    await runAction();

    expect(mockedCore.setFailed).toHaveBeenCalledWith('Unable to authenticate');
  });

  test('error messages do not contain the private key', async () => {
    mockInputs();
    mockOctokit({
      authError: new Error(`Invalid key: ${FAKE_PRIVATE_KEY}`),
    });

    await runAction();

    expect(mockedCore.setFailed).toHaveBeenCalled();
    // The private key should have been masked via setSecret before any error could occur
    expect(mockedCore.setSecret).toHaveBeenCalledWith(FAKE_PRIVATE_KEY);
    const setSecretOrder = mockedCore.setSecret.mock.invocationCallOrder[0];
    const setFailedOrder = mockedCore.setFailed.mock.invocationCallOrder[0];
    expect(setSecretOrder).toBeLessThan(setFailedOrder);
  });

  test('uses GITHUB_API_URL when set', async () => {
    process.env.GITHUB_API_URL = 'https://github.example.com/api/v3';
    mockInputs();
    mockOctokit();

    await runAction();

    expect(Octokit).toHaveBeenCalledWith(
      expect.objectContaining({
        baseUrl: 'https://github.example.com/api/v3',
      }),
    );
  });

  test('defaults to api.github.com when GITHUB_API_URL is not set', async () => {
    mockInputs();
    mockOctokit();

    await runAction();

    expect(Octokit).toHaveBeenCalledWith(
      expect.objectContaining({
        baseUrl: 'https://api.github.com',
      }),
    );
  });
});
