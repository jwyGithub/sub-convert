import { eslint } from '@jawyn/eslint-config';

export default eslint(
    {
        typescript: true,
        type: 'lib',
        rules: {
            'no-console': 'off',
            'dot-notation': 'off'
        }
    },
    {
        ignores: ['dist/*']
    }
);
