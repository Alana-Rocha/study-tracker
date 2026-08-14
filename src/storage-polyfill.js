// Shim for the `window.storage` API provided by the Claude.ai Artifacts
// sandbox, so this component also runs in a plain browser via localStorage.
window.storage = {
  async get(key) {
    const value = localStorage.getItem(key);
    return value === null ? null : { value };
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return true;
  },
};
