import React from 'react';
import './App.css';
import { show } from './ScanCode/ScanCode'

function App() {
  function handleScan(multiple: boolean) {
    show({
      multiple,
      onOk: (code, close) => {
        alert(code)
        close()
      },
      onCancel: (close) => {
        alert('cancel')
        close()
      }
    })
  }

  return (
    <div>
      <button onClick={() => handleScan(false)}>扫描</button>
      <button onClick={() => handleScan(true)}>连续扫描</button>
    </div>
  );
}

export default App;
