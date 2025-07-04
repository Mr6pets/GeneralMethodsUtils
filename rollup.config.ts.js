import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/ts/index.ts',
  output: [
    {
      file: 'dist/ts/index.js',
      format: 'cjs',
      exports: 'auto'
    },
    {
      file: 'dist/ts/index.esm.js',
      format: 'es'
    },
    {
      file: 'dist/ts/index.umd.js',
      format: 'umd',
      name: 'GeneralUtilsTS'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    terser()
  ]
};