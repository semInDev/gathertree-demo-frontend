import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../components/Modal";
import CompositeTreeCanvas from "../components/CompositeTreeCanvas";
import { deleteDecoration, getTree, reorderDecorations } from "../lib/storage";

export default function TreeViewPage() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [showInvite, setShowInvite] = useState(false);
  const [tree, setTree] = useState(null);
  const [finalPng, setFinalPng] = useState("");

  useEffect(() => {
    setTree(getTree(uuid));
  }, [uuid]);

  const decorateUrl = `${window.location.origin}/tree/${uuid}/decorate`;
  const decorations = tree?.decorations ?? [];
  const count = decorations.length;

  const canEvaluate = count >= 5;

  const ids = useMemo(() => decorations.map((d) => d.id), [decorations]);

  const move = (from, to) => {
    if (to < 0 || to >= ids.length) return;
    const next = [...ids];
    [next[from], next[to]] = [next[to], next[from]];
    reorderDecorations(uuid, next);
    setTree(getTree(uuid));
  };

  const remove = (id) => {
    if (!confirm("이 장식을 삭제할까요?")) return;
    deleteDecoration(uuid, id);
    setTree(getTree(uuid));
  };

  const download = () => {
    if (!finalPng) return alert("아직 합성 이미지가 없어요!");
    const a = document.createElement("a");
    a.href = finalPng;
    a.download = `gathertree-${uuid}.png`;
    a.click();
  };

  if (!tree) {
    return (
      <div className="app-shell">
        <section className="nes-container is-rounded panel">
          <h3 style={{ marginTop: 0 }}>트리를 찾을 수 없어요</h3>
          <p className="mini">저장된 트리 링크가 맞는지 확인해주세요.</p>
          <div className="btn-row">
            <button className="nes-btn" onClick={() => navigate("/")}>홈으로</button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <section className="nes-container is-rounded panel">
        <h3 style={{ marginTop: 0 }}>내 트리 🎄</h3>

        <p className="mini">
          현재 장식 수: <b>{count} / 10</b>
        </p>

        {/* ✅ 합성 결과 (트리 + 장식) */}
        <CompositeTreeCanvas
          baseImageDataUrl={tree.baseImageDataUrl}
          decorations={decorations}
          scale={3}
          onRenderedDataUrl={setFinalPng}
        />

        <div className="btn-row">
          <button className="nes-btn is-warning" onClick={() => setShowInvite(true)}>
            장식 요청 링크
          </button>

          <button className="nes-btn" onClick={() => navigate(`/tree/${uuid}/edit`)}>
            트리 수정하기
          </button>

          <button className="nes-btn is-success" onClick={download}>
            이미지 다운로드
          </button>
        </div>

        <hr />

        <p className="mini">
          {canEvaluate ? "AI 평가를 받을 수 있어요!" : "장식을 더 모으면 AI에게 평가받을 수 있어요!"}
        </p>

        <div className="btn-row">
            <button
            className={`nes-btn is-success ${!canEvaluate ? "is-disabled" : ""}`}
            disabled={!canEvaluate}
            onClick={() => {
                if (!canEvaluate) return;
                navigate(`/tree/${uuid}/evaluate?mode=mild`);
            }}
            >
            🧁 GPF 순한맛 평가
            </button>
            <button
            className={`nes-btn is-error ${!canEvaluate ? "is-disabled" : ""}`}
            disabled={!canEvaluate}
            onClick={() => {
                if (!canEvaluate) return;
                navigate(`/tree/${uuid}/evaluate?mode=spicy`);
            }}
            >
            🌶 GPT 매운맛 평가
            </button>
        </div>
      </section>

      {/* ✅ 장식 목록 + 32×32 미리보기 + 순서/삭제 */}
      <section className="nes-container is-rounded panel" style={{ marginTop: 20 }}>
        <h4 style={{ marginTop: 0 }}>장식 목록</h4>

        {decorations.length === 0 ? (
          <p className="mini">아직 장식이 없어요.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {decorations.map((d, idx) => (
              <div key={d.id} className="nes-container is-rounded" style={{ background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      className="nes-container is-rounded"
                      style={{
                        width: 56,
                        height: 56,
                        background: "#fff",
                        display: "grid",
                        placeItems: "center",
                        padding: 4,
                      }}
                      title="32×32 장식 미리보기"
                    >
                      <img
                        src={d.imageDataUrl}
                        alt="decoration"
                        width={32}
                        height={32}
                        style={{ imageRendering: "pixelated" }}
                      />
                    </div>

                    <div>
                      <div className="mini">by {d.authorName}</div>
                      <div className="mini">slot: {idx + 1}</div>
                    </div>
                  </div>

                  <div className="btn-row" style={{ marginTop: 0 }}>
                    <button className="nes-btn" onClick={() => move(idx, idx - 1)}>↑</button>
                    <button className="nes-btn" onClick={() => move(idx, idx + 1)}>↓</button>
                    <button className="nes-btn is-error" onClick={() => remove(d.id)}>삭제</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 장식 요청 팝업 */}
      {showInvite && (
        <Modal title="장식 요청 링크 🎁" onClose={() => setShowInvite(false)}>
          <p className="mini">이 링크를 친구에게 보내면 장식을 남길 수 있어요.</p>
          <input className="nes-input" value={decorateUrl} readOnly />
          <div className="btn-row">
            <button
              className="nes-btn is-primary"
              onClick={() => {
                navigator.clipboard.writeText(decorateUrl);
                alert("복사 완료!");
              }}
            >
              링크 복사
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
