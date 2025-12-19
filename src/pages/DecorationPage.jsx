import { useParams } from "react-router-dom";
import { useState } from "react";
import PixelCanvas from "../components/PixelCanvas";
import { addDecoration, getTree } from "../lib/storage";

export default function DecorationPage() {
  const { uuid } = useParams();
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [name, setName] = useState("");

  const tree = getTree(uuid);
  if (!tree) {
    return (
      <div className="app-shell">
        <section className="nes-container is-rounded panel">
          <h3 style={{ marginTop: 0 }}>앗… 트리를 찾을 수 없어요</h3>
          <p className="mini">링크가 잘못되었거나 만료된 트리일 수 있어요.</p>
        </section>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!imageDataUrl) return alert("장식을 그려주세요!");
    if (!name.trim()) return alert("닉네임을 입력해주세요!");
    if ((tree.decorations?.length ?? 0) >= 10) return alert("장식은 최대 10개까지 가능해요!");

    addDecoration(uuid, { authorName: name.trim(), imageDataUrl });
    alert("장식이 추가됐어요! 🎁 (트리 주인 페이지에서 확인 가능)");
  };

  return (
    <div className="app-shell">
      <section className="nes-container is-rounded panel">
        <h3 style={{ marginTop: 0 }}>트리를 꾸며주세요 🎁</h3>
        <p className="mini">32×32 픽셀 장식 + 닉네임을 남겨주세요.</p>

        <PixelCanvas widthPx={32} heightPx={32} scale={10} onChange={setImageDataUrl} />

        <div className="nes-field" style={{ marginTop: 16 }}>
          <label className="mini">닉네임</label>
          <input className="nes-input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="btn-row">
          <button className="nes-btn is-primary" onClick={handleSubmit}>장식 제출하기</button>
        </div>
      </section>
    </div>
  );
}
