import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PixelCanvas from "../components/PixelCanvas";
import { getTree, updateTreeBase } from "../lib/storage";

export default function TreeEditPage() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [tree, setTree] = useState(null);
  const [editedBase, setEditedBase] = useState("");

  useEffect(() => {
    setTree(getTree(uuid));
  }, [uuid]);

  if (!tree) {
    return (
      <div className="app-shell">
        <section className="nes-container is-rounded panel">
          <h3 style={{ marginTop: 0 }}>트리를 찾을 수 없어요</h3>
        </section>
      </div>
    );
  }

  const save = () => {
    if (!editedBase) return alert("트리를 수정해주세요!");
    updateTreeBase(uuid, editedBase);
    navigate(`/tree/${uuid}`);
  };

  return (
    <div className="app-shell">
      <section className="nes-container is-rounded panel">
        <h3 style={{ marginTop: 0 }}>트리 수정하기 🎄</h3>
        <p className="mini">트리만 수정할 수 있어요. 장식은 유지됩니다.</p>

        <PixelCanvas
          widthPx={160}
          heightPx={192}
          scale={3}
          initialImageDataUrl={tree.baseImageDataUrl} // ✅ 기존 트리 로드
          onChange={setEditedBase}
        />

        <div className="btn-row">
          <button className="nes-btn is-success" onClick={save}>수정 저장</button>
          <button className="nes-btn" onClick={() => navigate(-1)}>취소</button>
        </div>
      </section>
    </div>
  );
}
