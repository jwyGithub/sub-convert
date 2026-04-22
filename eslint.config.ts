import { eslint } from '@jawyn/eslint-config';

export default eslint(
    {
        typescript: true,
        type: 'app',
        rules: {
            'no-console': 'off',
            'dot-notation': 'off',
            'style/no-multiple-empty-lines': 'off'
        }
    },
    {
        ignores: ['dist/*']
    }
);

