import React, { useState, useEffect, useRef } from 'react';
import './Content.css';
import { tool } from 'Type';
import { getImage } from 'apis/getImage';
import { AxiosError } from 'axios';

interface IProps {
  tool: tool;
}

interface Size {
  width: number;
  height: number;
}

interface Coord {
  x: number;
  y: number;
}

interface Label {
  startX: number;
  startY: number;
  width: number;
  height: number;
}

function Content(props: IProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageSize, setImageSize] = useState<Size>({ width: 0, height: 0 });

  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
  const [startPos, setStartPos] = useState<Coord>({ x: 0, y: 0 });
  const [isMoving, setMoving] = useState<boolean>(false);
  const [isMoved, setMoved] = useState<boolean>(false);
  const [isAnchorMoving, setAnchorMoving] = useState<boolean>(false);

  const [isDrawing, setDrawing] = useState<boolean>(false);
  const [labels, setLabels] = useState<Label[]>([]);
  const [label, setLabel] = useState<Label>({
    startX: 0,
    startY: 0,
    width: 0,
    height: 0
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    getImage(1)
      .then((response) => {
        setImageUrl(response.data.url);
        const image = new Image();
        image.onload = () => {
          setImageSize({ width: image.width, height: image.height });
        };
        image.src = response.data.url;
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (props.tool !== 'select') {
      setSelectedLabels([]);
    }
  }, [props.tool]);

  const handleClickImage = () => {
    setSelectedLabels([]);
  };

  const getLabelElements = () => {
    const children = labels.map((item: Label, index) => {
      const style = {
        left: item.startX,
        top: item.startY,
        width: item.width,
        height: item.height
      };

      const classNameList = [
        'anchor-rotate-line',
        'anchor-rotate',
        'anchor-square anchor-top',
        'anchor-square anchor-top-right',
        'anchor-square anchor-right',
        'anchor-square anchor-bottom-right',
        'anchor-square anchor-bottom',
        'anchor-square anchor-bottom-left',
        'anchor-square anchor-left',
        'anchor-square anchor-top-left'
      ];
      const anchors: JSX.Element[] = [];
      classNameList.forEach((item, index) => {
        anchors.push(
          <div
            className={item}
            onMouseDown={handleMouseDownAnchor}
            onMouseMove={handleMouseMoveAnchor}
            onMouseUp={handleMouseUpAnchor}
            key={index}></div>
        );
      });

      return (
        <div
          id={`label-${index}`}
          className={`label${
            selectedLabels.includes(index) ? ' selected' : ''
          }`}
          style={style}
          onMouseDown={handleMouseDownLabel}
          onMouseMove={handleMouseMoveLabel}
          onMouseUp={handleMouseUpLabel}
          key={index}>
          <div className="anchors">{anchors}</div>
        </div>
      );
    });
    return <div className="labels" children={children}></div>;
  };

  const handleMouseDownLabel = (event: React.MouseEvent) => {
    if (selectedLabels.includes(Number(event.currentTarget.id.slice(6)))) {
      setStartPos({ x: event.pageX, y: event.pageY });
      setMoving(true);
    }
    setMoved(false);
  };

  const handleMouseMoveLabel = (event: React.MouseEvent) => {
    if (isMoving && !isAnchorMoving && selectedLabels.length > 0) {
      const newLabels: Label[] = [...labels];
      let canMoveX = true;
      let canMoveY = true;
      selectedLabels.forEach((item) => {
        let newX = newLabels[item].startX + event.pageX - startPos.x;
        let newY = newLabels[item].startY + event.pageY - startPos.y;
        if (newX < 0 || newX > imageSize.width - newLabels[item].width - 6) {
          canMoveX = false;
        }
        if (newY < 0 || newY > imageSize.height - newLabels[item].height - 6) {
          canMoveY = false;
        }
      });
      selectedLabels.forEach((item) => {
        if (canMoveX) {
          newLabels[item].startX += event.pageX - startPos.x;
        }
        if (canMoveY) {
          newLabels[item].startY += event.pageY - startPos.y;
        }
      });

      setLabels(newLabels);
      setStartPos({ x: event.pageX, y: event.pageY });
    }
    setMoved(true);
  };

  const handleMouseUpLabel = (event: React.MouseEvent) => {
    if (isMoved === false) {
      const index = Number(event.currentTarget.id.slice(6));
      if (event.ctrlKey) {
        const newSelectedLabel = [...selectedLabels];
        newSelectedLabel.push(index);
        setSelectedLabels(newSelectedLabel);
      } else {
        setSelectedLabels([index]);
      }
    }
    setMoving(false);
  };

  const handleMouseDownAnchor = (event: React.MouseEvent) => {
    setStartPos({ x: event.pageX, y: event.pageY });
    setAnchorMoving(true);
  };

  const handleMouseMoveAnchor = (event: React.MouseEvent) => {
    if (isAnchorMoving) {
      const newLabels: Label[] = [...labels];
      const classList = event.currentTarget.classList;
      let callback: (value: number) => void = () => {};
      if (classList.contains('anchor-top')) {
        callback = (item) => {
          const newHeight = newLabels[item].height - event.pageY - startPos.y;
          const newY = newLabels[item].startY + event.pageY - startPos.y;
          if (newY >= 0 && newY <= imageSize.height - newHeight - 6) {
            newLabels[item].height -= event.pageY - startPos.y;
            newLabels[item].startY += event.pageY - startPos.y;
          }
        };
      } else if (classList.contains('anchor-top-right')) {
        callback = (item) => {
          newLabels[item].width += event.pageX - startPos.x;
          newLabels[item].height -= event.pageY - startPos.y;
          newLabels[item].startY += event.pageY - startPos.y;
        };
      } else if (classList.contains('anchor-right')) {
        callback = (item) => {
          newLabels[item].width += event.pageX - startPos.x;
        };
      } else if (classList.contains('anchor-bottom-right')) {
        callback = (item) => {
          newLabels[item].width += event.pageX - startPos.x;
          newLabels[item].height += event.pageY - startPos.y;
        };
      } else if (classList.contains('anchor-bottom')) {
        callback = (item) => {
          newLabels[item].height += event.pageY - startPos.y;
        };
      } else if (classList.contains('anchor-bottom-left')) {
        callback = (item) => {
          newLabels[item].width -= event.pageX - startPos.x;
          newLabels[item].startX += event.pageX - startPos.x;
          newLabels[item].height += event.pageY - startPos.y;
        };
      } else if (classList.contains('anchor-left')) {
        callback = (item) => {
          newLabels[item].width -= event.pageX - startPos.x;
          newLabels[item].startX += event.pageX - startPos.x;
        };
      } else if (classList.contains('anchor-top-left')) {
        callback = (item) => {
          newLabels[item].height -= event.pageY - startPos.y;
          newLabels[item].startY += event.pageY - startPos.y;
          newLabels[item].width -= event.pageX - startPos.x;
          newLabels[item].startX += event.pageX - startPos.x;
        };
      }
      selectedLabels.forEach(callback);
      setLabels(newLabels);
      setStartPos({ x: event.pageX, y: event.pageY });
    }
  };

  const handleMouseUpAnchor = (event: React.MouseEvent) => {
    const classList = event.currentTarget.classList;
    if (classList.contains('anchor-top')) {
      console.log('top!');
    }
    setAnchorMoving(false);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      (event.key === 'Delete' || event.key === 'Backspace') &&
      selectedLabels.length > 0
    ) {
      const newLabels: Label[] = [];
      labels.forEach((item, index) => {
        if (!selectedLabels.includes(index)) {
          newLabels.push(item);
        }
      });
      setLabels(newLabels);
      setSelectedLabels([]);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleMouseDownCanvas = (event: React.MouseEvent) => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    setLabel({
      startX: event.pageX - canvas.getBoundingClientRect().left,
      startY: event.pageY - canvas.getBoundingClientRect().top,
      width: 0,
      height: 0
    });

    setDrawing(true);
  };

  const handleMouseMoveCanvas = (event: React.MouseEvent) => {
    if (isDrawing) {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      const rect = canvas.getBoundingClientRect();
      label.width = event.pageX - rect.left - label.startX;
      label.height = event.pageY - rect.top - label.startY;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(label.startX, label.startY, label.width, label.height);
    }
  };

  const handleMouseUpCanvas = (event: React.MouseEvent) => {
    if (label.width < 0) {
      label.startX = label.startX + label.width;
      label.width *= -1;
    }
    if (label.height < 0) {
      label.startY = label.startY + label.height;
      label.height *= -1;
    }

    label.startX -= 1.5;
    label.startY -= 1.5;
    label.width = Math.max(label.width - 3, 0);
    label.height = Math.max(label.height - 3, 0);

    const newLabels: Label[] = [...labels];
    newLabels.push(label);
    setLabels(newLabels);

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setDrawing(false);
  };

  return (
    <div className={`Content ${props.tool}`}>
      {imageUrl !== '' ? (
        <img
          className="image"
          src={imageUrl}
          alt="target"
          onClick={handleClickImage}
        />
      ) : (
        <></>
      )}
      {getLabelElements()}
      {props.tool === 'create' ? (
        <canvas
          className="canvas"
          ref={canvasRef}
          width={imageSize.width}
          height={imageSize.height}
          onMouseDown={handleMouseDownCanvas}
          onMouseMove={handleMouseMoveCanvas}
          onMouseUp={handleMouseUpCanvas}></canvas>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Content;
