// localStorage에 트리/장식 저장

const KEY = "gathertree:v1";

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
}
function writeAll(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function initTree(uuid, baseImageDataUrl) {
  const all = readAll();
  all[uuid] = all[uuid] ?? {
    uuid,
    baseImageDataUrl,
    decorations: [], // {id, authorName, imageDataUrl, createdAt}
  };
  all[uuid].baseImageDataUrl = baseImageDataUrl;
  writeAll(all);
}

export function getTree(uuid) {
  const all = readAll();
  return all[uuid] ?? null;
}

export function updateTreeBase(uuid, baseImageDataUrl) {
  const all = readAll();
  if (!all[uuid]) return;
  all[uuid].baseImageDataUrl = baseImageDataUrl;
  writeAll(all);
}

export function addDecoration(uuid, { authorName, imageDataUrl }) {
  const all = readAll();
  if (!all[uuid]) return;

  const decorations = all[uuid].decorations ?? [];
  const id = crypto.randomUUID();
  decorations.push({
    id,
    authorName,
    imageDataUrl,
    createdAt: new Date().toISOString(),
  });

  all[uuid].decorations = decorations;
  writeAll(all);
  return id;
}

export function reorderDecorations(uuid, newOrderIds) {
  const all = readAll();
  if (!all[uuid]) return;
  const map = new Map((all[uuid].decorations ?? []).map((d) => [d.id, d]));
  const next = newOrderIds.map((id) => map.get(id)).filter(Boolean);
  all[uuid].decorations = next;
  writeAll(all);
}

export function deleteDecoration(uuid, decoId) {
  const all = readAll();
  if (!all[uuid]) return;
  all[uuid].decorations = (all[uuid].decorations ?? []).filter((d) => d.id !== decoId);
  writeAll(all);
}
