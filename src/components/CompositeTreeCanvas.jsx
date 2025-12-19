import { useEffect, useMemo, useRef, useState } from "react";
import { DECO, TREE_H, TREE_W, getSlots } from "../lib/slots";

function loadImg(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function CompositeTreeCanvas({
  baseImageDataUrl,
  decorations, // [{id, authorName, imageDataUrl}]
  scale = 3,
  onRenderedDataUrl, // (pngDataUrl) => void
}) {
  const canvasRef = useRef(null);
  const [hasRenderedOnce, setHasRenderedOnce] = useState(false); //const [ready, setReady] = useState(false);

  const slots = useMemo(() => getSlots(), []);
  const list = decorations?.slice(0, 10) ?? [];

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = TREE_W;
      canvas.height = TREE_H;

      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;

      // 배경 초기화
      ctx.clearRect(0, 0, TREE_W, TREE_H);

      if (!baseImageDataUrl) {
        // 베이스 트리가 없으면 placeholder
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, TREE_W, TREE_H);
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, TREE_W, 1);
        setReady(true);
        return;
      }

      // 트리 베이스
      const baseImg = await loadImg(baseImageDataUrl);
      if (cancelled) return;
      ctx.drawImage(baseImg, 0, 0, TREE_W, TREE_H);

      // 장식 레이어 (order대로 슬롯에)
      for (let i = 0; i < list.length; i++) {
        const deco = list[i];
        const pos = slots[i];
        if (!pos) break;
        try {
          const decoImg = await loadImg(deco.imageDataUrl);
          if (cancelled) return;
          ctx.drawImage(decoImg, pos.x, pos.y, DECO, DECO);
        } catch {
          // 이미지 로드 실패하면 스킵
        }
      }

      const out = canvas.toDataURL("image/png");
      onRenderedDataUrl?.(out);
      //setReady(true);
        // ✅ 최초 1회만 상태 변경
        if (!hasRenderedOnce) {
        setHasRenderedOnce(true);
        }
    }

    // setReady(false);
    render();

    return () => {
      cancelled = true;
    };
  }, [baseImageDataUrl, list, onRenderedDataUrl, slots]);

  return (
    <div className="nes-container is-rounded" style={{ background: "#fff", padding: 12 }}>
      <canvas
        ref={canvasRef}
        style={{
          width: TREE_W * scale,
          height: TREE_H * scale,
          border: "2px solid #111",
          imageRendering: "pixelated",
        }}
      />
        <div className="mini" style={{ marginTop: 10 }}>
        {hasRenderedOnce
            ? `합성 완료 · ${TREE_W}×${TREE_H}px`
            : "합성 중..."}
        </div>

    </div>
  );
}
