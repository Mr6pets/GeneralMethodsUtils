import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/js/index.js',
  output: [
    {
      file: 'dist/js/index.js',        // ✅ 修正路径
      format: 'cjs',
      exports: 'auto'
    },
    {
      file: 'dist/js/index.esm.js',    // ✅ 修正路径
      format: 'es'
    },
    {
      file: 'dist/js/index.umd.js',    // ✅ 修正路径
      format: 'umd',
      name: 'GeneralUtils'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    terser()
  ]
};