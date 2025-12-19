import { useEffect, useMemo, useRef, useState } from "react";

/**
 * PixelCanvas
 * - widthPx, heightPx: 실제 픽셀 캔버스 크기 (예: 32x32, 160x192)
 * - scale: 화면에서 보여줄 확대 배율
 * - initialImageDataUrl: 기존 이미지 로드 (옵션)
 * - onChange: (dataUrl) => void
 */
export default function PixelCanvas({
  widthPx,
  heightPx,
  scale = 10,
  initialImageDataUrl,
  onChange,
}) {
  const canvasRef = useRef(null);

  const [color, setColor] = useState("#d62c2c");
  const [tool, setTool] = useState("pen"); // pen | eraser
  const [brushSize, setBrushSize] = useState(1); // ✅ 펜 굵기
  const [isDown, setIsDown] = useState(false);

  const cssWidth = widthPx * scale;
  const cssHeight = heightPx * scale;

  const ctx = useMemo(() => {
    const c = canvasRef.current;
    return c ? c.getContext("2d", { willReadFrequently: true }) : null;
  }, [canvasRef.current]);

  /* -----------------------------
   * 캔버스 초기화 & 이미지 로드
   * ----------------------------- */
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    c.width = widthPx;
    c.height = heightPx;

    const context = c.getContext("2d");
    context.imageSmoothingEnabled = false;
    context.clearRect(0, 0, widthPx, heightPx);

    if (initialImageDataUrl) {
      const img = new Image();
      img.onload = () => {
        context.clearRect(0, 0, widthPx, heightPx);
        context.drawImage(img, 0, 0, widthPx, heightPx);
        emit();
      };
      img.src = initialImageDataUrl;
    } else {
      emit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widthPx, heightPx, initialImageDataUrl]);

  /* -----------------------------
   * PNG 결과 emit
   * ----------------------------- */
  const emit = () => {
    const c = canvasRef.current;
    if (!c) return;
    const dataUrl = c.toDataURL("image/png");
    onChange?.(dataUrl);
  };

  /* -----------------------------
   * 마우스 → 픽셀 좌표 변환
   * ----------------------------- */
  const getPixelFromEvent = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * widthPx);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * heightPx);
    return {
      x: Math.max(0, Math.min(widthPx - 1, x)),
      y: Math.max(0, Math.min(heightPx - 1, y)),
    };
  };

  /* -----------------------------
   * 브러시 드로잉 (굵기 지원)
   * ----------------------------- */
  const drawBrush = (x, y) => {
    const c = canvasRef.current;
    if (!c) return;

    const context = c.getContext("2d");
    context.imageSmoothingEnabled = false;

    const half = Math.floor(brushSize / 2);

    for (let dx = -half; dx < brushSize - half; dx++) {
      for (let dy = -half; dy < brushSize - half; dy++) {
        const px = x + dx;
        const py = y + dy;

        if (px < 0 || py < 0 || px >= widthPx || py >= heightPx) continue;

        if (tool === "eraser") {
          context.clearRect(px, py, 1, 1);
        } else {
          context.fillStyle = color;
          context.fillRect(px, py, 1, 1);
        }
      }
    }
  };

  /* -----------------------------
   * 마우스 이벤트
   * ----------------------------- */
  const handleDown = (e) => {
    setIsDown(true);
    const { x, y } = getPixelFromEvent(e);
    drawBrush(x, y);
    emit();
  };

  const handleMove = (e) => {
    if (!isDown) return;
    const { x, y } = getPixelFromEvent(e);
    drawBrush(x, y);
    emit();
  };

  const handleUp = () => setIsDown(false);

  /* -----------------------------
   * 전체 지우기
   * ----------------------------- */
  const clearAll = () => {
    const c = canvasRef.current;
    if (!c) return;
    const context = c.getContext("2d");
    context.clearRect(0, 0, widthPx, heightPx);
    emit();
  };

  return (
    <div>
      {/* 🔧 툴바 */}
      <div className="btn-row" style={{ alignItems: "center" }}>
        <button
          className={`nes-btn ${tool === "pen" ? "is-primary" : ""}`}
          onClick={() => setTool("pen")}
          type="button"
        >
          펜
        </button>

        <button
          className={`nes-btn ${tool === "eraser" ? "is-warning" : ""}`}
          onClick={() => setTool("eraser")}
          type="button"
        >
          지우개
        </button>

        {/* ✅ 펜 굵기 */}
        <label
          className="mini"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          굵기
          <select
            className="nes-select"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
          >
            <option value={1}>1px</option>
            <option value={2}>2px</option>
            <option value={3}>3px</option>
            <option value={4}>4px</option>
            <option value={5}>5px</option>
          </select>
        </label>

        {/* 색상 */}
        <label
          className="mini"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          색상
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ width: 44, height: 34 }}
          />
        </label>

        <button className="nes-btn is-error" onClick={clearAll} type="button">
          전체 지우기
        </button>
      </div>

      {/* 🎨 캔버스 */}
      <div
        className="nes-container is-rounded"
        style={{
          background: "#fff",
          padding: 12,
          marginTop: 12,
          display: "inline-block",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: cssWidth,
            height: cssHeight,
            border: "2px solid #111",
            imageRendering: "pixelated",
            cursor: tool === "eraser" ? "not-allowed" : "crosshair",
          }}
          onMouseDown={handleDown}
          onMouseMove={handleMove}
          onMouseUp={handleUp}
          onMouseLeave={handleUp}
        />
      </div>

      <div className="mini" style={{ marginTop: 10 }}>
        크기: {widthPx}×{heightPx}px · 화면 표시: {cssWidth}×{cssHeight}px
      </div>
    </div>
  );
}
