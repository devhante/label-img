import React, { useState } from 'react';
import './App.css';
import { tool } from 'Type';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Content from 'components/Content';

function App() {
  const [tool, setTool] = useState<tool>('select');

  return (
    <div className="App">
      <Header />
      <Sidebar tool={tool} setTool={setTool} />
      <Content tool={tool} />
    </div>
  );
}

export default App;
