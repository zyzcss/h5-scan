import React from 'react'
import ReactDOM from 'react-dom'
import ScanCode, { ScanFuncProps } from '../ScanCode';

export default function show(this: any, config: ScanFuncProps) {
  //在body中插入个div，用于后续的弹窗的渲染
  const div = document.createElement("div");
  document.body.appendChild(div);

  //show 初始化配置
  let currentConfig = {
    ...config,
    onCancel: destroy,
    onOk: onOk,
    visible: true,
  } as any;

  //更新组件
  function update(newConfig: ScanFuncProps) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    };
    render(currentConfig);
  }

  //弹窗的注销
  function destroy(callback: Function) {
    removeChild()
    if (config.onCancel) {
      config.onCancel(callback);
    }
  }

  //弹窗的注销
  function onOk(codeData: string | string[], callback: Function) {
    removeChild()
    if (config.onOk) {
      config.onOk(codeData, callback);
    }
  }

  // 移除div
  function removeChild() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  //弹窗的渲染
  function render(props: any) {
    // ReactDOM.render 对已经渲染过的组件是不会重复重新渲染的，是做的更新操作，
    // 具体参考ReactDOM.render源码
    ReactDOM.render(<ScanCode {...props} />, div);
  }

  render(currentConfig);

  //返回注销、更新方法
  return {
    destroy,
    update,
  };
}