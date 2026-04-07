import { fromRollup } from '@web/dev-server-rollup';
import commonjs from '@rollup/plugin-commonjs';

export default {
  nodeResolve: true,
  open: 'demo/',
  plugins: [fromRollup(commonjs)({ include: ['**/node_modules/**'] })]
};
