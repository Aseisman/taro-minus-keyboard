import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'default'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm'
    }
  ],
  external: ['react', '@tarojs/components', '@tarojs/taro'], // 不打包这几个
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      extract: true, // 单独生成css文件
      modules: false,
      use: ['sass']
    }),
    typescript({ tsconfig: './tsconfig.json' })
  ]
};
