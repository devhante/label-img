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

interface Label {
  startX: number;
  startY: number;
  width: number;
  height: number;
}

function Content(props: IProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageSize, setImageSize] = useState<Size>({ width: 0, height: 0 });

  const [selectedLabel, setSelectedLabel] = useState<number | null>(null);

  const [isDrag, setDrag] = useState<boolean>(false);
  const [labels, setLabels] = useState<Label[]>([]);
  const [label, setLabel] = useState<Label>({
    startX: 0,
    startY: 0,
    width: 0,
    height: 0,
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

  const getLabelElements = () => {
    const children = labels.map((item: Label, index: number) => {
      const style = {
        left: item.startX,
        top: item.startY,
        width: item.width,
        height: item.height,
      };

      const handleClick = (event: React.MouseEvent) => {
        setSelectedLabel(index);
      };

      return (
        <div
          id={`label-${index}`}
          className={`label${index === selectedLabel ? ' selected' : ''}`}
          style={style}
          onClick={handleClick}
          key={index}
        >
          <div className="anchors">
            <div className="anchor-rotate-line"></div>
            <div className="anchor-rotate"></div>
            <div className="anchor-square anchor-top"></div>
            <div className="anchor-square anchor-top-right"></div>
            <div className="anchor-square anchor-right"></div>
            <div className="anchor-square anchor-bottom-right"></div>
            <div className="anchor-square anchor-bottom"></div>
            <div className="anchor-square anchor-bottom-left"></div>
            <div className="anchor-square anchor-left"></div>
            <div className="anchor-square anchor-top-left"></div>
          </div>
        </div>
      );
    });
    return <div className="labels" children={children}></div>;
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    setLabel({
      startX: event.pageX - canvas.getBoundingClientRect().left,
      startY: event.pageY - canvas.getBoundingClientRect().top,
      width: 0,
      height: 0,
    });

    setDrag(true);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDrag) {
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

  const handleMouseUp = (event: React.MouseEvent) => {
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
    label.width -= 3;
    label.height -= 3;

    const newLabels: Label[] = JSON.parse(JSON.stringify(labels));
    newLabels.push(label);
    setLabels(newLabels);

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setDrag(false);
  };

  return (
    <div className={`Content ${props.tool}`}>
      {imageUrl !== '' ? (
        <img className="image" src={imageUrl} alt="target" />
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
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        ></canvas>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Content;
