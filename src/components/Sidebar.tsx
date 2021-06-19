import React from 'react';
import './Sidebar.css';
import { tool } from 'Type';
import selectToolIcon from 'resources/select-tool-icon.svg';
import createToolIcon from 'resources/create-tool-icon.svg';

interface IProps {
  tool: tool;
  setTool: React.Dispatch<React.SetStateAction<tool>>;
}

function Sidebar(props: IProps) {
  const handleClickSelect = (event: React.MouseEvent) => {
    props.setTool('select');
  };

  const handleClickCreate = (event: React.MouseEvent) => {
    props.setTool('create');
  };

  return (
    <div className="Sidebar">
      <div
        className={`select-tool${props.tool === 'select' ? ' selected' : ''}`}
        onClick={handleClickSelect}
        data-testid="select-tool"
      >
        <img
          src={selectToolIcon}
          alt="select label tool"
          data-testid="select-tool-icon"
        />
      </div>
      <div
        className={`create-tool${props.tool === 'create' ? ' selected' : ''}`}
        onClick={handleClickCreate}
        data-testid="create-tool"
      >
        <img
          src={createToolIcon}
          alt="create label tool"
          data-testid="create-tool-icon"
        />
      </div>
    </div>
  );
}

export default Sidebar;
