"use strict";

let snippetsText = "";

function setStatus(message) {
  const statusEl = document.getElementById("status");
  statusEl.textContent = message;
}

function setPreview(text) {
  const preview = document.getElementById("preview");
  preview.value = text;
}

async function loadSnippets() {
  try {
    setStatus("Loading javascript.json...");

    const res = await fetch("./javascript.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    snippetsText = await res.text();
    setPreview(snippetsText);
    setStatus(`Loaded javascript.json (${snippetsText.length} chars).`);
  } catch (err) {
    snippetsText = "";
    setPreview("");
    setStatus(
      "Could not load javascript.json. If you opened this as a file (file://), run it using a local server (e.g., VS Code Live Server)."
    );
  }
}

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
  const text = snippetsText || document.getElementById("preview").value;

  if (!text || !text.trim()) {
    alert("Nothing to copy yet. Make sure javascript.json is loaded.");
    return;
  }

  try {
    await copyToClipboard(text);
    alert("Copied javascript.json content to clipboard!");
  } catch {
    alert("Copy failed in this browser. Try using VS Code Live Server / localhost.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("copyBtn").addEventListener("click", onCopyClick);
  document.getElementById("reloadBtn").addEventListener("click", loadSnippets);
  loadSnippets();
});
