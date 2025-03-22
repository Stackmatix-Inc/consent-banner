import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'build',
      'chore',
      'ci',
      'docs',
      'feat',
      'fix',
      'perf',
      'refactor',
      'revert',
      'style',
      // Custom types
      'test',
      'bug',
      'experiment',
      'prototype',
      'dev',
      'db',
      'misc',
      'security',
      'release',
      'api',
      'ckpt',
      'docs',
    ]],
    'header-max-length': [2, 'always', 512]
  }
};

export default Configuration;
