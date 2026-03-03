"use strict";

async function copyToClipboard(text) {
  // Try modern clipboard API first.
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback for older browsers / restricted contexts.
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();

  const ok = document.execCommand("copy");
  document.body.removeChild(ta);

  if (!ok) {
    throw new Error("Copy failed");
  }
}

async function onCopyClick() {
  try {
    const res = await fetch("./javascript.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (!text || !text.trim()) throw new Error("Empty file");

    await copyToClipboard(text);
    alert("Copied javascript.json content to clipboard!");
  } catch (err) {
    alert(
      "Could not copy. If you opened this as a file (file://), run it using a local server (e.g., VS Code Live Server), then click Copy Text again."
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("copyBtn").addEventListener("click", onCopyClick);
});
