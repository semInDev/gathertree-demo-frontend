import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PixelCanvas from "../components/PixelCanvas";
import Modal from "../components/Modal";
import { initTree } from "../lib/storage";

export default function TreeDrawPage() {
  const navigate = useNavigate();
  const [treeBase64, setTreeBase64] = useState("");
  const [uuid, setUuid] = useState(null);

  const handleSave = () => {
    if (!treeBase64) return alert("트리를 먼저 그려주세요!");
    const newUuid = crypto.randomUUID();
    initTree(newUuid, treeBase64); // ✅ 저장
    setUuid(newUuid);
  };

  const treeUrl = uuid ? `${window.location.origin}/tree/${uuid}` : "";

  return (
    <div className="app-shell">
      <section className="nes-container is-rounded panel">
        <h3 style={{ marginTop: 0 }}>트리 그리기 🎄</h3>

        <PixelCanvas widthPx={160} heightPx={192} scale={3} onChange={setTreeBase64} />

        <div className="btn-row">
          <button className="nes-btn is-success" onClick={handleSave}>트리 저장하기</button>
          <button className="nes-btn" onClick={() => navigate("/")}>취소</button>
        </div>
      </section>

      {uuid && (
        <Modal title="트리가 저장되었습니다 🎄" onClose={() => setUuid(null)}>
          <p className="mini">
            아래 링크는 <b>트리를 관리하는 유일한 주소</b>입니다.<br/>
            절대 잃어버리지 마세요!
          </p>
          <div className="nes-field">
            <label className="mini">트리 링크</label>
            <input className="nes-input" value={treeUrl} readOnly />
          </div>
          <div className="btn-row">
            <button className="nes-btn is-primary" onClick={() => navigator.clipboard.writeText(treeUrl)}>
              링크 복사
            </button>
            <button className="nes-btn is-success" onClick={() => navigate(`/tree/${uuid}`)}>
              트리 보러가기
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
