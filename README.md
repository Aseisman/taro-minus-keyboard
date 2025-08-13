# taro-minus-keyboard

一个基于 **Taro + React** 的小程序/H5 自定义数字键盘组件，支持负号、小数点与**可配置的小数位数限制**，并带有插槽触发区域与蒙层关闭等跨端细节处理。

> 适用于 Taro 3+ 项目，React 17/18。

## ✨ 特性

- ✅ 受控组件：通过 `value` / `onChange` 管理输入值  
- ✅ 小数位数限制：`decimalLength`（默认 2 位）  
- ✅ 负号与小数点：美团外卖同款常见输入规则  
- ✅ 插槽触发：点击自定义触发区域唤起/隐藏键盘  
- ✅ 跨端处理：H5/微信/支付宝小程序蒙层关闭、元素高度适配  
- ✅ 类型完善：TypeScript 支持，直接使用 Taro 官方的 `eventCenter` 类型

---

## 📦 安装

> 组件库本身不内置 React 和 Taro，请在你的项目中作为 peer 依赖安装（Taro 项目一般已有）。

```bash
# 你的组件包
npm install taro-minus-keyboard

# 如项目缺少这些依赖，请确保安装（通常 Taro 项目已有）
npm install react @tarojs/components @tarojs/taro
```

> 样式需要单独引入（或让打包产物自动引入），请按你的构建产物路径调整：
```ts
import 'taro-minus-keyboard/dist/index.esm.css';
```

---

## 🔨 快速上手

```tsx
import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Keyboard from 'taro-minus-keyboard';
import 'taro-minus-keyboard/dist/index.esm.css';

export default function Page() {
  const [value, setValue] = useState('');

  return (
    <View>
      <Text>金额：{value || '0'}</Text>

      <Keyboard
        value={value}
        onChange={setValue}
        onConfirm={() => {
          // 提交逻辑
          console.log('confirm:', value);
        }}
        decimalLength={2}
      >
        {/* 自定义触发区域（插槽） */}
        <View className='custom-trigger'>
          <Text>{value || '点击输入'}</Text>
        </View>
      </Keyboard>
    </View>
  );
}
```

---

## 🧩 组件属性（Props）

| 属性名          | 类型                          | 必填 | 默认值 | 说明 |
|---              |---                            |:---:|:---:|---|
| `value`         | `string`                      | ✔️  | `''`  | 输入值（受控） |
| `onChange`      | `(value: string) => void`     | ✔️  | —     | 输入变化回调 |
| `onConfirm`     | `() => void`                  | ✖️  | —     | 点击“确定”时触发（触发后组件会自动收起） |
| `children`      | `React.ReactNode`             | ✖️  | —     | 自定义触发区域（不传则渲染默认区域） |
| `decimalLength` | `number`                      | ✖️  | `2`   | 小数点后保留位数（仅在已有小数点时生效） |

---

## 🧠 交互与规则

- `delete`：删除最后一个字符  
- `-`：切换负号（有则去，无则加，始终在最前）  
- `.`：仅允许输入一个小数点  
- 数字键：  
  - 若已包含小数点，则限制小数位数（由 `decimalLength` 控制）  
  - 若不包含小数点，正常追加  
- `onConfirm` 存在时会显示 **确定** 按钮，点击后自动收起键盘

---

## 🧱 样式与类名

> 你可以覆盖这些类名来自定义主题，建议给你的全局样式做命名空间以避免冲突。

- `.keyboard-container`
- `.keyboard-slot` / `.keyboard-slot-float` / `.default-slot`
- `.keyboard-mask`
- `.keyboard`
- `.keyboard-row`
- `.keyboard-key`
- `.delete-key`
- `.confirm-key`

> 组件默认包含基础样式（`index.scss` → `dist/index.css`），如需完全自定义，可不引入默认样式并按类名自行实现。

---

## 🌏 端差异与注意事项

- **H5**  
  - 使用 `document.addEventListener('mousedown', ...)` 监听外部点击关闭
- **微信/支付宝小程序**  
  - 提供蒙层 `.keyboard-mask` 点击关闭  
  - 根据实际渲染高度适配键盘浮动位置（`Taro.createSelectorQuery()`）
- **事件中心**  
  - 如需与外部通信（例如全局控制键盘开合），请直接使用官方导出的类型：  
    ```ts
    import { eventCenter } from '@tarojs/taro';
    eventCenter.on('hideKeyboard', () => { /* ... */ });
    ```
  - 不建议使用 `Taro.eventCenter` 的写法（类型上不包含该属性）

---

## 🧪 TypeScript 支持

组件自带类型定义（`.d.ts`）。使用时建议你的 `tsconfig.json` 至少包含：

```json
{
  "compilerOptions": {
    "jsx": "react",
    "moduleResolution": "nodenext",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## ❓FAQ

**Q: 为何我在项目里报 “Cannot find module '@tarojs/components'”？**  
A: 请确认你的 **业务项目** 已安装 `@tarojs/components` 与 `@tarojs/taro`，并且 `tsconfig.json` 使用 `moduleResolution: "nodenext"` 或开启 `skipLibCheck`。

**Q: 为什么打包体积这么小？**  
A: 本组件将 `react`、`@tarojs/taro`、`@tarojs/components` 声明为 `peerDependencies`，不会被打进包里，避免与你项目的版本产生冲突。

**Q: 能否在不传 `children` 的情况下使用？**  
A: 可以，会渲染一个默认的触发区域（显示当前 `value` 或“点击输入”）。


**Q: 引入后一直不能正常显示？**
A: 如果是`webpack5`的可以参考在`taro`项目中`config`中添加：
```js
    compiler: {
      type: 'webpack5',
      prebundle: {
        exclude: ['taro-minus-keyboard'],
      },
    },
```
---

## 🧱 开发（针对组件仓库）

**安装依赖**
```bash
npm install
# 开发用到的 peer 依赖也请作为 devDependencies 安装
npm install -D react react-dom @tarojs/components @tarojs/taro
```

**构建**
```bash
npm run build
```

**本地联调（可选）**
```bash
npm pack
# 生成 tar 包后在业务项目里 npm install 路径/xxx.tgz
```

**发布到 npm**
```bash
npm login
npm publish --access public
```

> 发布前请检查：  
> - `package.json` 中的 `name`、`version`、`main/module/types/files` 是否正确  
> - `peerDependencies` 是否包含 `react` / `@tarojs/*`  
> - 构建后的 `dist/` 是否包含 `.js`、`.d.ts` 与 `.css`

---

## 📜 许可证

[MIT](./LICENSE)
