# h5-scan
移动端调用摄像头，扫描二维码（支持react和原生js）
封装jsQR，调用摄像头扫描或许二维码

## 兼容性
https://caniuse.com/#search=getUserMedia

## 使用说明
1.  git clone https://github.com/zyzcss/h5-scan.git 
2.  cd h5-scan
3. `yarn` & `yarn start` | `npm install` & `npm run start`
4.  确保pc和手机再同一局域网下，使用ipconfig查看ipv4指向的ip
  例：192.168.0.1
  手机浏览器输入
    react环境：https://192.168.0.1:3000/
    原生js环境：https://192.168.0.1:3000/test.html

## React
### 使用方式
  支持组件形式和函数形式
  #### 组件
   `import ScanCode from './ScanCode/ScanCode'`
   `<ScanCode {...config}/>`
  #### 函数
   `import { show } from './ScanCode/ScanCode'`
   `show({ ...config })`

### 参数
详见`ScanCode/ScanCode.tsx`内的`ScanFuncProps`
|  参数名 | 参数类型  | 参数说明  |
| ------------ | ------------ | ------------ |
|  visible |  boolean | 显示隐藏（函数调用时不用传）  |
|  onCancel | Function |  关闭回调 |
|  onOk |  Function | 成功回调  |
|  multiple | boolean | 是否连续扫描  |

## JS
### 使用说明
  没有过多封装 实现了基础扫码功能 见`public/test.html`
