import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PixelCanvas from "../components/PixelCanvas";
import axios from "axios";

export default function TreeEditPage() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [tree, setTree] = useState(null);
  const [editedBase, setEditedBase] = useState("");
  const [loading, setLoading] = useState(false);

  // 트리 조회
  const fetchTree = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`https://api.beour.store/tree/${uuid}`);
      if (response.data.isSuccess) {
        const treeData = response.data.data;

        // 로컬 개발이면 상대 경로, 배포면 CDN 절대 경로
        const baseImageUrl = import.meta.env.DEV
          ? `/trees/${treeData.uuid}/base.png` // 로컬용
          : `https://cdn.beour.store/trees/${treeData.uuid}/base.png`; // 배포용

        setTree({
          uuid: treeData.uuid,
          baseImageUrl,
        });
        setEditedBase(baseImageUrl); // 초기값 세팅
      } else {
        alert("트리를 불러오는 중 오류가 발생했습니다.");
      }
    } catch (err) {
      alert("트리 조회 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, [uuid]);

  // 트리 수정
  const save = async () => {
    if (!editedBase) return alert("트리를 수정해주세요!");
    try {
      const response = await axios.put(`https://api.beour.store/tree/${uuid}`, {
        imageBase64: editedBase,
      });

      if (response.data.isSuccess) {
        alert("트리 수정 완료!");
        navigate(`/tree/${uuid}`, { replace: true });
      } else {
        alert("트리 수정 중 오류 발생");
      }
    } catch (err) {
      alert("트리 수정 중 오류 발생");
    }
  };

  if (!tree) {
    return (
      <div className="app-shell">
        <section className="nes-container is-rounded panel">
          <h3 style={{ marginTop: 0 }}>트리를 찾을 수 없어요</h3>
        </section>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <section className="nes-container is-rounded panel">
        <h3 style={{ marginTop: 0 }}>트리 수정하기 🎄</h3>
        <p className="mini">트리만 수정할 수 있어요. 장식은 유지됩니다.</p>

        <PixelCanvas
          widthPx={160}
          heightPx={192}
          scale={3}
          initialImageDataUrl={tree.baseImageUrl} // 기존 트리 로드
          onChange={setEditedBase}
        />

        <div className="btn-row">
          <button className="nes-btn is-success" onClick={save}>
            수정 저장
          </button>
          <button className="nes-btn" onClick={() => navigate(-1)}>
            취소
          </button>
        </div>
      </section>
    </div>
  );
}
