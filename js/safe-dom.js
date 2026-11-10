/**
 * SafeDom — Mini-Helper für XSS-sicheres DOM-Bauen.
 * Reason: Statt innerHTML mit String-Interpolation (XSS-Vektor) bauen wir
 * Elemente strukturell. Funktioniert in Browser + jsdom (Tests).
 *
 * Beispiel:
 *   SafeDom.el('div', { className: 'card' },
 *     SafeDom.el('h3', {}, recipe.title),
 *     SafeDom.el('button', { onClick: handle, dataset: { id: '5' } }, 'OK')
 *   );
 */
(function (root) {
  'use strict';

  /**
   * Creates an element with attributes and children.
   * @param {string} tag - HTML tag name.
   * @param {object} props - { className, id, style, dataset, onClick, title, type, ariaLabel }.
   * @param  {...(string|Node)} children - Text strings or DOM nodes.
   * @returns {HTMLElement}
   */
  function el(tag, props, ...children) {
    const node = document.createElement(tag);
    if (props) {
      if (props.className) node.className = props.className;
      if (props.id) node.id = props.id;
      if (props.title) node.title = props.title;
      if (props.type) node.type = props.type;
      if (props.ariaLabel) node.setAttribute('aria-label', props.ariaLabel);
      if (props.style) {
        if (typeof props.style === 'string') node.style.cssText = props.style;
        else Object.assign(node.style, props.style);
      }
      if (props.dataset) {
        for (const k in props.dataset) node.dataset[k] = props.dataset[k];
      }
      if (props.onClick) node.addEventListener('click', props.onClick);
    }
    for (const child of children) {
      if (child == null || child === false) continue;
      if (typeof child === 'string' || typeof child === 'number') {
        node.appendChild(document.createTextNode(String(child)));
      } else if (child instanceof Node) {
        node.appendChild(child);
      }
    }
    return node;
  }

  /** Removes all children from a node (faster + safer than innerHTML = ''). */
  function clearChildren(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  /** Plain text node helper. */
  function text(str) {
    return document.createTextNode(String(str));
  }

  const api = { el, clearChildren, text };

  // Browser global
  if (typeof window !== 'undefined') window.SafeDom = api;
  // CommonJS for tests
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
