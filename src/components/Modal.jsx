export default function Modal({ title, children, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "grid",
        placeItems: "center",
        zIndex: 999,
      }}
    >
      <section className="nes-dialog is-rounded">
        <header className="title">{title}</header>
        <div className="content">{children}</div>
        <div style={{ textAlign: "right", marginTop: 12 }}>
          <button className="nes-btn" onClick={onClose}>
            닫기
          </button>
        </div>
      </section>
    </div>
  );
}
