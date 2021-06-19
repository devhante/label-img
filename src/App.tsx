import React, { useState } from 'react';
import './App.css';
import { tool } from 'Type';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';

function App() {
  const [tool, setTool] = useState<tool>('select');

  console.log(setTool);

  return (
    <div className="App">
      <Header />
      <Sidebar tool={tool} setTool={setTool} />
    </div>
  );
}

export default App;
