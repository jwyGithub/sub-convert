var mr = Object.defineProperty;
var ht = (e) => {
  throw TypeError(e);
};
var br = (e, r, t) => r in e ? mr(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t;
var k = (e, r, t) => br(e, typeof r != "symbol" ? r + "" : r, t), Xe = (e, r, t) => r.has(e) || ht("Cannot " + t);
var u = (e, r, t) => (Xe(e, r, "read from private field"), t ? t.call(e) : r.get(e)), x = (e, r, t) => r.has(e) ? ht("Cannot add the same private member more than once") : r instanceof WeakSet ? r.add(e) : r.set(e, t), v = (e, r, t, n) => (Xe(e, r, "write to private field"), n ? n.call(e, t) : r.set(e, t), t), Ze = (e, r, t) => (Xe(e, r, "access private method"), t);
function Pt() {
  return [
    { label: "Clash", value: "clash" },
    { label: "Sing-box", value: "singbox" },
    { label: "v2ray", value: "v2ray" }
  ];
}
class _ {
  static json(r, t = 200) {
    return new Response(JSON.stringify(r), {
      status: t,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  static error(r, t = 400) {
    return this.json({ error: r }, t);
  }
  static success(r) {
    return this.json({ data: r });
  }
  static cors(r) {
    const t = new Headers(r.headers);
    return t.set("Access-Control-Allow-Origin", "*"), t.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"), t.set("Access-Control-Allow-Headers", "Content-Type"), new Response(r.body, {
      status: r.status,
      statusText: r.statusText,
      headers: t
    });
  }
}
class gr {
  constructor(r) {
    this.service = r;
  }
  async toSub(r, t) {
    try {
      const n = new URL(r.url).searchParams.get("target");
      if (!n)
        return _.error("Unsupported client type");
      const o = Pt().map((a) => a.value);
      if (!o.includes(n))
        return _.error(`Unsupported client type, support list: ${o.join(", ")}`);
      const s = await this.service.toSub(r, t, n);
      return _.cors(s);
    } catch (n) {
      return _.error(n.message || "Invalid request");
    }
  }
  async getVersion(r, t) {
    return this.service.getVersion(r, t);
  }
  async add(r) {
    try {
      const { long_url: t, serve: n } = await r.json();
      if (!t)
        return _.error("Missing long_url");
      const i = new URL(r.url), o = n || `${i.protocol}//${i.host}`, s = await this.service.add(t, o);
      return _.success(s);
    } catch (t) {
      return _.error(t.message || "Invalid request");
    }
  }
  async delete(r) {
    try {
      const n = new URL(r.url).searchParams.get("code");
      return n ? (await this.service.deleteByCode(n), _.success({ deleted: !0 })) : _.error("Missing code");
    } catch (t) {
      return _.error(t.message || "Invalid request");
    }
  }
  async queryByCode(r) {
    try {
      const n = new URL(r.url).searchParams.get("code");
      if (!n)
        return _.error("Missing code");
      const i = await this.service.getByCode(n);
      return i ? _.success(i) : _.error("Not found", 404);
    } catch (t) {
      return _.error(t.message || "Invalid request");
    }
  }
  async queryList(r) {
    try {
      const t = new URL(r.url), n = Number.parseInt(t.searchParams.get("page") || "1"), i = Number.parseInt(t.searchParams.get("pageSize") || "10"), o = await this.service.getList(n, i);
      return _.success(o);
    } catch (t) {
      return _.error(t.message || "Invalid request");
    }
  }
  async redirect(r) {
    var t;
    try {
      const n = (t = r.params) == null ? void 0 : t.code;
      if (!n)
        return _.error("Invalid short URL");
      const i = await this.service.getByCode(n);
      return i ? Response.redirect(i.long_url, 302) : _.error("Not found", 404);
    } catch (n) {
      return _.error(n.message || "Invalid request");
    }
  }
}
class vr {
  constructor() {
    k(this, "routes", []);
  }
  get(r, t) {
    return this.add("GET", r, t), this;
  }
  post(r, t) {
    return this.add("POST", r, t), this;
  }
  put(r, t) {
    return this.add("PUT", r, t), this;
  }
  delete(r, t) {
    return this.add("DELETE", r, t), this;
  }
  add(r, t, n) {
    const i = t.startsWith("/") ? t : `/${t}`;
    this.routes.push({
      pattern: new URLPattern({ pathname: i }),
      handler: async (o, s) => o.method !== r ? new Response("Method Not Allowed", { status: 405 }) : n(o, s)
    });
  }
  async handle(r, t) {
    const n = new URL(r.url);
    for (const i of this.routes) {
      const o = i.pattern.exec(n);
      if (o) {
        const s = o.pathname.groups;
        return Object.defineProperty(r, "params", {
          value: s,
          writable: !1
        }), i.handler(r, t);
      }
    }
    return new Response("Not Found", { status: 404 });
  }
}
function wr() {
  return `
        <script>
            class SubButton extends HTMLElement {
                static get observedAttributes() {
                    return ['disabled', 'readonly', 'type'];
                }

                constructor() {
                    super();
                    this.attachShadow({ mode: 'open' });
                    this.#render();
                }

                #injectStyle() {
                    const style = document.createElement('style');
                    style.textContent = \`
                        :host {
                            display: inline-block;
                        }

                        .sub-button {
                            position: relative;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            padding: 4px 15px;
                            font-size: 14px;
                            border-radius: var(--radius);
                            border: 1px solid var(--border-color);
                            background: var(--background);
                            color: var(--text-primary);
                            cursor: pointer;
                            transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
                            user-select: none;
                            height: 32px;
                            min-width: 88px;
                            white-space: nowrap;
                            gap: 6px;
                        }

                        .sub-button:not(:disabled):not([readonly]):hover {
                            color: var(--primary-color);
                            border-color: var(--primary-color);
                        }

                        .sub-button:not(:disabled):not([readonly]):active {
                            opacity: 0.8;
                        }

                        .sub-button[type="primary"] {
                            background: var(--primary-color);
                            border-color: var(--primary-color);
                            color: #fff;
                        }

                        .sub-button[type="primary"]:not(:disabled):not([readonly]):hover {
                            background: var(--primary-hover);
                            border-color: var(--primary-hover);
                            color: #fff;
                        }

                        .sub-button:disabled,
                        .sub-button[readonly] {
                            cursor: not-allowed;
                            background-color: var(--background-disabled);
                            border-color: var(--border-color);
                            color: var(--text-disabled);
                        }

                        /* 波纹效果 */
                        .sub-button::after {
                            content: '';
                            position: absolute;
                            inset: -1px;
                            border-radius: inherit;
                            opacity: 0;
                            transition: all 0.2s;
                            background-color: var(--primary-color);
                        }

                        .sub-button:not(:disabled):not([readonly]):active::after {
                            opacity: 0.1;
                            transition: 0s;
                        }

                        /* 图标样式 */
                        ::slotted(svg) {
                            width: 16px;
                            height: 16px;
                            fill: currentColor;
                        }
                    \`;
                    this.shadowRoot.appendChild(style);
                }

                #injectElement() {
                    const button = document.createElement('button');
                    button.className = 'sub-button';

                    // 添加插槽
                    const slot = document.createElement('slot');
                    button.appendChild(slot);

                    this.shadowRoot.appendChild(button);
                }

                #render() {
                    this.#injectStyle();
                    this.#injectElement();
                }

                attributeChangedCallback(name, oldValue, newValue) {
                    if (oldValue === newValue) return;

                    const button = this.shadowRoot.querySelector('.sub-button');
                    if (!button) return;

                    switch (name) {
                        case 'disabled':
                            button.disabled = this.hasAttribute('disabled');
                            break;
                        case 'readonly':
                            button.setAttribute('readonly', '');
                            break;
                        case 'type':
                            button.setAttribute('type', newValue);
                            break;
                    }
                }
            }

            customElements.define('sub-button', SubButton);
        <\/script>
    `;
}
function xr() {
  return `
    <script>
        class SubCheckbox extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'options', 'disabled', 'key', 'span'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.state = {
                    value: [],
                    options: []
                };
                this.#render();
            }

            #initValue() {
                const selectedValues = this.getAttribute('value') || [];

                if (selectedValues.length > 0) {
                    this.state.value = selectedValues;
                    this.#renderOptions();
                }
            }

            #injectStyle() {
                const style = document.createElement('style');
                const span = this.getAttribute('span') || 4;
                style.textContent = \`
                    :host {
                        display: block;
                        width: 100%;
                    }
                    .sub-checkbox-container {
                        background-color: var(--background);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        transition: var(--transition);
                    }
                    .sub-checkbox-container:hover {
                        border-color: var(--border-hover);
                    }
                    .sub-checkbox-group {
                        display: grid;
                        grid-template-columns: repeat(\${span}, 1fr);
                        gap: 16px;
                        width: 100%;
                        height: 32px;
                    }
                    .sub-checkbox {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        user-select: none;
                        color: var(--text-primary);
                    }
                    .sub-checkbox__input {
                        position: relative;
                        width: 10px;
                        height: 10px;
                        border: 2px solid var(--border-color);
                        border-radius: 4px;
                        background-color: var(--background);
                        margin-right: 8px;
                        transition: all .3s;
                    }
                    .sub-checkbox__input::after {
                        content: '';
                        position: absolute;
                        top: 0px;
                        left: 3px;
                        width: 3px;
                        height: 6px;
                        border: 2px solid #fff;
                        border-left: 0;
                        border-top: 0;
                        transform: rotate(45deg) scaleY(0);
                        transition: transform .15s ease-in .05s;
                        transform-origin: center;
                    }
                    .sub-checkbox__input_checked {
                        background-color: var(--primary-color);
                        border-color: var(--primary-color);
                    }
                    .sub-checkbox__input_checked::after {
                        transform: rotate(45deg) scaleY(1);
                    }

                    .sub-checkbox__label {
                        font-size: 14px;
                        line-height: 14px;
                        white-space: nowrap
                    }

                    .sub-checkbox:hover .sub-checkbox__input:not(.sub-checkbox__input_disabled) {
                        border-color: var(--primary-color);
                    }
                    .sub-checkbox__input_disabled {
                        background-color: var(--background-disabled);
                        border-color: var(--border-color);
                    }
                    .sub-checkbox__label_disabled {
                        color: var(--text-disabled);
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const container = document.createElement('div');
                container.className = 'sub-checkbox-container';

                const wrapper = document.createElement('div');
                wrapper.className = 'sub-checkbox-group';

                container.appendChild(wrapper);
                this.shadowRoot.appendChild(container);

                this.#renderOptions();
            }

            #renderOptions() {
                const wrapper = this.shadowRoot.querySelector('.sub-checkbox-group');
                wrapper.innerHTML = '';

                this.state.options.forEach(option => {
                    const checkbox = document.createElement('label');
                    checkbox.className = 'sub-checkbox';

                    const input = document.createElement('span');
                    input.className = 'sub-checkbox__input';
                    if (this.state.value.includes(option.value)) {
                        input.classList.add('sub-checkbox__input_checked');
                    }
                    if (this.hasAttribute('disabled')) {
                        input.classList.add('sub-checkbox__input_disabled');
                    }

                    const label = document.createElement('span');
                    label.className = 'sub-checkbox__label';
                    if (this.hasAttribute('disabled')) {
                        label.classList.add('sub-checkbox__label_disabled');
                    }
                    label.textContent = option.label;

                    checkbox.appendChild(input);
                    checkbox.appendChild(label);

                    if (!this.hasAttribute('disabled')) {
                        checkbox.addEventListener('click', () => this.#handleClick(option.value));
                    }

                    wrapper.appendChild(checkbox);
                });
            }

            #handleClick(value) {
                const index = this.state.value.indexOf(value);
                if (index === -1) {
                    this.state.value.push(value);
                } else {
                    this.state.value.splice(index, 1);
                }

                this.#renderOptions();

                // 触发事件
                this.dispatchEvent(new Event('change', { bubbles: true }));
                this.dispatchEvent(new Event('input', { bubbles: true }));
                this.dispatchEvent(
                    new CustomEvent('update:value', {
                        detail: {
                            value: [...this.state.value]
                        },
                        bubbles: true
                    })
                );
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
            }

            get value() {
                return [...this.state.value];
            }

            set value(val) {
                if (Array.isArray(val)) {
                    this.state.value = [...val];
                    this.#renderOptions();
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;

                switch (name) {
                    case 'value':
                        try {
                            this.value = JSON.parse(newValue);
                        } catch (e) {
                            console.error('Invalid value format:', e);
                        }
                        break;
                    case 'options':
                        try {
                            this.state.options = JSON.parse(newValue);
                            this.#initValue(); // 设置选项后初始化选中状态
                            this.#renderOptions();
                        } catch (e) {
                            console.error('Invalid options format:', e);
                        }
                        break;
                    case 'disabled':
                        this.#renderOptions();
                        break;
                }
            }
        }
        customElements.define('sub-checkbox', SubCheckbox);
    <\/script>
    `;
}
function yr() {
  return `
    <script>
        class SubForm extends HTMLElement {
            static get observedAttributes() {
                return ['model', 'label-width'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.model = {};
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name === 'model' && oldValue !== newValue) {
                    try {
                        this.model = JSON.parse(newValue);
                        // 更新所有子组件的值
                        this.#updateChildrenValues();
                    } catch (e) {
                        console.error('Invalid model:', e);
                    }
                }
            }

            #updateChildrenValues() {
                // 找到所有带有 key 属性的子组件
                this.querySelectorAll('[key]').forEach(child => {
                    const key = child.getAttribute('key');
                    if (key && this.model[key] !== undefined) {
                        // 根据值的类型设置不同的格式
                        if (Array.isArray(this.model[key])) {
                            child.setAttribute('value', JSON.stringify(this.model[key]));
                        } else {
                            child.setAttribute('value', this.model[key]);
                        }
                    }
                });
            }

            connectedCallback() {
                const modelStr = this.getAttribute('model');
                if (modelStr) {
                    this.model = JSON.parse(modelStr);
                }

                this.addEventListener('update:value', e => {
                    const key = e.target.getAttribute('key');
                    if (key && this.model) {
                        this.model[key] = e.detail.value;
                        this.dispatchEvent(
                            new CustomEvent('form:change', {
                                detail: {
                                    key,
                                    value: e.detail.value,
                                    formData: this.model
                                },
                                bubbles: true
                            })
                        );
                    }
                });

                this.#render();
            }

            #injectStyle() {
                const style = document.createElement('style');
                const labelWidth = this.getAttribute('label-width') || '80px';
                style.textContent = \`
                    :host {
                        display: block;
                    }
                    form {
                        margin: 0;
                        padding: 0;
                    }
                    ::slotted(sub-form-item) {
                        --label-width: \${labelWidth};
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const form = document.createElement('form');
                const slot = document.createElement('slot');
                form.appendChild(slot);
                this.shadowRoot.appendChild(form);

                this.#bindEvents(form);
            }

            #bindEvents(form) {
                form.addEventListener('submit', e => {
                    e.preventDefault();
                    if (this.validate()) {
                        this.dispatchEvent(
                            new CustomEvent('submit', {
                                detail: this.getFormData(),
                                bubbles: true
                            })
                        );
                    }
                });
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
                this.#bindEvents(this.shadowRoot.querySelector('form'));
            }
        }
        customElements.define('sub-form', SubForm);
    <\/script>
    `;
}
function Cr() {
  return `
    <script>
        class SubFormItem extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }

            connectedCallback() {
                this.#render();
            }

            #render() {
                const style = document.createElement('style');
                style.textContent = \`
                    :host {
                        display: block;
                        margin-bottom: 24px;
                    }
                    .sub-form-item {
                        display: flex;
                        align-items: flex-start;
                        position: relative;
                    }
                    .sub-form-item__label {
                        flex: 0 0 auto;
                        width: var(--label-width, 80px);
                        text-align: right;
                        padding: 6px 12px 0 0;
                        color: var(--text-secondary);
                        font-size: 14px;
                        line-height: 20px;
                        font-weight: 500;
                        transition: var(--transition);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .sub-form-item__content {
                        flex: 1;
                        min-width: 0;
                        position: relative;
                        transition: var(--transition);
                    }
                    .sub-form-item__label.required::before {
                        content: '*';
                        color: #ff4d4f;
                        margin-right: 4px;
                    }
                    :host([disabled]) .sub-form-item__label {
                        color: var(--text-disabled);
                    }
                    :host([error]) .sub-form-item__label {
                        color: #ff4d4f;
                    }
                \`;

                const template = document.createElement('div');
                template.className = 'sub-form-item';

                const label = document.createElement('label');
                label.className = 'sub-form-item__label';
                label.textContent = this.getAttribute('label') || '';

                const content = document.createElement('div');
                content.className = 'sub-form-item__content';
                content.appendChild(document.createElement('slot'));

                template.appendChild(label);
                template.appendChild(content);

                this.shadowRoot.appendChild(style);
                this.shadowRoot.appendChild(template);
            }
        }
        customElements.define('sub-form-item', SubFormItem);
    <\/script>
    `;
}
function _r() {
  return `
    <script>
        class SubInput extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'placeholder', 'disabled', 'key'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.state = {
                    value: this.getAttribute('value') || ''
                };
                this.#render();
            }

            #injectStyle() {
                const style = document.createElement('style');
                style.textContent = \`
                    :host {
                        display: inline-block;
                        width: 100%;
                        vertical-align: bottom;
                        font-size: 14px;
                    }
                    .sub-input {
                        position: relative;
                        font-size: 14px;
                        display: inline-flex;
                        width: 100%;
                        line-height: 32px;
                    }
                    .sub-input__wrapper {
                        display: flex;
                        flex: 1;
                        align-items: center;
                        background-color: var(--background);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        transition: var(--transition);
                        overflow: hidden;
                    }
                    .sub-input__wrapper:hover {
                        border-color: var(--border-hover);
                    }
                    .sub-input__wrapper:focus-within {
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 2px var(--shadow);
                    }
                    .sub-input__inner {
                        flex: 1;
                        padding: 0 15px;
                        background: none;
                        border: none;
                        outline: none;
                        color: var(--text-primary);
                        font-size: inherit;
                        height: 100%;
                    }
                    .sub-input__inner::placeholder {
                        color: var(--text-secondary);
                    }
                    .sub-input__inner:disabled {
                        background-color: var(--background-disabled);
                        color: var(--text-disabled);
                    }
                    .sub-input__append {
                        background-color: var(--background-secondary);
                        border-color: var(--border-color);
                    }
                    ::slotted(button) {
                        margin: 0;
                        height: 100%;
                        width: 100%;
                        background-color: var(--primary-color);
                        color: var(--background);
                        border: 1px solid var(--primary-color);
                        padding: 0 20px;
                        border-radius: 0 var(--radius) var(--radius) 0;
                        cursor: pointer;
                        font-size: 14px;
                        line-height: 32px;
                        white-space: nowrap;
                        transition: var(--transition);
                        position: relative;
                        outline: none;
                    }
                    ::slotted(button:hover) {
                        background-color: var(--primary-hover);
                        border-color: var(--primary-hover);
                    }
                    ::slotted(button:active) {
                        background-color: var(--primary-active);
                        border-color: var(--primary-active);
                    }
                    .sub-input__prepend,
                    .sub-input__append {
                        display: flex;
                        align-items: center;
                        background-color: var(--background-secondary);
                        color: var(--text-secondary);
                        white-space: nowrap;
                        padding: 0 15px;
                        border: 1px solid var(--border-color);
                        transition: var(--transition);
                    }
                    .sub-input__prepend {
                        border-right: 0;
                        border-radius: var(--radius) 0 0 var(--radius);
                    }
                    .sub-input__append {
                        padding: 0;
                        border-left: 0;
                        border-radius: 0 var(--radius) var(--radius) 0;
                    }
                    .sub-input__prepend ::slotted(*) {
                        color: var(--text-secondary);
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const wrapper = document.createElement('div');
                wrapper.className = 'sub-input';

                // prepend slot
                const prepend = document.createElement('div');
                prepend.className = 'sub-input__prepend';
                prepend.style.display = 'none'; // 默认隐藏
                const prependSlot = document.createElement('slot');
                prependSlot.name = 'prepend';
                prepend.appendChild(prependSlot);

                // input wrapper
                const inputWrapper = document.createElement('div');
                inputWrapper.className = 'sub-input__wrapper';

                // input
                const input = document.createElement('input');
                input.className = 'sub-input__inner';
                input.value = this.state.value;
                input.placeholder = this.getAttribute('placeholder') || '';
                input.disabled = this.hasAttribute('disabled');
                inputWrapper.appendChild(input);

                // append slot
                const append = document.createElement('div');
                append.className = 'sub-input__append';
                append.style.display = 'none'; // 默认隐藏
                const appendSlot = document.createElement('slot');
                appendSlot.name = 'append';
                append.appendChild(appendSlot);

                wrapper.appendChild(prepend);
                wrapper.appendChild(inputWrapper);
                wrapper.appendChild(append);
                this.shadowRoot.appendChild(wrapper);

                // 监听插槽内容变化
                prependSlot.addEventListener('slotchange', e => {
                    const nodes = prependSlot.assignedNodes();
                    prepend.style.display = nodes.length ? 'flex' : 'none';
                    if (nodes.length) {
                        inputWrapper.style.borderTopLeftRadius = '0';
                        inputWrapper.style.borderBottomLeftRadius = '0';
                    } else {
                        inputWrapper.style.borderTopLeftRadius = '4px';
                        inputWrapper.style.borderBottomLeftRadius = '4px';
                    }
                });

                appendSlot.addEventListener('slotchange', e => {
                    const nodes = appendSlot.assignedNodes();
                    append.style.display = nodes.length ? 'flex' : 'none';
                    if (nodes.length) {
                        inputWrapper.style.borderTopRightRadius = '0';
                        inputWrapper.style.borderBottomRightRadius = '0';
                    } else {
                        inputWrapper.style.borderTopRightRadius = '4px';
                        inputWrapper.style.borderBottomRightRadius = '4px';
                    }
                });

                this.#bindEvents(input);
            }

            #bindEvents(input) {
                input.addEventListener('input', e => {
                    this.state.value = e.target.value;
                    this.dispatchEvent(new Event('input', { bubbles: true }));
                    this.dispatchEvent(new Event('change', { bubbles: true }));
                    this.dispatchEvent(
                        new CustomEvent('update:value', {
                            detail: {
                                value: e.target.value
                            },
                            bubbles: true
                        })
                    );
                });
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
            }

            get value() {
                return this.state.value;
            }

            set value(val) {
                if (val !== this.state.value) {
                    this.state.value = val;
                    const input = this.shadowRoot.querySelector('input');
                    if (input) {
                        input.value = val;
                    }
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;

                const input = this.shadowRoot.querySelector('input');
                if (!input) return;

                switch (name) {
                    case 'value':
                        this.value = newValue;
                        break;
                    case 'placeholder':
                        input.placeholder = newValue;
                        break;
                    case 'disabled':
                        input.disabled = this.hasAttribute('disabled');
                        break;
                }
            }
        }
        customElements.define('sub-input', SubInput);
    <\/script>
    `;
}
function Sr() {
  return `
        <style>
            /* 添加通知组件样式 */
            .notification-container {
                position: fixed;
                top: 8px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: center;
                pointer-events: none;
            }

            .notification {
                padding: 9px 12px;
                margin-bottom: 8px;
                border-radius: 4px;
                background: var(--background);
                box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
                display: inline-flex;
                align-items: center;
                gap: 8px;
                pointer-events: auto;
                animation: messageMove 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            }

            .notification-icon {
                font-size: 16px;
                line-height: 1;
            }

            .notification.success .notification-icon {
                color: #52c41a;
            }

            .notification.error .notification-icon {
                color: #ff4d4f;
            }

            .notification.info .notification-icon {
                color: var(--primary-color);
            }

            .notification-content {
                color: var(--text-primary);
                font-size: 14px;
                line-height: 1.5;
            }

            @keyframes messageMove {
                0% {
                    padding: 6px 12px;
                    opacity: 0;
                    transform: translateY(-100%);
                }
                100% {
                    padding: 9px 12px;
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>


        <script>
            class SubNotification {
                static instance = null;

                constructor() {
                    if (SubNotification.instance) {
                        return SubNotification.instance;
                    }
                    this.init();
                    SubNotification.instance = this;
                }

                init() {
                    const container = document.createElement('div');
                    container.className = 'notification-container';
                    document.body.appendChild(container);
                    this.container = container;
                }

                show(message, type = 'info', duration = 3000) {
                    const notification = document.createElement('div');
                    notification.className = \`notification \${type}\`;

                    // 添加图标
                    const icon = document.createElement('span');
                    icon.className = 'notification-icon';
                    icon.innerHTML = this.#getIconByType(type);

                    const content = document.createElement('span');
                    content.className = 'notification-content';
                    content.textContent = message;

                    notification.appendChild(icon);
                    notification.appendChild(content);
                    this.container.appendChild(notification);

                    const close = () => {
                        notification.style.opacity = '0';
                        notification.style.transform = 'translateY(-100%)';
                        notification.style.transition = 'all .3s cubic-bezier(.645,.045,.355,1)';
                        setTimeout(() => {
                            this.container.removeChild(notification);
                        }, 300);
                    };

                    if (duration > 0) {
                        setTimeout(close, duration);
                    }
                }

                static success(message, duration = 3000) {
                    if (!this.instance) {
                        new SubNotification();
                    }
                    this.instance.show(message, 'success', duration);
                }

                static error(message, duration = 3000) {
                    if (!this.instance) {
                        new SubNotification();
                    }
                    this.instance.show(message, 'error', duration);
                }

                static info(message, duration = 3000) {
                    if (!this.instance) {
                        new SubNotification();
                    }
                    this.instance.show(message, 'info', duration);
                }

                #getIconByType(type) {
                    const icons = {
                        success: \`<svg viewBox="64 64 896 896" width="1em" height="1em">
                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" fill="currentColor"/>
                        </svg>\`,
                        error: \`<svg viewBox="64 64 896 896" width="1em" height="1em">
                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" fill="currentColor"/>
                        </svg>\`,
                        info: \`<svg viewBox="64 64 896 896" width="1em" height="1em">
                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" fill="currentColor"/>
                        </svg>\`
                    };
                    return icons[type] || icons.info;
                }
            }

            // 添加到全局
            window.notification = SubNotification;
        <\/script>
    
    
    `;
}
function Ft() {
  return {
    arrow: `<svg viewBox="0 0 1024 1024" width="12" height="12">
                    <path d="M831.872 340.864L512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.6 30.592 30.592 0 0 0-42.752-.064z" fill="currentColor"></path>
                </svg>`,
    empty: `<svg viewBox="0 0 1024 1024" width="64" height="64">
                    <path d="M855.6 427.2H168.4c-12.8 0-24 10.4-24 23.2v374.4c0 12.8 11.2 23.2 24 23.2h687.2c12.8 0 24-10.4 24-23.2V450.4c0-12.8-11.2-23.2-24-23.2z" fill="#e6f0fc"></path>
                    <path d="M296 428.8h-128v372.8h128V428.8z m32 0v372.8h496V428.8H328z" fill="#ffffff"></path>
                    <path d="M440 176h144v76.8H440z" fill="#e6f0fc"></path>
                    <path d="M855.6 400H168.4c-12.8 0-24 10.4-24 23.2v374.4c0 12.8 11.2 23.2 24 23.2h687.2c12.8 0 24-10.4 24-23.2V423.2c0-12.8-11.2-23.2-24-23.2z m-687.2 27.2h687.2v374.4H168.4V427.2z" fill="#4c98f7"></path>
                </svg>`
  };
}
const kr = Ft();
function Ar() {
  return `
    <script>
        class SubMultiSelect extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'options', 'disabled'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.state = {
                    value: [],
                    options: [],
                    isOpen: false
                };
                this.#render();
            }

            #injectStyle() {
                const style = document.createElement('style');
                style.textContent = \`
                    :host {
                        display: inline-block;
                        width: 100%;
                        font-size: 14px;
                    }

                    .sub-multi-select {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                    }

                    .sub-multi-select__wrapper {
                        position: relative;
                        min-height: 32px;
                        padding: 0px 30px 0px 12px;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        background-color: var(--background);
                        cursor: pointer;
                        transition: var(--transition);
                        display: flex;
                        flex-wrap: wrap;
                        gap: 4px;
                        align-items: center;
                    }

                    .sub-multi-select__wrapper:hover {
                        border-color: var(--border-hover);
                    }

                    .sub-multi-select__wrapper_active {
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 2px var(--shadow);
                    }

                    .sub-multi-select__wrapper_disabled {
                        cursor: not-allowed;
                        background-color: var(--background-disabled);
                    }

                    .sub-multi-select__placeholder {
                        color: var(--text-secondary);
                    }

                    .sub-multi-select__tag {
                        display: inline-flex;
                        align-items: center;
                        padding: 0 8px;
                        height: 22px;
                        line-height: 22px;
                        background-color: var(--background-secondary);
                        border-radius: var(--radius);
                        color: var(--text-primary);
                        gap: 2px;
                    }

                    .sub-multi-select__tag-close {
                        cursor: pointer;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        transition: var(--transition);
                    }

                    .sub-multi-select__tag-close:hover {
                        background-color: rgba(0, 0, 0, 0.1);
                    }

                    .sub-multi-select__arrow {
                        position: absolute;
                        right: 8px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #c0c4cc;
                        transition: transform .3s;
                    }

                    .sub-multi-select__arrow_active {
                        transform: translateY(-50%) rotate(180deg);
                    }

                    .sub-multi-select__dropdown {
                        position: absolute;
                        top: calc(100% + 8px);
                        left: 0;
                        width: 100%;
                        max-height: 274px;
                        padding: 6px 0;
                        background: var(--background);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        box-shadow: 0 4px 12px var(--shadow);
                        box-sizing: border-box;
                        margin: 0;
                        opacity: 0;
                        transform: scaleY(0);
                        transform-origin: center top;
                        transition: .3s cubic-bezier(.645,.045,.355,1);
                        z-index: 1000;
                        overflow-y: auto;
                    }

                    .sub-multi-select__dropdown_visible {
                        opacity: 1;
                        transform: scaleY(1);
                    }

                    .sub-multi-select__option {
                        position: relative;
                        padding: 0 32px 0 12px;
                        height: 28px;
                        line-height: 28px;
                        color: var(--text-primary);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .sub-multi-select__option:hover {
                        background-color: var(--background-secondary);
                    }

                    .sub-multi-select__option_selected {
                        color: var(--primary-color);
                    }

                    .sub-multi-select__checkbox {
                        width: 12px;
                        height: 12px;
                        border: 1px solid var(--border-color);
                        border-radius: 4px;
                        position: relative;
                        transition: var(--transition);
                    }

                    .sub-multi-select__checkbox::after {
                        content: '';
                        position: absolute;
                        top: 1px;
                        left: 4px;
                        width: 3px;
                        height: 7px;
                        border: 2px solid #fff;
                        border-left: 0;
                        border-top: 0;
                        transform: rotate(45deg) scale(0);
                        transition: transform .15s ease-in .05s;
                        transform-origin: center;
                    }

                    .sub-multi-select__checkbox_checked {
                        background-color: var(--primary-color);
                        border-color: var(--primary-color);
                    }

                    .sub-multi-select__checkbox_checked::after {
                        transform: rotate(45deg) scale(1);
                    }

                    .sub-multi-select__empty {
                        padding: 32px 0;
                        text-align: center;
                        color: #909399;
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const template = document.createElement('div');
                template.className = 'sub-multi-select';

                // 创建选择框主体
                const wrapper = document.createElement('div');
                wrapper.className = 'sub-multi-select__wrapper';
                if (this.hasAttribute('disabled')) {
                    wrapper.classList.add('sub-multi-select__wrapper_disabled');
                }

                // 创建箭头图标
                const arrow = document.createElement('span');
                arrow.className = 'sub-multi-select__arrow';
                arrow.innerHTML = \`${kr.arrow}\`;

                // 创建下拉框
                const dropdown = document.createElement('div');
                dropdown.className = 'sub-multi-select__dropdown';

                wrapper.appendChild(arrow);
                template.appendChild(wrapper);
                template.appendChild(dropdown);

                this.shadowRoot.appendChild(template);

                this.#bindEvents(wrapper, arrow, dropdown);
                this.#renderTags(wrapper);
            }

            #renderTags(wrapper) {
                // 清空现有内容，保留箭头
                const arrow = wrapper.querySelector('.sub-multi-select__arrow');
                wrapper.innerHTML = '';

                if (this.state.value.length === 0) {
                    const placeholder = document.createElement('span');
                    placeholder.className = 'sub-multi-select__placeholder';
                    placeholder.textContent = this.getAttribute('placeholder') || '请选择';
                    wrapper.appendChild(placeholder);
                } else {
                    this.state.value.forEach(value => {
                        const option = this.state.options.find(opt => opt.value === value);
                        if (option) {
                            const tag = document.createElement('span');
                            tag.className = 'sub-multi-select__tag';
                            tag.innerHTML = \`
                                \${option.label}
                                <span class="sub-multi-select__tag-close">
                                    <svg viewBox="0 0 1024 1024" width="12" height="12">
                                        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" fill="currentColor"/>
                                    </svg>
                                </span>
                            \`;

                            // 添加删除标签的事件
                            const closeBtn = tag.querySelector('.sub-multi-select__tag-close');
                            closeBtn.addEventListener('click', e => {
                                e.stopPropagation();
                                this.#removeValue(value);
                            });

                            wrapper.appendChild(tag);
                        }
                    });
                }

                wrapper.appendChild(arrow);
            }

            #removeValue(value) {
                this.state.value = this.state.value.filter(v => v !== value);
                this.#renderTags(this.shadowRoot.querySelector('.sub-multi-select__wrapper'));
                this.#renderOptions(this.shadowRoot.querySelector('.sub-multi-select__dropdown'));
                this.#dispatchChangeEvent();
            }

            #bindEvents(wrapper, arrow, dropdown) {
                if (this.hasAttribute('disabled')) return;

                const closeDropdown = () => {
                    this.state.isOpen = false;
                    dropdown.classList.remove('sub-multi-select__dropdown_visible');
                    wrapper.classList.remove('sub-multi-select__wrapper_active');
                    arrow.classList.remove('sub-multi-select__arrow_active');
                };

                const handleClickOutside = event => {
                    const isClickInside = wrapper.contains(event.target) || dropdown.contains(event.target);
                    if (!isClickInside && this.state.isOpen) {
                        closeDropdown();
                    }
                };

                document.addEventListener('click', handleClickOutside);

                this.addEventListener('disconnected', () => {
                    document.removeEventListener('click', handleClickOutside);
                });

                const toggleDropdown = () => {
                    if (this.state.isOpen) {
                        closeDropdown();
                    } else {
                        document.dispatchEvent(
                            new CustomEvent('sub-multi-select-toggle', {
                                detail: { currentSelect: this }
                            })
                        );

                        this.state.isOpen = true;
                        dropdown.classList.add('sub-multi-select__dropdown_visible');
                        wrapper.classList.add('sub-multi-select__wrapper_active');
                        arrow.classList.add('sub-multi-select__arrow_active');

                        this.#renderOptions(dropdown);
                    }
                };

                wrapper.addEventListener('click', e => {
                    e.stopPropagation();
                    toggleDropdown();
                });

                document.addEventListener('sub-multi-select-toggle', e => {
                    if (e.detail.currentSelect !== this && this.state.isOpen) {
                        closeDropdown();
                    }
                });
            }

            #renderOptions(dropdown) {
                dropdown.innerHTML = '';

                if (this.state.options.length === 0) {
                    const empty = document.createElement('div');
                    empty.className = 'sub-multi-select__empty';
                    empty.textContent = '暂无数据';
                    dropdown.appendChild(empty);
                    return;
                }

                this.state.options.forEach(option => {
                    const optionEl = document.createElement('div');
                    optionEl.className = 'sub-multi-select__option';

                    const checkbox = document.createElement('span');
                    checkbox.className = 'sub-multi-select__checkbox';
                    if (this.state.value.includes(option.value)) {
                        checkbox.classList.add('sub-multi-select__checkbox_checked');
                        optionEl.classList.add('sub-multi-select__option_selected');
                    }

                    const label = document.createElement('span');
                    label.textContent = option.label;

                    optionEl.appendChild(checkbox);
                    optionEl.appendChild(label);

                    optionEl.addEventListener('click', e => {
                        e.stopPropagation();
                        this.#toggleOption(option);
                    });

                    dropdown.appendChild(optionEl);
                });
            }

            #toggleOption(option) {
                const index = this.state.value.indexOf(option.value);
                if (index === -1) {
                    this.state.value.push(option.value);
                } else {
                    this.state.value.splice(index, 1);
                }

                this.#renderTags(this.shadowRoot.querySelector('.sub-multi-select__wrapper'));
                this.#renderOptions(this.shadowRoot.querySelector('.sub-multi-select__dropdown'));
                this.#dispatchChangeEvent();
            }

            #dispatchChangeEvent() {
                this.dispatchEvent(new Event('change', { bubbles: true }));
                this.dispatchEvent(new Event('input', { bubbles: true }));
                this.dispatchEvent(
                    new CustomEvent('update:value', {
                        detail: {
                            value: [...this.state.value]
                        },
                        bubbles: true
                    })
                );
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
            }

            get value() {
                return [...this.state.value];
            }

            set value(val) {
                if (Array.isArray(val)) {
                    this.state.value = [...val];
                    this.#renderTags(this.shadowRoot.querySelector('.sub-multi-select__wrapper'));
                    if (this.shadowRoot.querySelector('.sub-multi-select__dropdown')) {
                        this.#renderOptions(this.shadowRoot.querySelector('.sub-multi-select__dropdown'));
                    }
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;

                switch (name) {
                    case 'value':
                        try {
                            
                            this.value = JSON.parse(newValue);
                        } catch (e) {
                            console.error('Invalid value format:', e);
                            this.value = [];
                        }
                        break;
                    case 'options':
                        try {
                            this.state.options = JSON.parse(newValue);
                            this.#renderTags(this.shadowRoot.querySelector('.sub-multi-select__wrapper'));
                            if (this.shadowRoot.querySelector('.sub-multi-select__dropdown')) {
                                this.#renderOptions(this.shadowRoot.querySelector('.sub-multi-select__dropdown'));
                            }
                        } catch (e) {
                            console.error('Invalid options format:', e);
                            this.state.options = [];
                        }
                        break;
                    case 'disabled':
                        const wrapper = this.shadowRoot.querySelector('.sub-multi-select__wrapper');
                        if (wrapper) {
                            if (this.hasAttribute('disabled')) {
                                wrapper.classList.add('sub-multi-select__wrapper_disabled');
                            } else {
                                wrapper.classList.remove('sub-multi-select__wrapper_disabled');
                            }
                        }
                        break;
                }
            }
        }

        customElements.define('sub-multi-select', SubMultiSelect);
    <\/script>`;
}
const ft = Ft();
function Er() {
  return `
    <script>
        class SubSelect extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'options', 'placeholder', 'disabled', 'filterable'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.#init();
            }

            #render() {
                // 清空 shadowRoot
                this.shadowRoot.innerHTML = '';

                // 注入样式和元素
                this.#injectStyle();
                this.#injectElement();
            }

            get value() {
                return this.state?.value || '';
            }

            set value(val) {
                if (val !== this.state.value) {
                    this.state.value = val;
                    // 更新输入框显示
                    const input = this.shadowRoot.querySelector('.sub-select__input');
                    const option = this.state.options.find(opt => opt.value === val);
                    if (input && option) {
                        input.value = option.label;
                    }
                }
            }

            #init() {
                this.state = {
                    isOpen: false,
                    options: [],
                    value: this.getAttribute('value') || '',
                    filterValue: ''
                };
                this.#render();
            }

            #injectElement() {
                const template = document.createElement('div');
                template.className = 'sub-select';

                // 创建选择框主体
                const wrapper = document.createElement('div');
                wrapper.className = 'sub-select__wrapper';
                if (this.hasAttribute('disabled')) {
                    wrapper.classList.add('sub-select__wrapper_disabled');
                }

                // 创建输入框
                const input = document.createElement('input');
                input.className = 'sub-select__input';
                input.placeholder = this.getAttribute('placeholder') || '请选择';
                input.readOnly = !this.hasAttribute('filterable');

                // 如果有初始值，设置输入框的值
                if (this.state.value) {
                    const option = this.state.options.find(opt => opt.value === this.state.value);
                    if (option) {
                        input.value = option.label;
                    }
                }

                if (this.hasAttribute('disabled')) {
                    input.classList.add('sub-select__input_disabled');
                    input.disabled = true;
                }

                // 创建箭头图标
                const arrow = document.createElement('span');
                arrow.className = 'sub-select__arrow';
                arrow.innerHTML = \`${ft.arrow}\`;

                // 创建下拉框
                const dropdown = document.createElement('div');
                dropdown.className = 'sub-select__dropdown';

                // 组装组件
                wrapper.appendChild(input);
                wrapper.appendChild(arrow);
                template.appendChild(wrapper);
                template.appendChild(dropdown);

                this.shadowRoot.appendChild(template);

                // 绑定事件
                this.#bindEvents(wrapper, input, arrow, dropdown);
            }

            #injectStyle() {
                const style = document.createElement('style');
                style.textContent = \`
                    .sub-select {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                        font-size: 14px;
                    }

                    .sub-select__wrapper {
                        position: relative;
                        height: 32px;
                        padding: 0 30px 0 12px;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        background-color: var(--background);
                        cursor: pointer;
                        transition: var(--transition);
                    }

                    .sub-select__wrapper:hover {
                        border-color: var(--border-hover);
                    }

                    .sub-select__wrapper_active {
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 2px var(--shadow);
                    }

                    .sub-select__wrapper_disabled {
                        cursor: not-allowed;
                    }

                    .sub-select__input {
                        width: 100%;
                        height: 100%;
                        border: none;
                        outline: none;
                        background: none;
                        padding: 0;
                        margin: 0;
                        color: var(--text-primary);
                        cursor: inherit;
                    }

                    .sub-select__input::placeholder {
                        color: var(--text-secondary);
                    }

                    .sub-select__input_disabled {
                        cursor: not-allowed;
                        color: #c0c4cc;
                    }

                    .sub-select__input_placeholder {
                        color: var(--text-secondary);
                    }

                    .sub-select__arrow {
                        position: absolute;
                        right: 8px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #c0c4cc;
                        transition: transform .3s;
                    }

                    .sub-select__arrow_active {
                        transform: translateY(-50%) rotate(180deg);
                    }

                    .sub-select__dropdown {
                        position: absolute;
                        top: calc(100% + 8px);
                        left: 0;
                        width: 100%;
                        max-height: 274px;
                        padding: 6px 0;
                        background: var(--background);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        box-shadow: 0 4px 12px var(--shadow);
                        box-sizing: border-box;
                        margin: 0;
                        opacity: 0;
                        transform: scaleY(0);
                        transform-origin: center top;
                        transition: .3s cubic-bezier(.645,.045,.355,1);
                        z-index: 1000;
                        overflow-y: auto;
                    }

                    .sub-select__dropdown_visible {
                        opacity: 1;
                        transform: scaleY(1);
                    }

                    .sub-select__option {
                        position: relative;
                        padding: 0 32px 0 12px;
                        height: 34px;
                        line-height: 34px;
                        color: var(--text-primary);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        cursor: pointer;
                    }

                    .sub-select__option:hover {
                        background-color: var(--background-secondary);
                    }

                    .sub-select__option_selected {
                        color: var(--primary-color);
                        background-color: var(--background-secondary);
                    }

                    .sub-select__option_custom {
                        color: #409eff;
                    }

                    .sub-select__empty {
                        padding: 32px 0;
                        text-align: center;
                        color: #909399;
                    }

                    .sub-select__empty-icon {
                        margin-bottom: 8px;
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #bindEvents(wrapper, input, arrow, dropdown) {
                if (this.hasAttribute('disabled')) return;

                const closeDropdown = () => {
                    this.state.isOpen = false;
                    dropdown.classList.remove('sub-select__dropdown_visible');
                    wrapper.classList.remove('sub-select__wrapper_active');
                    arrow.classList.remove('sub-select__arrow_active');
                };

                // 添加全局点击事件监听
                const handleClickOutside = event => {
                    const isClickInside = wrapper.contains(event.target) || dropdown.contains(event.target);
                    if (!isClickInside && this.state.isOpen) {
                        closeDropdown();
                        if (this.hasAttribute('filterable')) {
                            // 如果没有输入新的值，恢复原来的值
                            if (!this.state.filterValue) {
                                const option = this.state.options.find(opt => opt.value === this.state.value);
                                if (option) {
                                    input.value = option.label;
                                }
                            }
                        }
                        this.state.filterValue = '';
                    }
                };

                // 在组件连接到 DOM 时添加事件监听
                document.addEventListener('click', handleClickOutside);

                // 在组件断开连接时移除事件监听，防止内存泄漏
                this.addEventListener('disconnected', () => {
                    document.removeEventListener('click', handleClickOutside);
                });

                const toggleDropdown = () => {
                    const isDisabled = this.getAttribute('disabled');
                    if(isDisabled === 'true') return;

                    if (this.state.isOpen) {
                        closeDropdown();
                        if (this.hasAttribute('filterable')) {
                            // 如果没有输入新的值，恢复原来的值
                            if (!this.state.filterValue) {
                                const option = this.state.options.find(opt => opt.value === this.state.value);
                                if (option) {
                                    input.value = option.label;
                                }
                            }
                        }
                        this.state.filterValue = '';
                    } else {
                        // 触发全局事件，通知其他 select 关闭
                        document.dispatchEvent(
                            new CustomEvent('sub-select-toggle', {
                                detail: { currentSelect: this }
                            })
                        );

                        this.state.isOpen = true;
                        dropdown.classList.add('sub-select__dropdown_visible');
                        wrapper.classList.add('sub-select__wrapper_active');
                        arrow.classList.add('sub-select__arrow_active');

                        // 如果是可过滤的，保存当前值为 placeholder 并清空输入框
                        if (this.hasAttribute('filterable')) {
                            const currentValue = input.value;
                            input.placeholder = currentValue;
                            input.value = '';
                            input.focus();
                        }

                        this.#renderOptions(dropdown);
                    }
                };

                wrapper.addEventListener('click', e => {
                    e.stopPropagation();
                    toggleDropdown();
                });

                // 监听全局事件，当其他 select 打开时关闭当前 select
                document.addEventListener('sub-select-toggle', e => {
                    if (e.detail.currentSelect !== this && this.state.isOpen) {
                        closeDropdown();
                        if (this.hasAttribute('filterable')) {
                            // 如果没有输入新的值，恢复原来的值
                            if (!this.state.filterValue) {
                                const option = this.state.options.find(opt => opt.value === this.state.value);
                                if (option) {
                                    input.value = option.label;
                                }
                            }
                        }
                        this.state.filterValue = '';
                    }
                });

                if (this.hasAttribute('filterable')) {
                    input.addEventListener('input', e => {
                        e.stopPropagation();
                        this.state.filterValue = e.target.value;
                        if (!this.state.isOpen) {
                            toggleDropdown();
                        } else {
                            this.#renderOptions(dropdown);
                        }
                    });
                }
            }

            #renderOptions(dropdown) {
                dropdown.innerHTML = '';
                let options = [...this.state.options];  // 创建一个副本，避免直接修改原数组

                // 如果是过滤模式且有输入值
                if (this.hasAttribute('filterable') && this.state.filterValue) {
                    // 过滤匹配的选项
                    const filteredOptions = options.filter(option => 
                        option.label.toLowerCase().includes(this.state.filterValue.toLowerCase())
                    );

                    // 如果没有匹配的选项，添加自定义选项
                    if (filteredOptions.length === 0) {
                        const customOption = document.createElement('div');
                        customOption.className = 'sub-select__option sub-select__option_custom';
                        customOption.textContent = this.state.filterValue;
                        customOption.addEventListener('click', e => {
                            e.stopPropagation();
                            this.#selectOption({
                                value: this.state.filterValue,
                                label: this.state.filterValue
                            });
                        });
                        dropdown.appendChild(customOption);
                        return;
                    }

                    // 显示过滤后的选项
                    options = filteredOptions;
                }

                // 如果没有选项，显示空状态
                if (options.length === 0) {
                    const empty = document.createElement('div');
                    empty.className = 'sub-select__empty';
                    empty.innerHTML = \`
                        <div class="sub-select__empty-icon">${ft.empty}</div>
                        <div>暂无数据</div>
                    \`;
                    dropdown.appendChild(empty);
                    return;
                }

                // 渲染选项列表
                options.forEach(option => {
                    const optionEl = document.createElement('div');
                    optionEl.className = 'sub-select__option';
                    if (option.value === this.state.value) {
                        optionEl.classList.add('sub-select__option_selected');
                    }
                    optionEl.textContent = option.label;
                    optionEl.addEventListener('click', e => {
                        e.stopPropagation();
                        this.#selectOption(option);
                    });
                    dropdown.appendChild(optionEl);
                });
            }

            #selectOption(option) {
                this.state.value = option.value;
                const input = this.shadowRoot.querySelector('.sub-select__input');
                input.value = option.label;

                // 如果是自定义选项，添加到选项列表中
                if (!this.state.options.some(opt => opt.value === option.value)) {
                    this.state.options = [...this.state.options, option];
                }

                // 清空过滤值
                this.state.filterValue = '';

                // 关闭下拉框
                const wrapper = this.shadowRoot.querySelector('.sub-select__wrapper');
                const arrow = this.shadowRoot.querySelector('.sub-select__arrow');
                const dropdown = this.shadowRoot.querySelector('.sub-select__dropdown');
                dropdown.classList.remove('sub-select__dropdown_visible');
                wrapper.classList.remove('sub-select__wrapper_active');
                arrow.classList.remove('sub-select__arrow_active');
                this.state.isOpen = false;

                // 触发事件通知外部值变化
                this.dispatchEvent(new Event('change', { bubbles: true }));
                this.dispatchEvent(new Event('input', { bubbles: true }));
                // 触发 update:value 事件，用于表单数据同步
                this.dispatchEvent(
                    new CustomEvent('update:value', {
                        detail: {
                            value: option.value,
                            option
                        },
                        bubbles: true
                    })
                );
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (name === 'options' && newValue !== oldValue) {
                    try {
                        this.state.options = JSON.parse(newValue);
                        // 设置初始值
                        if (this.state.value) {
                            const input = this.shadowRoot.querySelector('.sub-select__input');
                            const option = this.state.options.find(opt => opt.value === this.state.value);
                            if (option && input) {
                                input.value = option.label;
                            }
                        }
                        if (this.shadowRoot.querySelector('.sub-select__dropdown')) {
                            this.#renderOptions(this.shadowRoot.querySelector('.sub-select__dropdown'));
                        }
                    } catch (e) {
                        console.error('Invalid options format:', e);
                        this.state.options = [];
                    }
                } else if (name === 'value' && newValue !== oldValue) {
                    this.state.value = newValue;
                    const input = this.shadowRoot.querySelector('.sub-select__input');
                    const option = this.state.options.find(opt => opt.value === newValue);
                    if (option && input) {
                        input.value = option.label;
                    }
                } else if (name === 'disabled' && newValue !== oldValue) {
                    const input = this.shadowRoot.querySelector('.sub-select__input');
                    if (newValue) {
                        input.disabled = true;
                    } else {
                        input.disabled = false;
                    }
                }
            }
        }

        customElements.define('sub-select', SubSelect);
    <\/script>`;
}
function Lr() {
  return `
    <script>
        class SubTextarea extends HTMLElement {
            static get observedAttributes() {
                return ['value', 'placeholder', 'disabled', 'rows', 'key'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.state = {
                    value: this.getAttribute('value') || ''
                };
                this.#render();
            }

            #injectStyle() {
                const style = document.createElement('style');
                style.textContent = \`
                    :host {
                        display: inline-block;
                        width: 100%;
                        vertical-align: bottom;
                        font-size: 14px;
                    }
                    .sub-textarea {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                    }
                    .sub-textarea__inner {
                        display: block;
                        resize: vertical;
                        padding: 5px 15px;
                        line-height: 1.5;
                        box-sizing: border-box;
                        width: 100%;
                        font-size: inherit;
                        color: var(--text-primary);
                        background-color: var(--background);
                        background-image: none;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
                        font-family: inherit;
                    }
                    .sub-textarea__inner:hover {
                        border-color: var(--border-hover);
                    }
                    .sub-textarea__inner:focus {
                        outline: none;
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 2px var(--shadow);
                    }
                    .sub-textarea__inner::placeholder {
                        color: var(--text-secondary);
                    }
                    .sub-textarea__inner:disabled {
                        background-color: var(--background-disabled);
                        border-color: var(--border-color);
                        color: var(--text-disabled);
                        cursor: not-allowed;
                    }
                \`;
                this.shadowRoot.appendChild(style);
            }

            #injectElement() {
                const wrapper = document.createElement('div');
                wrapper.className = 'sub-textarea';

                const textarea = document.createElement('textarea');
                textarea.className = 'sub-textarea__inner';
                textarea.value = this.state.value;
                textarea.placeholder = this.getAttribute('placeholder') || '';
                textarea.rows = this.getAttribute('rows') || 2;
                textarea.disabled = this.hasAttribute('disabled');

                wrapper.appendChild(textarea);
                this.shadowRoot.appendChild(wrapper);

                this.#bindEvents(textarea);
            }

            #bindEvents(textarea) {
                textarea.addEventListener('input', e => {
                    this.state.value = e.target.value;
                    // 触发原生事件
                    this.dispatchEvent(new Event('input', { bubbles: true }));
                    this.dispatchEvent(new Event('change', { bubbles: true }));
                    // 触发自定义事件
                    this.dispatchEvent(
                        new CustomEvent('update:value', {
                            detail: {
                                value: e.target.value
                            },
                            bubbles: true
                        })
                    );
                });
            }

            #render() {
                this.#injectStyle();
                this.#injectElement();
            }

            // 提供 value 的 getter/setter
            get value() {
                return this.state.value;
            }

            set value(val) {
                if (val !== this.state.value) {
                    this.state.value = val;
                    const textarea = this.shadowRoot.querySelector('textarea');
                    if (textarea) {
                        textarea.value = val;
                    }
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) return;

                const textarea = this.shadowRoot.querySelector('textarea');
                if (!textarea) return;

                switch (name) {
                    case 'value':
                        this.value = newValue;
                        break;
                    case 'placeholder':
                        textarea.placeholder = newValue;
                        break;
                    case 'disabled':
                        textarea.disabled = this.hasAttribute('disabled');
                        break;
                    case 'rows':
                        textarea.rows = newValue;
                        break;
                }
            }
        }
        customElements.define('sub-textarea', SubTextarea);
    <\/script>
    `;
}
function Or() {
  return [
    { label: "Emoji", value: "emoji" },
    { label: "Clash New Field", value: "new_name" },
    { label: "UDP", value: "udp" },
    { label: "排序节点", value: "sort" },
    { label: "TFO", value: "tfo" },
    { label: "关闭证书检查", value: "scv" },
    { label: "节点类型", value: "append_type" }
  ];
}
function Rr(e, r) {
  const { origin: t } = new URL(e.url);
  return r.DEFAULT_BACKEND ?? t;
}
function Tr(e, r) {
  var i;
  const { origin: t } = new URL(e.url);
  return (((i = r.CUSTOM_BACKEND) == null ? void 0 : i.split(`
`).filter(Boolean)) ?? []).reduce(
    (o, s) => (o.push({ label: s, value: s }), o),
    [{ label: t, value: t }]
  ).concat(
    { label: "肥羊增强型后端【vless+hysteria】", value: "https://url.v1.mk" },
    { label: "肥羊备用后端【vless+hysteria】", value: "https://sub.d1.mk" },
    { label: "品云提供后端【实验性】", value: "https://v.id9.cc" },
    { label: "つつ-多地防失联【负载均衡+国内优化】", value: "https://api.tsutsu.one" },
    { label: "nameless13提供", value: "https://www.nameless13.com" },
    { label: "subconverter作者提供", value: "https://sub.xeton.dev" },
    { label: "sub-web作者提供", value: "https://api.wcc.best" },
    { label: "sub作者&lhie1提供", value: "https://api.dler.io" }
  );
}
function Nr() {
  return [
    { label: "Vless", value: "vless" },
    { label: "Vmess", value: "vmess" },
    { label: "Trojan", value: "trojan" },
    { label: "Shadowsocks", value: "shadowsocks" },
    { label: "ShadowsocksR", value: "shadowsocksr" },
    { label: "Hysteria", value: "hysteria" },
    { label: "Hysteria2", value: "hysteria2" },
    { label: "HY2", value: "hy2" }
  ];
}
function Ir(e) {
  var t;
  return (((t = e.REMOTE_CONFIG) == null ? void 0 : t.split(`
`).filter(Boolean)) ?? []).reduce(
    (n, i) => (n.unshift({
      label: i,
      value: i
    }), n),
    [
      {
        label: "ACL4SSR_Online 默认版 分组比较全 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini"
      },
      {
        label: "ACL4SSR_Online_AdblockPlus 更多去广告 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_AdblockPlus.ini"
      },
      {
        label: "ACL4SSR_Online_NoAuto 无自动测速 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoAuto.ini"
      },
      {
        label: "ACL4SSR_Online_NoReject 无广告拦截规则 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoReject.ini"
      },
      {
        label: "ACL4SSR_Online_Mini 精简版 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini.ini"
      },
      {
        label: "ACL4SSR_Online_Mini_AdblockPlus.ini 精简版 更多去广告 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_AdblockPlus.ini"
      },
      {
        label: "ACL4SSR_Online_Mini_NoAuto.ini 精简版 不带自动测速 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_NoAuto.ini"
      },
      {
        label: "ACL4SSR_Online_Mini_Fallback.ini 精简版 带故障转移 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_Fallback.ini"
      },
      {
        label: "ACL4SSR_Online_Mini_MultiMode.ini 精简版 自动测速、故障转移、负载均衡 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini"
      },
      {
        label: "ACL4SSR_Online_Full 全分组 重度用户使用 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full.ini"
      },
      {
        label: "ACL4SSR_Online_Full_NoAuto.ini 全分组 无自动测速 重度用户使用 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_NoAuto.ini"
      },
      {
        label: "ACL4SSR_Online_Full_AdblockPlus 全分组 重度用户使用 更多去广告 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini"
      },
      {
        label: "ACL4SSR_Online_Full_Netflix 全分组 重度用户使用 奈飞全量 (与Github同步)",
        value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Netflix.ini"
      }
    ]
  );
}
function Pr(e, r) {
  if (r.DB === void 0)
    return [];
  const { origin: t } = new URL(e.url);
  return [{ label: t, value: t }];
}
function Fr() {
  return `
        <script>
            // 检测系统主题
            function detectSystemTheme() {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    return 'dark';
                }
                return 'light';
            }

            // 设置主题
            function setTheme(theme) {
                if (theme === 'dark') {
                    document.documentElement.setAttribute('theme', 'dark');
                } else {
                    document.documentElement.removeAttribute('theme');
                }
                localStorage.setItem('theme', theme);
            }

            // 初始化主题
            function initTheme() {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme) {
                    setTheme(savedTheme);
                } else {
                    setTheme(detectSystemTheme());
                }
            }

            // 监听系统主题变化
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem('theme')) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            });

            // 页面加载时初始化主题
            document.addEventListener('DOMContentLoaded', () => {
                initTheme();

                // 添加主题切换按钮
                const toggleBtn = document.querySelector('.header__theme');
                toggleBtn.onclick = () => {
                    const isDark = document.documentElement.hasAttribute('theme');
                    setTheme(isDark ? 'light' : 'dark');
                };
            });
        <\/script>
    `;
}
function Ur() {
  return `
        <style>
            html,
            body {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', Arial, sans-serif;
                background-color: var(--background);
                color: var(--text-primary);
                transition: var(--transition);
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }

            /* 调整主体内容的布局 */
            main {
                width: 70%;
                max-width: 1200px;
                margin: 0 auto;
                margin-top: 20px;
                border: 1px solid var(--border-color);
                border-radius: var(--radius);
            }

            main > header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
                border-bottom: 1px solid var(--border-color);
                padding: 10px 15px;
            }

            main > header > .header__icon {
                width: 25px;
                height: 25px;
                cursor: pointer;
                transition: var(--transition);
            }

            main > header > .header__icon svg {
                width: 100%;
                height: 100%;
            }

            main > header > .header__iconsvg path {
                fill: var(--text-primary); /* 使用主题文字颜色 */
                transition: var(--transition);
            }

            main > header > .header__icon:hover svg path {
                fill: var(--primary-color); /* 悬浮时使用主题主色 */
            }

            /* 暗色主题下的样式 */
            :root[theme='dark'] main > header > .header__icon svg path {
                fill: var(--text-primary);
            }

            :root[theme='dark'] main > header > .header__icon:hover svg path {
                fill: var(--primary-color);
            }

            main > header > .header__title {
                font-size: 18px;
                font-weight: 600;
                color: var(--text-primary);
                text-align: center;
            }

            /* 主题切换按钮样式优化 */
            main > header > .header__theme {
                padding: 5px 10px;
                border-radius: var(--radius);
                border: 1px solid var(--border-color);
                background: var(--background);
                color: var(--text-primary);
                cursor: pointer;
                font-size: 14px;
                transition: var(--transition);
                display: flex;
                align-items: center;
                gap: 6px;
            }

            main > header > .header__theme:hover {
                border-color: var(--primary-color);
                color: var(--primary-color);
            }

            /* 添加主题图标 */
            main > header > .header__theme::before {
                content: '';
                width: 16px;
                height: 16px;
                background-image: var(--theme-icon);
                background-size: contain;
                background-repeat: no-repeat;
                transition: var(--transition);
            }

            /* 暗色主题图标 */
            :root[theme='dark'] main > header > .header__theme::before {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z'/%3E%3C/svg%3E");
            }

            /* 亮色主题图标 */
            :root:not([theme='dark']) main > header > .header__theme::before {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z'/%3E%3C/svg%3E");
            }

            main > section {
                margin-top: 20px;
                padding: 0 20px;
            }
        
        </style>`;
}
function Mr() {
  return `
    <style>
        /* 全局主题变量 */
        :root {
            /* Light Theme */
            --primary-color: #007aff;
            --primary-hover: #3395ff;
            --primary-active: #0056b3;
            --text-primary: #000000;
            --text-secondary: #666666;
            --text-disabled: #999999;
            --border-color: #9f9fa7;
            --border-hover: #b8b8bd;
            --background: #ffffff;
            --background-secondary: #f5f5f5;
            --background-disabled: #f2f2f7;
            --shadow: rgba(0, 0, 0, 0.1);
            --radius: 8px;
            --transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        /* Dark Theme */
        :root[theme='dark'] {
            --primary-color: #0a84ff;
            --primary-hover: #409cff;
            --primary-active: #0066cc;
            --text-primary: #ffffff;
            --text-secondary: #98989d;
            --text-disabled: #666666;
            --border-color: #9494a6;
            --border-hover: #48484c;
            --background: #1c1c1e;
            --background-secondary: #2c2c2e;
            --background-disabled: #38383c;
            --shadow: rgba(0, 0, 0, 0.3);
        }
    </style>
    `;
}
function $r(e, r) {
  var p;
  const t = Ir(r), n = Tr(e, r), i = Pr(e, r), o = Pt(), s = Or(), a = Nr(), l = Rr(e, r), c = r.DB !== void 0, d = `  
    <!DOCTYPE html>
        <html lang="en" theme="dark">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Sub Converter</title>

                ${Mr()}
                ${Ur()}

                <style>
                    .input-group {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .input-group input {
                        width: 100%;
                        padding: 4px 11px;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        transition: var(--transition);
                        min-height: 32px;
                        box-sizing: border-box;
                        flex: 1;
                        background-color: var(--background);
                        color: var(--text-disabled);
                        cursor: not-allowed;
                    }

                    .input-group input:disabled {
                        border-color: var(--border-color);
                        background-color: var(--background-disabled);
                        color: var(--text-disabled);
                        opacity: 1;
                    }

                    .sub-form-item__actions {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 20px;
                        margin-top: 24px;
                        padding-right: 100px;
                    }
                </style>
            </head>
            <body>
                ${Fr()}

                <main>
                    <header>
                        <span class="header__icon">
                            <svg
                                t="1735896323200"
                                class="icon"
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="1626"
                            >
                                <path
                                    d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667"
                                    fill="#231F20"
                                    p-id="1627"
                                ></path>
                            </svg>
                        </span>

                        <span class="header__title">订阅转换</span>

                        <button class="header__theme"></button>
                    </header>

                    <section>
                        <sub-form id="sub-convert-form" label-width="100px">
                            <sub-form-item label="订阅链接">
                                <sub-textarea
                                    key="url"
                                    placeholder="支持yml/yaml订阅格式，base64订阅格式链接或单节点链接，多个链接每行一个或用 | 分隔"
                                    rows="4"
                                ></sub-textarea>
                            </sub-form-item>

                            <sub-form-item label="生成类型">
                                <sub-select key="target"></sub-select>
                            </sub-form-item>

                            <sub-form-item label="远程配置">
                                <sub-select key="config" filterable></sub-select>
                            </sub-form-item>

                            <sub-form-item label="后端地址">
                                <sub-select key="backend" filterable></sub-select>
                            </sub-form-item>

                            <sub-form-item label="包含节点">
                                <sub-multi-select key="protocol"></sub-multi-select>
                            </sub-form-item>

                            <sub-form-item label="高级选项">
                                <sub-checkbox key="advanced" span="7"></sub-checkbox>
                            </sub-form-item>

                            <sub-form-item label="短链地址">
                                <sub-select key="shortServe" filterable placeholder="${c ? "" : "未配置数据库"}"></sub-select>
                            </sub-form-item>

                            <sub-form-item label="定制订阅">
                                <div class="input-group">
                                    <input type="text" value="" disabled id="form-subscribe" />
                                    <sub-button type="default" onclick="sub.copySubUrl('form-subscribe')">
                                        <svg
                                            viewBox="64 64 896 896"
                                            focusable="false"
                                            data-icon="copy"
                                            width="1em"
                                            height="1em"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"
                                            ></path>
                                        </svg>
                                        复制
                                    </sub-button>
                                </div>
                            </sub-form-item>

                            <sub-form-item label="订阅短链">
                                <div class="input-group">
                                    <input type="text" value="" disabled id="form-short-url" />
                                    <sub-button type="default" onclick="sub.copySubUrl('form-short-url')">
                                        <svg
                                            viewBox="64 64 896 896"
                                            focusable="false"
                                            data-icon="copy"
                                            width="1em"
                                            height="1em"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"
                                            ></path>
                                        </svg>
                                        复制
                                    </sub-button>
                                </div>
                            </sub-form-item>

                            <sub-form-item>
                                <div class="sub-form-item__actions">
                                    <sub-button disabled id="generate-sub-btn" type="default">生成订阅链接</sub-button>
                                    <sub-button disabled id="generate-short-url-btn" type="default">生成短链</sub-button>
                                </div>
                            </sub-form-item>
                        </sub-form>
                    </section>
                </main>

                ${_r()}
                ${Lr()}
                ${Er()}
                ${Ar()}
                ${xr()}
                ${Cr()}
                ${yr()}
                ${wr()}
                ${Sr()}

                <script>
                    const formConfig = {
                        target: {
                            type: 'sub-select',
                            options: ${JSON.stringify(o)}
                        },
                        config: {
                            type: 'sub-select',
                            options: ${JSON.stringify(t)}
                        },
                        backend: {
                            type: 'sub-select',
                            options: ${JSON.stringify(n)}
                        },
                        protocol: {
                            type: 'sub-multi-select',
                            options: ${JSON.stringify(a)}
                        },
                        advanced: {
                            type: 'sub-checkbox',
                            options: ${JSON.stringify(s)}
                        },
                        shortServe: {
                            type: 'sub-select',
                            options: ${JSON.stringify(i)}
                        }
                    };

                    class Sub {
                        #model = {
                            target: '${o[0].value}',
                            config: '${t[0].value}',
                            backend: '${l}',
                            protocol: '${JSON.stringify(a.map((h) => h.value))}',
                            advanced: ['emoji', 'new_name','scv'],
                            shortServe: '${((p = i[0]) == null ? void 0 : p.value) ?? ""}',

                            subUrl: '',
                            shortUrl: ''
                        };

                        #formSubscribe = this.#$('#form-subscribe');
                        #formShortUrl = this.#$('#form-short-url');

                        #generateSubBtn = this.#$('#generate-sub-btn');
                        #generateShortUrlBtn = this.#$('#generate-short-url-btn');

                        #form = this.#$('#sub-convert-form');
                        #formItems = this.#form.querySelectorAll('sub-form-item');

                        #headerIcon = this.#$('.header__icon');

                        constructor() {
                            this.#init();
                            this.#bindEvents();
                        }

                        #init() {
                            this.#formItems.forEach(item => {
                                const formItem = item.querySelector('[key]');
                                if (formItem) {
                                    const formItemKey = formItem.getAttribute('key');
                                    const type = formConfig[formItemKey]?.type;
                                    if (type && ['sub-select', 'sub-checkbox', 'sub-multi-select'].includes(type)) {
                                        formItem.setAttribute('options', JSON.stringify(formConfig[formItemKey].options));
                                    }

                                    if(formItemKey === 'shortServe' && ${!c}) {
                                        formItem.setAttribute('disabled', 'true');
                                    }

                                    if (formConfig[formItemKey]?.disabled) {
                                        formItem.setAttribute('disabled', '');
                                    }
                                }
                            });

                            this.#form.setAttribute('model', JSON.stringify(this.#model));
                        }

                        #bindEvents() {

                            this.#headerIcon.addEventListener('click', () => {
                                window.open('https://github.com/jwyGithub/sub-convert');
                            });


                            this.#form.addEventListener('form:change', e => {
                                this.#model[e.detail.key] = e.detail.value;
                                this.#form.setAttribute('model', JSON.stringify(this.#model));

                                if (this.#model.url) {
                                    this.#generateSubBtn.removeAttribute('disabled');
                                } else {
                                    this.#generateSubBtn.setAttribute('disabled', '');
                                }
                            });

                            this.#generateSubBtn.addEventListener('click', () => {
                                const url = new URL(this.#model.backend + '/sub');
                                url.searchParams.set('target', this.#model.target);
                                url.searchParams.set('url', this.#model.url);
                                url.searchParams.set('insert', 'true');
                                url.searchParams.set('config', this.#model.config);
                                url.searchParams.set('list', 'true');
                                url.searchParams.set('protocol', Array.isArray(this.#model.protocol) ? JSON.stringify(this.#model.protocol) : this.#model.protocol);
                                
                                const advancedOptions = this.#getAdvancedOptions(this.#model);

                                advancedOptions.forEach(option => {
                                    url.searchParams.set(option.label, option.value);
                                });

                                const subUrl = url.toString();
                                this.#formSubscribe.value = subUrl;
                                this.#model.subUrl = subUrl;

                                this.#generateShortUrlBtn.removeAttribute('disabled');
                            });



                            this.#generateShortUrlBtn.addEventListener('click', async () => {
                                if (!this.#model.shortServe) {
                                    notification.error('短链服务不存在');
                                    return;
                                }

                                // 构建请求数据
                                const requestData = {
                                    serve: this.#model.shortServe,
                                    long_url: this.#model.subUrl
                                };

                                // 发送请求
                                const response = await fetch(\`\${this.#model.shortServe}/api/add\`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(requestData)
                                });

                                if (response.ok) {
                                    const data = await response.json();
                                    this.#formShortUrl.value = data.data.short_url;
                                    this.#model.shortUrl = data.data.short_url;
                                    notification.success('生成短链接成功');
                                } else {
                                    notification.error('生成短链接失败');
                                }
                            });
                        }

                        #getAdvancedOptions(model) {
                            return formConfig.advanced.options.map(option => {
                                return {
                                    label: option.value,
                                    value: model.advanced.includes(option.value)
                                };
                            });
                        }

                        /**
                         * 获取元素
                         * @param {string} selector
                         * @returns {HTMLElement}
                         */
                        #$(selector) {
                            return document.querySelector(selector);
                        }

                        async copySubUrl(dom) {
                            const text = this.#$(\`#\${dom}\`).value;
                            if (!text) {
                                notification.error('复制内容不能为空');
                                return;
                            }

                            const success = await this.copyToClipboard(text);
                            if (success) {
                                notification.success('复制成功');
                            }
                        }

                        async copyToClipboard(text) {
                            try {
                                if (navigator.clipboard && window.isSecureContext) {
                                    // 优先使用 Clipboard API
                                    await navigator.clipboard.writeText(text);
                                    return true;
                                } else {
                                    // 降级使用 document.execCommand
                                    const textArea = document.createElement('textarea');
                                    textArea.value = text;
                                    textArea.style.position = 'fixed';
                                    textArea.style.left = '-999999px';
                                    textArea.style.top = '-999999px';
                                    document.body.appendChild(textArea);
                                    textArea.focus();
                                    textArea.select();

                                    const success = document.execCommand('copy');
                                    textArea.remove();

                                    if (!success) {
                                        throw new Error('复制失败');
                                    }
                                    return true;
                                }
                            } catch (error) {
                                notification.error('复制失败: ' + (error.message || '未知错误'));
                                return false;
                            }
                        }
                    }

                    const sub = new Sub();

                <\/script>
            </body>
        </html>
    `;
  return new Response(d, {
    headers: new Headers({
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "no-store, no-cache, must-revalidate"
    })
  });
}
/*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT */
function Ut(e) {
  return typeof e > "u" || e === null;
}
function Dr(e) {
  return typeof e == "object" && e !== null;
}
function Hr(e) {
  return Array.isArray(e) ? e : Ut(e) ? [] : [e];
}
function Vr(e, r) {
  var t, n, i, o;
  if (r)
    for (o = Object.keys(r), t = 0, n = o.length; t < n; t += 1)
      i = o[t], e[i] = r[i];
  return e;
}
function Br(e, r) {
  var t = "", n;
  for (n = 0; n < r; n += 1)
    t += e;
  return t;
}
function jr(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
var qr = Ut, zr = Dr, Yr = Hr, Wr = Br, Gr = jr, Kr = Vr, E = {
  isNothing: qr,
  isObject: zr,
  toArray: Yr,
  repeat: Wr,
  isNegativeZero: Gr,
  extend: Kr
};
function Mt(e, r) {
  var t = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (t += 'in "' + e.mark.name + '" '), t += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !r && e.mark.snippet && (t += `

` + e.mark.snippet), n + " " + t) : n;
}
function Ee(e, r) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = r, this.message = Mt(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Ee.prototype = Object.create(Error.prototype);
Ee.prototype.constructor = Ee;
Ee.prototype.toString = function(r) {
  return this.name + ": " + Mt(this, r);
};
var I = Ee;
function et(e, r, t, n, i) {
  var o = "", s = "", a = Math.floor(i / 2) - 1;
  return n - r > a && (o = " ... ", r = n - a + o.length), t - n > a && (s = " ...", t = n + a - s.length), {
    str: o + e.slice(r, t).replace(/\t/g, "→") + s,
    pos: n - r + o.length
    // relative position
  };
}
function tt(e, r) {
  return E.repeat(" ", r - e.length) + e;
}
function Jr(e, r) {
  if (r = Object.create(r || null), !e.buffer) return null;
  r.maxLength || (r.maxLength = 79), typeof r.indent != "number" && (r.indent = 1), typeof r.linesBefore != "number" && (r.linesBefore = 3), typeof r.linesAfter != "number" && (r.linesAfter = 2);
  for (var t = /\r?\n|\r|\0/g, n = [0], i = [], o, s = -1; o = t.exec(e.buffer); )
    i.push(o.index), n.push(o.index + o[0].length), e.position <= o.index && s < 0 && (s = n.length - 2);
  s < 0 && (s = n.length - 1);
  var a = "", l, c, d = Math.min(e.line + r.linesAfter, i.length).toString().length, p = r.maxLength - (r.indent + d + 3);
  for (l = 1; l <= r.linesBefore && !(s - l < 0); l++)
    c = et(
      e.buffer,
      n[s - l],
      i[s - l],
      e.position - (n[s] - n[s - l]),
      p
    ), a = E.repeat(" ", r.indent) + tt((e.line - l + 1).toString(), d) + " | " + c.str + `
` + a;
  for (c = et(e.buffer, n[s], i[s], e.position, p), a += E.repeat(" ", r.indent) + tt((e.line + 1).toString(), d) + " | " + c.str + `
`, a += E.repeat("-", r.indent + d + 3 + c.pos) + `^
`, l = 1; l <= r.linesAfter && !(s + l >= i.length); l++)
    c = et(
      e.buffer,
      n[s + l],
      i[s + l],
      e.position - (n[s] - n[s + l]),
      p
    ), a += E.repeat(" ", r.indent) + tt((e.line + l + 1).toString(), d) + " | " + c.str + `
`;
  return a.replace(/\n$/, "");
}
var Qr = Jr, Xr = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], Zr = [
  "scalar",
  "sequence",
  "mapping"
];
function ei(e) {
  var r = {};
  return e !== null && Object.keys(e).forEach(function(t) {
    e[t].forEach(function(n) {
      r[String(n)] = t;
    });
  }), r;
}
function ti(e, r) {
  if (r = r || {}, Object.keys(r).forEach(function(t) {
    if (Xr.indexOf(t) === -1)
      throw new I('Unknown option "' + t + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = r, this.tag = e, this.kind = r.kind || null, this.resolve = r.resolve || function() {
    return !0;
  }, this.construct = r.construct || function(t) {
    return t;
  }, this.instanceOf = r.instanceOf || null, this.predicate = r.predicate || null, this.represent = r.represent || null, this.representName = r.representName || null, this.defaultStyle = r.defaultStyle || null, this.multi = r.multi || !1, this.styleAliases = ei(r.styleAliases || null), Zr.indexOf(this.kind) === -1)
    throw new I('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var R = ti;
function mt(e, r) {
  var t = [];
  return e[r].forEach(function(n) {
    var i = t.length;
    t.forEach(function(o, s) {
      o.tag === n.tag && o.kind === n.kind && o.multi === n.multi && (i = s);
    }), t[i] = n;
  }), t;
}
function ri() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, r, t;
  function n(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (r = 0, t = arguments.length; r < t; r += 1)
    arguments[r].forEach(n);
  return e;
}
function it(e) {
  return this.extend(e);
}
it.prototype.extend = function(r) {
  var t = [], n = [];
  if (r instanceof R)
    n.push(r);
  else if (Array.isArray(r))
    n = n.concat(r);
  else if (r && (Array.isArray(r.implicit) || Array.isArray(r.explicit)))
    r.implicit && (t = t.concat(r.implicit)), r.explicit && (n = n.concat(r.explicit));
  else
    throw new I("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  t.forEach(function(o) {
    if (!(o instanceof R))
      throw new I("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new I("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new I("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(o) {
    if (!(o instanceof R))
      throw new I("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(it.prototype);
  return i.implicit = (this.implicit || []).concat(t), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = mt(i, "implicit"), i.compiledExplicit = mt(i, "explicit"), i.compiledTypeMap = ri(i.compiledImplicit, i.compiledExplicit), i;
};
var ii = it, ni = new R("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), oi = new R("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), si = new R("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), ai = new ii({
  explicit: [
    ni,
    oi,
    si
  ]
});
function li(e) {
  if (e === null) return !0;
  var r = e.length;
  return r === 1 && e === "~" || r === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function ci() {
  return null;
}
function ui(e) {
  return e === null;
}
var pi = new R("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: li,
  construct: ci,
  predicate: ui,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
});
function di(e) {
  if (e === null) return !1;
  var r = e.length;
  return r === 4 && (e === "true" || e === "True" || e === "TRUE") || r === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function hi(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function fi(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var mi = new R("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: di,
  construct: hi,
  predicate: fi,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
});
function bi(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function gi(e) {
  return 48 <= e && e <= 55;
}
function vi(e) {
  return 48 <= e && e <= 57;
}
function wi(e) {
  if (e === null) return !1;
  var r = e.length, t = 0, n = !1, i;
  if (!r) return !1;
  if (i = e[t], (i === "-" || i === "+") && (i = e[++t]), i === "0") {
    if (t + 1 === r) return !0;
    if (i = e[++t], i === "b") {
      for (t++; t < r; t++)
        if (i = e[t], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "x") {
      for (t++; t < r; t++)
        if (i = e[t], i !== "_") {
          if (!bi(e.charCodeAt(t))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (t++; t < r; t++)
        if (i = e[t], i !== "_") {
          if (!gi(e.charCodeAt(t))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; t < r; t++)
    if (i = e[t], i !== "_") {
      if (!vi(e.charCodeAt(t)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function xi(e) {
  var r = e, t = 1, n;
  if (r.indexOf("_") !== -1 && (r = r.replace(/_/g, "")), n = r[0], (n === "-" || n === "+") && (n === "-" && (t = -1), r = r.slice(1), n = r[0]), r === "0") return 0;
  if (n === "0") {
    if (r[1] === "b") return t * parseInt(r.slice(2), 2);
    if (r[1] === "x") return t * parseInt(r.slice(2), 16);
    if (r[1] === "o") return t * parseInt(r.slice(2), 8);
  }
  return t * parseInt(r, 10);
}
function yi(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !E.isNegativeZero(e);
}
var Ci = new R("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: wi,
  construct: xi,
  predicate: yi,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), _i = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function Si(e) {
  return !(e === null || !_i.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function ki(e) {
  var r, t;
  return r = e.replace(/_/g, "").toLowerCase(), t = r[0] === "-" ? -1 : 1, "+-".indexOf(r[0]) >= 0 && (r = r.slice(1)), r === ".inf" ? t === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : r === ".nan" ? NaN : t * parseFloat(r, 10);
}
var Ai = /^[-+]?[0-9]+e/;
function Ei(e, r) {
  var t;
  if (isNaN(e))
    switch (r) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (r) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (r) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (E.isNegativeZero(e))
    return "-0.0";
  return t = e.toString(10), Ai.test(t) ? t.replace("e", ".e") : t;
}
function Li(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || E.isNegativeZero(e));
}
var Oi = new R("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: Si,
  construct: ki,
  predicate: Li,
  represent: Ei,
  defaultStyle: "lowercase"
}), Ri = ai.extend({
  implicit: [
    pi,
    mi,
    Ci,
    Oi
  ]
}), Ti = Ri, $t = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), Dt = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function Ni(e) {
  return e === null ? !1 : $t.exec(e) !== null || Dt.exec(e) !== null;
}
function Ii(e) {
  var r, t, n, i, o, s, a, l = 0, c = null, d, p, h;
  if (r = $t.exec(e), r === null && (r = Dt.exec(e)), r === null) throw new Error("Date resolve error");
  if (t = +r[1], n = +r[2] - 1, i = +r[3], !r[4])
    return new Date(Date.UTC(t, n, i));
  if (o = +r[4], s = +r[5], a = +r[6], r[7]) {
    for (l = r[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return r[9] && (d = +r[10], p = +(r[11] || 0), c = (d * 60 + p) * 6e4, r[9] === "-" && (c = -c)), h = new Date(Date.UTC(t, n, i, o, s, a, l)), c && h.setTime(h.getTime() - c), h;
}
function Pi(e) {
  return e.toISOString();
}
var Fi = new R("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: Ni,
  construct: Ii,
  instanceOf: Date,
  represent: Pi
});
function Ui(e) {
  return e === "<<" || e === null;
}
var Mi = new R("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Ui
}), lt = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function $i(e) {
  if (e === null) return !1;
  var r, t, n = 0, i = e.length, o = lt;
  for (t = 0; t < i; t++)
    if (r = o.indexOf(e.charAt(t)), !(r > 64)) {
      if (r < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function Di(e) {
  var r, t, n = e.replace(/[\r\n=]/g, ""), i = n.length, o = lt, s = 0, a = [];
  for (r = 0; r < i; r++)
    r % 4 === 0 && r && (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)), s = s << 6 | o.indexOf(n.charAt(r));
  return t = i % 4 * 6, t === 0 ? (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)) : t === 18 ? (a.push(s >> 10 & 255), a.push(s >> 2 & 255)) : t === 12 && a.push(s >> 4 & 255), new Uint8Array(a);
}
function Hi(e) {
  var r = "", t = 0, n, i, o = e.length, s = lt;
  for (n = 0; n < o; n++)
    n % 3 === 0 && n && (r += s[t >> 18 & 63], r += s[t >> 12 & 63], r += s[t >> 6 & 63], r += s[t & 63]), t = (t << 8) + e[n];
  return i = o % 3, i === 0 ? (r += s[t >> 18 & 63], r += s[t >> 12 & 63], r += s[t >> 6 & 63], r += s[t & 63]) : i === 2 ? (r += s[t >> 10 & 63], r += s[t >> 4 & 63], r += s[t << 2 & 63], r += s[64]) : i === 1 && (r += s[t >> 2 & 63], r += s[t << 4 & 63], r += s[64], r += s[64]), r;
}
function Vi(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Bi = new R("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: $i,
  construct: Di,
  predicate: Vi,
  represent: Hi
}), ji = Object.prototype.hasOwnProperty, qi = Object.prototype.toString;
function zi(e) {
  if (e === null) return !0;
  var r = [], t, n, i, o, s, a = e;
  for (t = 0, n = a.length; t < n; t += 1) {
    if (i = a[t], s = !1, qi.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (ji.call(i, o))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (r.indexOf(o) === -1) r.push(o);
    else return !1;
  }
  return !0;
}
function Yi(e) {
  return e !== null ? e : [];
}
var Wi = new R("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: zi,
  construct: Yi
}), Gi = Object.prototype.toString;
function Ki(e) {
  if (e === null) return !0;
  var r, t, n, i, o, s = e;
  for (o = new Array(s.length), r = 0, t = s.length; r < t; r += 1) {
    if (n = s[r], Gi.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    o[r] = [i[0], n[i[0]]];
  }
  return !0;
}
function Ji(e) {
  if (e === null) return [];
  var r, t, n, i, o, s = e;
  for (o = new Array(s.length), r = 0, t = s.length; r < t; r += 1)
    n = s[r], i = Object.keys(n), o[r] = [i[0], n[i[0]]];
  return o;
}
var Qi = new R("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Ki,
  construct: Ji
}), Xi = Object.prototype.hasOwnProperty;
function Zi(e) {
  if (e === null) return !0;
  var r, t = e;
  for (r in t)
    if (Xi.call(t, r) && t[r] !== null)
      return !1;
  return !0;
}
function en(e) {
  return e !== null ? e : {};
}
var tn = new R("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Zi,
  construct: en
}), Ht = Ti.extend({
  implicit: [
    Fi,
    Mi
  ],
  explicit: [
    Bi,
    Wi,
    Qi,
    tn
  ]
}), J = Object.prototype.hasOwnProperty, je = 1, Vt = 2, Bt = 3, qe = 4, rt = 1, rn = 2, bt = 3, nn = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, on = /[\x85\u2028\u2029]/, sn = /[,\[\]\{\}]/, jt = /^(?:!|!!|![a-z\-]+!)$/i, qt = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function gt(e) {
  return Object.prototype.toString.call(e);
}
function V(e) {
  return e === 10 || e === 13;
}
function ce(e) {
  return e === 9 || e === 32;
}
function P(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function he(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function an(e) {
  var r;
  return 48 <= e && e <= 57 ? e - 48 : (r = e | 32, 97 <= r && r <= 102 ? r - 97 + 10 : -1);
}
function ln(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function cn(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function vt(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function un(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
var zt = new Array(256), Yt = new Array(256);
for (var pe = 0; pe < 256; pe++)
  zt[pe] = vt(pe) ? 1 : 0, Yt[pe] = vt(pe);
function pn(e, r) {
  this.input = e, this.filename = r.filename || null, this.schema = r.schema || Ht, this.onWarning = r.onWarning || null, this.legacy = r.legacy || !1, this.json = r.json || !1, this.listener = r.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Wt(e, r) {
  var t = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return t.snippet = Qr(t), new I(r, t);
}
function b(e, r) {
  throw Wt(e, r);
}
function ze(e, r) {
  e.onWarning && e.onWarning.call(null, Wt(e, r));
}
var wt = {
  YAML: function(r, t, n) {
    var i, o, s;
    r.version !== null && b(r, "duplication of %YAML directive"), n.length !== 1 && b(r, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && b(r, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), s = parseInt(i[2], 10), o !== 1 && b(r, "unacceptable YAML version of the document"), r.version = n[0], r.checkLineBreaks = s < 2, s !== 1 && s !== 2 && ze(r, "unsupported YAML version of the document");
  },
  TAG: function(r, t, n) {
    var i, o;
    n.length !== 2 && b(r, "TAG directive accepts exactly two arguments"), i = n[0], o = n[1], jt.test(i) || b(r, "ill-formed tag handle (first argument) of the TAG directive"), J.call(r.tagMap, i) && b(r, 'there is a previously declared suffix for "' + i + '" tag handle'), qt.test(o) || b(r, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      b(r, "tag prefix is malformed: " + o);
    }
    r.tagMap[i] = o;
  }
};
function K(e, r, t, n) {
  var i, o, s, a;
  if (r < t) {
    if (a = e.input.slice(r, t), n)
      for (i = 0, o = a.length; i < o; i += 1)
        s = a.charCodeAt(i), s === 9 || 32 <= s && s <= 1114111 || b(e, "expected valid JSON character");
    else nn.test(a) && b(e, "the stream contains non-printable characters");
    e.result += a;
  }
}
function xt(e, r, t, n) {
  var i, o, s, a;
  for (E.isObject(t) || b(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(t), s = 0, a = i.length; s < a; s += 1)
    o = i[s], J.call(r, o) || (r[o] = t[o], n[o] = !0);
}
function fe(e, r, t, n, i, o, s, a, l) {
  var c, d;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), c = 0, d = i.length; c < d; c += 1)
      Array.isArray(i[c]) && b(e, "nested arrays are not supported inside keys"), typeof i == "object" && gt(i[c]) === "[object Object]" && (i[c] = "[object Object]");
  if (typeof i == "object" && gt(i) === "[object Object]" && (i = "[object Object]"), i = String(i), r === null && (r = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (c = 0, d = o.length; c < d; c += 1)
        xt(e, r, o[c], t);
    else
      xt(e, r, o, t);
  else
    !e.json && !J.call(t, i) && J.call(r, i) && (e.line = s || e.line, e.lineStart = a || e.lineStart, e.position = l || e.position, b(e, "duplicated mapping key")), i === "__proto__" ? Object.defineProperty(r, i, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: o
    }) : r[i] = o, delete t[i];
  return r;
}
function ct(e) {
  var r;
  r = e.input.charCodeAt(e.position), r === 10 ? e.position++ : r === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : b(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function A(e, r, t) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; ce(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (r && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (V(i))
      for (ct(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return t !== -1 && n !== 0 && e.lineIndent < t && ze(e, "deficient indentation"), n;
}
function Qe(e) {
  var r = e.position, t;
  return t = e.input.charCodeAt(r), !!((t === 45 || t === 46) && t === e.input.charCodeAt(r + 1) && t === e.input.charCodeAt(r + 2) && (r += 3, t = e.input.charCodeAt(r), t === 0 || P(t)));
}
function ut(e, r) {
  r === 1 ? e.result += " " : r > 1 && (e.result += E.repeat(`
`, r - 1));
}
function dn(e, r, t) {
  var n, i, o, s, a, l, c, d, p = e.kind, h = e.result, f;
  if (f = e.input.charCodeAt(e.position), P(f) || he(f) || f === 35 || f === 38 || f === 42 || f === 33 || f === 124 || f === 62 || f === 39 || f === 34 || f === 37 || f === 64 || f === 96 || (f === 63 || f === 45) && (i = e.input.charCodeAt(e.position + 1), P(i) || t && he(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = s = e.position, a = !1; f !== 0; ) {
    if (f === 58) {
      if (i = e.input.charCodeAt(e.position + 1), P(i) || t && he(i))
        break;
    } else if (f === 35) {
      if (n = e.input.charCodeAt(e.position - 1), P(n))
        break;
    } else {
      if (e.position === e.lineStart && Qe(e) || t && he(f))
        break;
      if (V(f))
        if (l = e.line, c = e.lineStart, d = e.lineIndent, A(e, !1, -1), e.lineIndent >= r) {
          a = !0, f = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = l, e.lineStart = c, e.lineIndent = d;
          break;
        }
    }
    a && (K(e, o, s, !1), ut(e, e.line - l), o = s = e.position, a = !1), ce(f) || (s = e.position + 1), f = e.input.charCodeAt(++e.position);
  }
  return K(e, o, s, !1), e.result ? !0 : (e.kind = p, e.result = h, !1);
}
function hn(e, r) {
  var t, n, i;
  if (t = e.input.charCodeAt(e.position), t !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (t = e.input.charCodeAt(e.position)) !== 0; )
    if (t === 39)
      if (K(e, n, e.position, !0), t = e.input.charCodeAt(++e.position), t === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else V(t) ? (K(e, n, i, !0), ut(e, A(e, !1, r)), n = i = e.position) : e.position === e.lineStart && Qe(e) ? b(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  b(e, "unexpected end of the stream within a single quoted scalar");
}
function fn(e, r) {
  var t, n, i, o, s, a;
  if (a = e.input.charCodeAt(e.position), a !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, t = n = e.position; (a = e.input.charCodeAt(e.position)) !== 0; ) {
    if (a === 34)
      return K(e, t, e.position, !0), e.position++, !0;
    if (a === 92) {
      if (K(e, t, e.position, !0), a = e.input.charCodeAt(++e.position), V(a))
        A(e, !1, r);
      else if (a < 256 && zt[a])
        e.result += Yt[a], e.position++;
      else if ((s = ln(a)) > 0) {
        for (i = s, o = 0; i > 0; i--)
          a = e.input.charCodeAt(++e.position), (s = an(a)) >= 0 ? o = (o << 4) + s : b(e, "expected hexadecimal character");
        e.result += un(o), e.position++;
      } else
        b(e, "unknown escape sequence");
      t = n = e.position;
    } else V(a) ? (K(e, t, n, !0), ut(e, A(e, !1, r)), t = n = e.position) : e.position === e.lineStart && Qe(e) ? b(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  b(e, "unexpected end of the stream within a double quoted scalar");
}
function mn(e, r) {
  var t = !0, n, i, o, s = e.tag, a, l = e.anchor, c, d, p, h, f, m = /* @__PURE__ */ Object.create(null), g, w, C, y;
  if (y = e.input.charCodeAt(e.position), y === 91)
    d = 93, f = !1, a = [];
  else if (y === 123)
    d = 125, f = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), y = e.input.charCodeAt(++e.position); y !== 0; ) {
    if (A(e, !0, r), y = e.input.charCodeAt(e.position), y === d)
      return e.position++, e.tag = s, e.anchor = l, e.kind = f ? "mapping" : "sequence", e.result = a, !0;
    t ? y === 44 && b(e, "expected the node content, but found ','") : b(e, "missed comma between flow collection entries"), w = g = C = null, p = h = !1, y === 63 && (c = e.input.charCodeAt(e.position + 1), P(c) && (p = h = !0, e.position++, A(e, !0, r))), n = e.line, i = e.lineStart, o = e.position, _e(e, r, je, !1, !0), w = e.tag, g = e.result, A(e, !0, r), y = e.input.charCodeAt(e.position), (h || e.line === n) && y === 58 && (p = !0, y = e.input.charCodeAt(++e.position), A(e, !0, r), _e(e, r, je, !1, !0), C = e.result), f ? fe(e, a, m, w, g, C, n, i, o) : p ? a.push(fe(e, null, m, w, g, C, n, i, o)) : a.push(g), A(e, !0, r), y = e.input.charCodeAt(e.position), y === 44 ? (t = !0, y = e.input.charCodeAt(++e.position)) : t = !1;
  }
  b(e, "unexpected end of the stream within a flow collection");
}
function bn(e, r) {
  var t, n, i = rt, o = !1, s = !1, a = r, l = 0, c = !1, d, p;
  if (p = e.input.charCodeAt(e.position), p === 124)
    n = !1;
  else if (p === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; p !== 0; )
    if (p = e.input.charCodeAt(++e.position), p === 43 || p === 45)
      rt === i ? i = p === 43 ? bt : rn : b(e, "repeat of a chomping mode identifier");
    else if ((d = cn(p)) >= 0)
      d === 0 ? b(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? b(e, "repeat of an indentation width identifier") : (a = r + d - 1, s = !0);
    else
      break;
  if (ce(p)) {
    do
      p = e.input.charCodeAt(++e.position);
    while (ce(p));
    if (p === 35)
      do
        p = e.input.charCodeAt(++e.position);
      while (!V(p) && p !== 0);
  }
  for (; p !== 0; ) {
    for (ct(e), e.lineIndent = 0, p = e.input.charCodeAt(e.position); (!s || e.lineIndent < a) && p === 32; )
      e.lineIndent++, p = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > a && (a = e.lineIndent), V(p)) {
      l++;
      continue;
    }
    if (e.lineIndent < a) {
      i === bt ? e.result += E.repeat(`
`, o ? 1 + l : l) : i === rt && o && (e.result += `
`);
      break;
    }
    for (n ? ce(p) ? (c = !0, e.result += E.repeat(`
`, o ? 1 + l : l)) : c ? (c = !1, e.result += E.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += E.repeat(`
`, l) : e.result += E.repeat(`
`, o ? 1 + l : l), o = !0, s = !0, l = 0, t = e.position; !V(p) && p !== 0; )
      p = e.input.charCodeAt(++e.position);
    K(e, t, e.position, !1);
  }
  return !0;
}
function yt(e, r) {
  var t, n = e.tag, i = e.anchor, o = [], s, a = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, b(e, "tab characters must not be used in indentation")), !(l !== 45 || (s = e.input.charCodeAt(e.position + 1), !P(s)))); ) {
    if (a = !0, e.position++, A(e, !0, -1) && e.lineIndent <= r) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (t = e.line, _e(e, r, Bt, !1, !0), o.push(e.result), A(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === t || e.lineIndent > r) && l !== 0)
      b(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < r)
      break;
  }
  return a ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function gn(e, r, t) {
  var n, i, o, s, a, l, c = e.tag, d = e.anchor, p = {}, h = /* @__PURE__ */ Object.create(null), f = null, m = null, g = null, w = !1, C = !1, y;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = p), y = e.input.charCodeAt(e.position); y !== 0; ) {
    if (!w && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, b(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), o = e.line, (y === 63 || y === 58) && P(n))
      y === 63 ? (w && (fe(e, p, h, f, m, null, s, a, l), f = m = g = null), C = !0, w = !0, i = !0) : w ? (w = !1, i = !0) : b(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, y = n;
    else {
      if (s = e.line, a = e.lineStart, l = e.position, !_e(e, t, Vt, !1, !0))
        break;
      if (e.line === o) {
        for (y = e.input.charCodeAt(e.position); ce(y); )
          y = e.input.charCodeAt(++e.position);
        if (y === 58)
          y = e.input.charCodeAt(++e.position), P(y) || b(e, "a whitespace character is expected after the key-value separator within a block mapping"), w && (fe(e, p, h, f, m, null, s, a, l), f = m = g = null), C = !0, w = !1, i = !1, f = e.tag, m = e.result;
        else if (C)
          b(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = c, e.anchor = d, !0;
      } else if (C)
        b(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = c, e.anchor = d, !0;
    }
    if ((e.line === o || e.lineIndent > r) && (w && (s = e.line, a = e.lineStart, l = e.position), _e(e, r, qe, !0, i) && (w ? m = e.result : g = e.result), w || (fe(e, p, h, f, m, g, s, a, l), f = m = g = null), A(e, !0, -1), y = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > r) && y !== 0)
      b(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < r)
      break;
  }
  return w && fe(e, p, h, f, m, null, s, a, l), C && (e.tag = c, e.anchor = d, e.kind = "mapping", e.result = p), C;
}
function vn(e) {
  var r, t = !1, n = !1, i, o, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && b(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (t = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (n = !0, i = "!!", s = e.input.charCodeAt(++e.position)) : i = "!", r = e.position, t) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (o = e.input.slice(r, e.position), s = e.input.charCodeAt(++e.position)) : b(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !P(s); )
      s === 33 && (n ? b(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(r - 1, e.position + 1), jt.test(i) || b(e, "named tag handle cannot contain such characters"), n = !0, r = e.position + 1)), s = e.input.charCodeAt(++e.position);
    o = e.input.slice(r, e.position), sn.test(o) && b(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !qt.test(o) && b(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    b(e, "tag name is malformed: " + o);
  }
  return t ? e.tag = o : J.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : b(e, 'undeclared tag handle "' + i + '"'), !0;
}
function wn(e) {
  var r, t;
  if (t = e.input.charCodeAt(e.position), t !== 38) return !1;
  for (e.anchor !== null && b(e, "duplication of an anchor property"), t = e.input.charCodeAt(++e.position), r = e.position; t !== 0 && !P(t) && !he(t); )
    t = e.input.charCodeAt(++e.position);
  return e.position === r && b(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(r, e.position), !0;
}
function xn(e) {
  var r, t, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), r = e.position; n !== 0 && !P(n) && !he(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === r && b(e, "name of an alias node must contain at least one character"), t = e.input.slice(r, e.position), J.call(e.anchorMap, t) || b(e, 'unidentified alias "' + t + '"'), e.result = e.anchorMap[t], A(e, !0, -1), !0;
}
function _e(e, r, t, n, i) {
  var o, s, a, l = 1, c = !1, d = !1, p, h, f, m, g, w;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = s = a = qe === t || Bt === t, n && A(e, !0, -1) && (c = !0, e.lineIndent > r ? l = 1 : e.lineIndent === r ? l = 0 : e.lineIndent < r && (l = -1)), l === 1)
    for (; vn(e) || wn(e); )
      A(e, !0, -1) ? (c = !0, a = o, e.lineIndent > r ? l = 1 : e.lineIndent === r ? l = 0 : e.lineIndent < r && (l = -1)) : a = !1;
  if (a && (a = c || i), (l === 1 || qe === t) && (je === t || Vt === t ? g = r : g = r + 1, w = e.position - e.lineStart, l === 1 ? a && (yt(e, w) || gn(e, w, g)) || mn(e, g) ? d = !0 : (s && bn(e, g) || hn(e, g) || fn(e, g) ? d = !0 : xn(e) ? (d = !0, (e.tag !== null || e.anchor !== null) && b(e, "alias node should not have any properties")) : dn(e, g, je === t) && (d = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (d = a && yt(e, w))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && b(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), p = 0, h = e.implicitTypes.length; p < h; p += 1)
      if (m = e.implicitTypes[p], m.resolve(e.result)) {
        e.result = m.construct(e.result), e.tag = m.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (J.call(e.typeMap[e.kind || "fallback"], e.tag))
      m = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (m = null, f = e.typeMap.multi[e.kind || "fallback"], p = 0, h = f.length; p < h; p += 1)
        if (e.tag.slice(0, f[p].tag.length) === f[p].tag) {
          m = f[p];
          break;
        }
    m || b(e, "unknown tag !<" + e.tag + ">"), e.result !== null && m.kind !== e.kind && b(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + m.kind + '", not "' + e.kind + '"'), m.resolve(e.result, e.tag) ? (e.result = m.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : b(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || d;
}
function yn(e) {
  var r = e.position, t, n, i, o = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (A(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (o = !0, s = e.input.charCodeAt(++e.position), t = e.position; s !== 0 && !P(s); )
      s = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(t, e.position), i = [], n.length < 1 && b(e, "directive name must not be less than one character in length"); s !== 0; ) {
      for (; ce(s); )
        s = e.input.charCodeAt(++e.position);
      if (s === 35) {
        do
          s = e.input.charCodeAt(++e.position);
        while (s !== 0 && !V(s));
        break;
      }
      if (V(s)) break;
      for (t = e.position; s !== 0 && !P(s); )
        s = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(t, e.position));
    }
    s !== 0 && ct(e), J.call(wt, n) ? wt[n](e, n, i) : ze(e, 'unknown document directive "' + n + '"');
  }
  if (A(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, A(e, !0, -1)) : o && b(e, "directives end mark is expected"), _e(e, e.lineIndent - 1, qe, !1, !0), A(e, !0, -1), e.checkLineBreaks && on.test(e.input.slice(r, e.position)) && ze(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Qe(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, A(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    b(e, "end of the stream or a document separator is expected");
  else
    return;
}
function Cn(e, r) {
  e = String(e), r = r || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var t = new pn(e, r), n = e.indexOf("\0");
  for (n !== -1 && (t.position = n, b(t, "null byte is not allowed in input")), t.input += "\0"; t.input.charCodeAt(t.position) === 32; )
    t.lineIndent += 1, t.position += 1;
  for (; t.position < t.length - 1; )
    yn(t);
  return t.documents;
}
function _n(e, r) {
  var t = Cn(e, r);
  if (t.length !== 0) {
    if (t.length === 1)
      return t[0];
    throw new I("expected a single document in the stream, but found more");
  }
}
var Sn = _n, kn = {
  load: Sn
}, Gt = Object.prototype.toString, Kt = Object.prototype.hasOwnProperty, pt = 65279, An = 9, Le = 10, En = 13, Ln = 32, On = 33, Rn = 34, nt = 35, Tn = 37, Nn = 38, In = 39, Pn = 42, Jt = 44, Fn = 45, Ye = 58, Un = 61, Mn = 62, $n = 63, Dn = 64, Qt = 91, Xt = 93, Hn = 96, Zt = 123, Vn = 124, er = 125, T = {};
T[0] = "\\0";
T[7] = "\\a";
T[8] = "\\b";
T[9] = "\\t";
T[10] = "\\n";
T[11] = "\\v";
T[12] = "\\f";
T[13] = "\\r";
T[27] = "\\e";
T[34] = '\\"';
T[92] = "\\\\";
T[133] = "\\N";
T[160] = "\\_";
T[8232] = "\\L";
T[8233] = "\\P";
var Bn = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], jn = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function qn(e, r) {
  var t, n, i, o, s, a, l;
  if (r === null) return {};
  for (t = {}, n = Object.keys(r), i = 0, o = n.length; i < o; i += 1)
    s = n[i], a = String(r[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), l = e.compiledTypeMap.fallback[s], l && Kt.call(l.styleAliases, a) && (a = l.styleAliases[a]), t[s] = a;
  return t;
}
function zn(e) {
  var r, t, n;
  if (r = e.toString(16).toUpperCase(), e <= 255)
    t = "x", n = 2;
  else if (e <= 65535)
    t = "u", n = 4;
  else if (e <= 4294967295)
    t = "U", n = 8;
  else
    throw new I("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + t + E.repeat("0", n - r.length) + r;
}
var Yn = 1, Oe = 2;
function Wn(e) {
  this.schema = e.schema || Ht, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = E.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = qn(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Oe : Yn, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Ct(e, r) {
  for (var t = E.repeat(" ", r), n = 0, i = -1, o = "", s, a = e.length; n < a; )
    i = e.indexOf(`
`, n), i === -1 ? (s = e.slice(n), n = a) : (s = e.slice(n, i + 1), n = i + 1), s.length && s !== `
` && (o += t), o += s;
  return o;
}
function ot(e, r) {
  return `
` + E.repeat(" ", e.indent * r);
}
function Gn(e, r) {
  var t, n, i;
  for (t = 0, n = e.implicitTypes.length; t < n; t += 1)
    if (i = e.implicitTypes[t], i.resolve(r))
      return !0;
  return !1;
}
function We(e) {
  return e === Ln || e === An;
}
function Re(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== pt || 65536 <= e && e <= 1114111;
}
function _t(e) {
  return Re(e) && e !== pt && e !== En && e !== Le;
}
function St(e, r, t) {
  var n = _t(e), i = n && !We(e);
  return (
    // ns-plain-safe
    (t ? (
      // c = flow-in
      n
    ) : n && e !== Jt && e !== Qt && e !== Xt && e !== Zt && e !== er) && e !== nt && !(r === Ye && !i) || _t(r) && !We(r) && e === nt || r === Ye && i
  );
}
function Kn(e) {
  return Re(e) && e !== pt && !We(e) && e !== Fn && e !== $n && e !== Ye && e !== Jt && e !== Qt && e !== Xt && e !== Zt && e !== er && e !== nt && e !== Nn && e !== Pn && e !== On && e !== Vn && e !== Un && e !== Mn && e !== In && e !== Rn && e !== Tn && e !== Dn && e !== Hn;
}
function Jn(e) {
  return !We(e) && e !== Ye;
}
function ke(e, r) {
  var t = e.charCodeAt(r), n;
  return t >= 55296 && t <= 56319 && r + 1 < e.length && (n = e.charCodeAt(r + 1), n >= 56320 && n <= 57343) ? (t - 55296) * 1024 + n - 56320 + 65536 : t;
}
function tr(e) {
  var r = /^\n* /;
  return r.test(e);
}
var rr = 1, st = 2, ir = 3, nr = 4, de = 5;
function Qn(e, r, t, n, i, o, s, a) {
  var l, c = 0, d = null, p = !1, h = !1, f = n !== -1, m = -1, g = Kn(ke(e, 0)) && Jn(ke(e, e.length - 1));
  if (r || s)
    for (l = 0; l < e.length; c >= 65536 ? l += 2 : l++) {
      if (c = ke(e, l), !Re(c))
        return de;
      g = g && St(c, d, a), d = c;
    }
  else {
    for (l = 0; l < e.length; c >= 65536 ? l += 2 : l++) {
      if (c = ke(e, l), c === Le)
        p = !0, f && (h = h || // Foldable line = too long, and not more-indented.
        l - m - 1 > n && e[m + 1] !== " ", m = l);
      else if (!Re(c))
        return de;
      g = g && St(c, d, a), d = c;
    }
    h = h || f && l - m - 1 > n && e[m + 1] !== " ";
  }
  return !p && !h ? g && !s && !i(e) ? rr : o === Oe ? de : st : t > 9 && tr(e) ? de : s ? o === Oe ? de : st : h ? nr : ir;
}
function Xn(e, r, t, n, i) {
  e.dump = (function() {
    if (r.length === 0)
      return e.quotingType === Oe ? '""' : "''";
    if (!e.noCompatMode && (Bn.indexOf(r) !== -1 || jn.test(r)))
      return e.quotingType === Oe ? '"' + r + '"' : "'" + r + "'";
    var o = e.indent * Math.max(1, t), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), a = n || e.flowLevel > -1 && t >= e.flowLevel;
    function l(c) {
      return Gn(e, c);
    }
    switch (Qn(
      r,
      a,
      e.indent,
      s,
      l,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case rr:
        return r;
      case st:
        return "'" + r.replace(/'/g, "''") + "'";
      case ir:
        return "|" + kt(r, e.indent) + At(Ct(r, o));
      case nr:
        return ">" + kt(r, e.indent) + At(Ct(Zn(r, s), o));
      case de:
        return '"' + eo(r) + '"';
      default:
        throw new I("impossible error: invalid scalar style");
    }
  })();
}
function kt(e, r) {
  var t = tr(e) ? String(r) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : n ? "" : "-";
  return t + o + `
`;
}
function At(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function Zn(e, r) {
  for (var t = /(\n+)([^\n]*)/g, n = (function() {
    var c = e.indexOf(`
`);
    return c = c !== -1 ? c : e.length, t.lastIndex = c, Et(e.slice(0, c), r);
  })(), i = e[0] === `
` || e[0] === " ", o, s; s = t.exec(e); ) {
    var a = s[1], l = s[2];
    o = l[0] === " ", n += a + (!i && !o && l !== "" ? `
` : "") + Et(l, r), i = o;
  }
  return n;
}
function Et(e, r) {
  if (e === "" || e[0] === " ") return e;
  for (var t = / [^ ]/g, n, i = 0, o, s = 0, a = 0, l = ""; n = t.exec(e); )
    a = n.index, a - i > r && (o = s > i ? s : a, l += `
` + e.slice(i, o), i = o + 1), s = a;
  return l += `
`, e.length - i > r && s > i ? l += e.slice(i, s) + `
` + e.slice(s + 1) : l += e.slice(i), l.slice(1);
}
function eo(e) {
  for (var r = "", t = 0, n, i = 0; i < e.length; t >= 65536 ? i += 2 : i++)
    t = ke(e, i), n = T[t], !n && Re(t) ? (r += e[i], t >= 65536 && (r += e[i + 1])) : r += n || zn(t);
  return r;
}
function to(e, r, t) {
  var n = "", i = e.tag, o, s, a;
  for (o = 0, s = t.length; o < s; o += 1)
    a = t[o], e.replacer && (a = e.replacer.call(t, String(o), a)), (q(e, r, a, !1, !1) || typeof a > "u" && q(e, r, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function Lt(e, r, t, n) {
  var i = "", o = e.tag, s, a, l;
  for (s = 0, a = t.length; s < a; s += 1)
    l = t[s], e.replacer && (l = e.replacer.call(t, String(s), l)), (q(e, r + 1, l, !0, !0, !1, !0) || typeof l > "u" && q(e, r + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += ot(e, r)), e.dump && Le === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function ro(e, r, t) {
  var n = "", i = e.tag, o = Object.keys(t), s, a, l, c, d;
  for (s = 0, a = o.length; s < a; s += 1)
    d = "", n !== "" && (d += ", "), e.condenseFlow && (d += '"'), l = o[s], c = t[l], e.replacer && (c = e.replacer.call(t, l, c)), q(e, r, l, !1, !1) && (e.dump.length > 1024 && (d += "? "), d += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), q(e, r, c, !1, !1) && (d += e.dump, n += d));
  e.tag = i, e.dump = "{" + n + "}";
}
function io(e, r, t, n) {
  var i = "", o = e.tag, s = Object.keys(t), a, l, c, d, p, h;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new I("sortKeys must be a boolean or a function");
  for (a = 0, l = s.length; a < l; a += 1)
    h = "", (!n || i !== "") && (h += ot(e, r)), c = s[a], d = t[c], e.replacer && (d = e.replacer.call(t, c, d)), q(e, r + 1, c, !0, !0, !0) && (p = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, p && (e.dump && Le === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, p && (h += ot(e, r)), q(e, r + 1, d, !0, p) && (e.dump && Le === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = o, e.dump = i || "{}";
}
function Ot(e, r, t) {
  var n, i, o, s, a, l;
  for (i = t ? e.explicitTypes : e.implicitTypes, o = 0, s = i.length; o < s; o += 1)
    if (a = i[o], (a.instanceOf || a.predicate) && (!a.instanceOf || typeof r == "object" && r instanceof a.instanceOf) && (!a.predicate || a.predicate(r))) {
      if (t ? a.multi && a.representName ? e.tag = a.representName(r) : e.tag = a.tag : e.tag = "?", a.represent) {
        if (l = e.styleMap[a.tag] || a.defaultStyle, Gt.call(a.represent) === "[object Function]")
          n = a.represent(r, l);
        else if (Kt.call(a.represent, l))
          n = a.represent[l](r, l);
        else
          throw new I("!<" + a.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function q(e, r, t, n, i, o, s) {
  e.tag = null, e.dump = t, Ot(e, t, !1) || Ot(e, t, !0);
  var a = Gt.call(e.dump), l = n, c;
  n && (n = e.flowLevel < 0 || e.flowLevel > r);
  var d = a === "[object Object]" || a === "[object Array]", p, h;
  if (d && (p = e.duplicates.indexOf(t), h = p !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && r > 0) && (i = !1), h && e.usedDuplicates[p])
    e.dump = "*ref_" + p;
  else {
    if (d && h && !e.usedDuplicates[p] && (e.usedDuplicates[p] = !0), a === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (io(e, r, e.dump, i), h && (e.dump = "&ref_" + p + e.dump)) : (ro(e, r, e.dump), h && (e.dump = "&ref_" + p + " " + e.dump));
    else if (a === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !s && r > 0 ? Lt(e, r - 1, e.dump, i) : Lt(e, r, e.dump, i), h && (e.dump = "&ref_" + p + e.dump)) : (to(e, r, e.dump), h && (e.dump = "&ref_" + p + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && Xn(e, e.dump, r, o, l);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new I("unacceptable kind of an object to dump " + a);
    }
    e.tag !== null && e.tag !== "?" && (c = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? c = "!" + c : c.slice(0, 18) === "tag:yaml.org,2002:" ? c = "!!" + c.slice(18) : c = "!<" + c + ">", e.dump = c + " " + e.dump);
  }
  return !0;
}
function no(e, r) {
  var t = [], n = [], i, o;
  for (at(e, t, n), i = 0, o = n.length; i < o; i += 1)
    r.duplicates.push(t[n[i]]);
  r.usedDuplicates = new Array(o);
}
function at(e, r, t) {
  var n, i, o;
  if (e !== null && typeof e == "object")
    if (i = r.indexOf(e), i !== -1)
      t.indexOf(i) === -1 && t.push(i);
    else if (r.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        at(e[i], r, t);
    else
      for (n = Object.keys(e), i = 0, o = n.length; i < o; i += 1)
        at(e[n[i]], r, t);
}
function oo(e, r) {
  r = r || {};
  var t = new Wn(r);
  t.noRefs || no(e, t);
  var n = e;
  return t.replacer && (n = t.replacer.call({ "": n }, "", n)), q(t, 0, n, !0, !0) ? t.dump + `
` : "";
}
var so = oo, ao = {
  dump: so
}, or = kn.load, lo = ao.dump;
const Ae = {
  BACKEND: "https://url.v1.mk",
  CHUNK_COUNT: "20"
};
function co(e, r = 10) {
  const t = [];
  let n = [];
  return e.forEach((i, o) => {
    n.push(i), (o + 1) % r === 0 && (t.push(n.join("|")), n = []);
  }), n.length > 0 && t.push(n.join("|")), t;
}
function uo(e) {
  try {
    return JSON.parse(e), !0;
  } catch {
    return !1;
  }
}
function G(e, r) {
  return Object.prototype.hasOwnProperty.call(e, r);
}
const Rt = {
  retries: 0,
  retryDelay: 1e3,
  maxRetryDelay: 3e4,
  timeout: 1e4,
  retryOn: [408, 429, 500, 502, 503, 504],
  exponentialBackoff: !0,
  jitter: 0.1
};
class Be extends Error {
  constructor(r, t, n, i) {
    super(r), this.message = r, this.status = t, this.response = n, this.attempt = i, this.name = "FetchRetryError";
  }
}
const Tt = 30;
function Nt(e, r) {
  let t = r.retryDelay;
  if (r.exponentialBackoff && (t = t * 2 ** (e - 1)), r.jitter > 0) {
    const n = r.jitter * Math.random();
    t = t * (1 + n);
  }
  return Math.min(t, r.maxRetryDelay);
}
function po(e) {
  return new Promise((r, t) => {
    setTimeout(() => {
      t(new Be(`请求超时 (${e}ms)`));
    }, e);
  });
}
async function dt(e, r = {}) {
  const t = {
    ...Rt,
    ...r,
    // 确保重试次数不超过最大限制
    retries: r.retries === 1 / 0 ? Tt : Math.min(r.retries || Rt.retries || 0, Tt)
  };
  let n = 0;
  const i = async () => {
    n++;
    try {
      let o, s;
      if (e instanceof Request) {
        s = e.url;
        const p = e.clone();
        o = new Request(p, {
          ...p,
          ...r
        });
      } else
        s = e.toString(), o = new Request(s, r);
      const a = fetch(o), l = t.timeout ? po(t.timeout) : null, c = await (l ? Promise.race([a, l]) : a), d = {
        status: c.status,
        statusText: c.statusText,
        headers: Object.fromEntries(c.headers.entries()),
        data: c,
        config: { url: s, ...r },
        ok: c.ok
      };
      if (t.retries > 0 && n <= t.retries && (typeof t.retryOn == "function" ? t.retryOn(c) : t.retryOn.includes(c.status))) {
        const p = Nt(n, t);
        if (t.onRetry && await t.onRetry(n, p), t.onError) {
          const h = new Be(`请求失败，状态码 ${d.status}`, d.status, c, n);
          await t.onError(h, n);
        }
        return await new Promise((h) => setTimeout(h, p)), i();
      }
      return d;
    } catch (o) {
      const s = o instanceof Be ? o : new Be(o.message || "请求失败", void 0, void 0, n);
      if (t.onError && await t.onError(s, n), t.retries > 0 && n <= t.retries) {
        const a = Nt(n, t);
        return t.onRetry && await t.onRetry(n, a), await new Promise((l) => setTimeout(l, a)), i();
      }
      throw s;
    }
  };
  return i();
}
function He(e) {
  if (!e) return e;
  const r = atob(e), t = new Uint8Array(r.length);
  for (let n = 0; n < r.length; n++)
    t[n] = r.charCodeAt(n);
  return new TextDecoder().decode(t);
}
function ho(e, r) {
  const t = ((n) => n);
  try {
    return e ? He(e.toString()) : t(e);
  } catch {
    return t(e);
  }
}
function D(e) {
  if (!e) return e;
  const r = new TextEncoder().encode(e.trim());
  let t = "";
  for (let n = 0; n < r.length; n += 1)
    t += String.fromCharCode(r[n]);
  return btoa(t);
}
function fo(e, r) {
  const t = ((n) => n);
  try {
    return e ? D(e.toString()) : t(e);
  } catch {
    return t(e);
  }
}
class mo {
  constructor(r = []) {
    k(this, "existVps", []);
    k(this, "existVpsMap", /* @__PURE__ */ new Map());
    this.existVps = r, this.updateExist(this.existVps);
  }
  updateExist(r = []) {
    for (const t of r) {
      const n = this.getParser(t);
      n && this.setExistVpsMap(n);
    }
  }
  updateVpsPs(r) {
    const t = this.getParser(r);
    if (!t) return null;
    const n = t.originPs, [i, o] = n.split("#");
    if (!o) return r;
    const s = this.existVpsMap.get(o) || 0, a = s === 0 ? n : `${i}#${o} ${s}`;
    return t.updateOriginConfig(a), this.existVpsMap.set(o, s + 1), t.originLink;
  }
  setExistVpsMap(r) {
    const t = r.originPs, [, n] = t.split("#");
    if (!n) return;
    const [i, o] = n.split(" "), s = o ? Number.parseInt(o) >>> 0 : 0, a = this.existVpsMap.get(i) || 0;
    this.existVpsMap.set(i, Math.max(a, s + 1));
  }
  getParser(r) {
    return r.startsWith("vless://") ? new ur(r) : r.startsWith("vmess://") ? new dr(r) : r.startsWith("trojan://") ? new cr(r) : r.startsWith("ss://") ? new ar(r) : r.startsWith("ssr://") ? new lr(r) : r.startsWith("hysteria2://") || r.startsWith("hysteria://") || r.startsWith("hy2://") ? new sr(r) : null;
  }
}
class bo extends mo {
  constructor(r = []) {
    super(r);
  }
}
var Te, Ne, Ie, Ge;
class Se {
  constructor() {
    x(this, Te, ["localhost", "127.0.0.1", "abc.cba.com"]);
    x(this, Ne, ["AES_256_GCM", "CHACHA20_POLY1305", "AES_128_GCM", "CHACHA20_IETF"]);
    x(this, Ie, 1024);
    x(this, Ge, 65535);
  }
  /**
   * @description 获取随机uuid
   * @returns {crypto.UUID} crypto.UUID
   */
  getUUID() {
    return crypto.randomUUID();
  }
  /**
   * @description 获取随机username
   * @returns {string} username
   */
  getUsername() {
    return this.getUUID();
  }
  /**
   * @description 获取随机password
   * @returns {string} crypto.UUID
   */
  getPassword() {
    return this.getUUID();
  }
  getHost() {
    return `${this.getHostName()}:${this.getPort()}`;
  }
  /**
   * @description 获取随机hostname
   * @returns {string} hostname
   */
  getHostName() {
    return u(this, Te)[Math.floor(Math.random() * u(this, Te).length)];
  }
  /**
   * @description 获取随机端口
   * @returns {string} port
   */
  getPort() {
    return Math.floor(Math.random() * (u(this, Ge) - u(this, Ie) + 1) + u(this, Ie)).toString();
  }
  /**
   * @description 获取随机 SS协议的加密类型
   */
  getEncrtptionProtocol() {
    return u(this, Ne)[Math.floor(Math.random() * u(this, Ne).length)];
  }
}
Te = new WeakMap(), Ne = new WeakMap(), Ie = new WeakMap(), Ge = new WeakMap();
var Q, X;
const F = class F {
  /**
   * @description 获取备注
   * @param {string} name
   * @returns {[string, string]} [origin, confuse]
   */
  static getPs(r) {
    const t = r.split(u(F, Q));
    return [t[0], t[1]];
  }
  /**
   * @description 设置备注
   * @param {string} name 原始备注
   * @param {string} ps 混淆备注
   * @returns {string} origin^LINK_TO^confuse
   */
  static setPs(r, t) {
    return [this.formatPs(r), t].join(u(F, Q));
  }
  static formatPs(r) {
    return r ? r.replace(/\|/g, "-") : crypto.randomUUID();
  }
  /**
   * @description 获取前缀（带缓存）
   * @param {string} name
   * @returns {string|null} prefix
   */
  static getPrefix(r) {
    if (!(r != null && r.includes(u(F, Q)))) return null;
    if (u(F, X).has(r))
      return u(F, X).get(r);
    const [t] = F.getPs(r);
    if (t) {
      const n = t.trim();
      return u(F, X).set(r, n), n;
    }
    return null;
  }
  static isConfigType(r) {
    return r.includes(u(this, Q));
  }
  // 清除缓存
  static clearCache() {
    u(this, X).clear();
  }
};
Q = new WeakMap(), X = new WeakMap(), x(F, Q, "^LINK_TO^"), x(F, X, /* @__PURE__ */ new Map());
let S = F;
var Z, Pe, z, U, ee, me;
class sr extends Se {
  constructor(t) {
    super();
    /** * @description 原始链接 */
    x(this, Z, "");
    /** * @description 混淆链接 */
    x(this, Pe, "");
    /** * @description vps原始配置 */
    x(this, z, {});
    /** * @description 混淆配置 */
    x(this, U, {});
    /** * @description 原始备注 */
    x(this, ee, "");
    /** * @description 混淆备注 */
    x(this, me, "");
    v(this, me, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig(t);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    v(this, Z, t), v(this, z, new URL(t)), v(this, ee, u(this, z).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    u(this, z).hash = t, v(this, ee, t), v(this, Z, u(this, z).href), this.setConfuseConfig(u(this, Z));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(t) {
    v(this, U, new URL(t)), u(this, U).username = this.getUsername(), u(this, U).host = this.getHost(), u(this, U).hostname = this.getHostName(), u(this, U).port = this.getPort(), u(this, U).hash = S.setPs(u(this, ee), u(this, me)), v(this, Pe, u(this, U).href);
  }
  restoreClash(t, n) {
    var i, o, s, a, l, c, d, p, h;
    return t.name = n, t.server = this.originConfig.hostname ?? "", t.port = Number(this.originConfig.port ?? 0), t.type === "hysteria2" && G(t, "password") && (t.password = ((o = (i = this.originConfig) == null ? void 0 : i.searchParams) == null ? void 0 : o.get("password")) ?? ""), G(t, "down") && (t.down = t.down !== "" ? t.down : ((s = this.originConfig.searchParams) == null ? void 0 : s.get("down")) ?? ((a = this.originConfig.searchParams) == null ? void 0 : a.get("downmbps")) ?? 0, t.down = decodeURIComponent(t.down)), G(t, "up") && (t.up = t.up !== "" ? t.up : ((l = this.originConfig.searchParams) == null ? void 0 : l.get("up")) ?? ((c = this.originConfig.searchParams) == null ? void 0 : c.get("upmbps")) ?? 0, t.up = decodeURIComponent(t.up)), G(t, "delay") && (t.delay = ((d = this.originConfig.searchParams) == null ? void 0 : d.get("delay")) ?? 0), (p = this.originConfig.searchParams) != null && p.has("sni") && (t.sni = ((h = this.originConfig.searchParams) == null ? void 0 : h.get("sni")) ?? ""), t;
  }
  restoreSingbox(t, n) {
    var i, o;
    return t.password = ((o = (i = this.originConfig) == null ? void 0 : i.searchParams) == null ? void 0 : o.get("password")) ?? "", t.server = this.originConfig.hostname ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.tag = n, t.down && (t.down = decodeURIComponent(t.down)), t.up && (t.up = decodeURIComponent(t.up)), t;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return u(this, ee);
  }
  /**
   * @description 原始链接
   * @example 'trojan://...'
   */
  get originLink() {
    return u(this, Z);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return u(this, z);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return encodeURIComponent(u(this, me));
  }
  /**
   * @description 混淆链接
   * @example 'trojan://...'
   */
  get confuseLink() {
    return u(this, Pe);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return u(this, U);
  }
}
Z = new WeakMap(), Pe = new WeakMap(), z = new WeakMap(), U = new WeakMap(), ee = new WeakMap(), me = new WeakMap();
var te, Fe, B, N, re, be;
class ar extends Se {
  constructor(t) {
    super();
    /** * @description 原始链接 */
    x(this, te, "");
    /** * @description 混淆链接 */
    x(this, Fe, "");
    /** * @description vps原始配置 */
    x(this, B, {});
    /** * @description 混淆配置 */
    x(this, N, {});
    /** * @description 原始备注 */
    x(this, re, "");
    /** * @description 混淆备注 */
    x(this, be, "");
    v(this, be, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig(t);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    const n = this.toStandard(t);
    v(this, te, n), v(this, B, new URL(n)), v(this, re, u(this, B).hash ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    u(this, B).hash = t, v(this, re, t), v(this, te, u(this, B).href), this.setConfuseConfig(u(this, te));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(t) {
    v(this, N, new URL(this.toStandard(t))), u(this, N).username = this.getUsername(), u(this, N).host = this.getHost(), u(this, N).hostname = this.getHostName(), u(this, N).port = this.getPort(), u(this, N).hash = S.setPs(u(this, re), u(this, be)), v(this, Fe, `ss://${decodeURIComponent(u(this, B).username)}@${u(this, N).hostname}:${u(this, N).port}${u(this, N).search}#${u(this, N).hash}`);
  }
  restoreClash(t, n) {
    var i;
    return t.name = n, t.server = this.originConfig.hostname ?? "", t.port = Number(((i = this.originConfig) == null ? void 0 : i.port) ?? 0), t;
  }
  restoreSingbox(t, n) {
    return t.server = this.originConfig.hostname ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.tag = n, t;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return u(this, re);
  }
  /**
   * @description 原始链接
   * @example 'ss://...'
   */
  get originLink() {
    return u(this, te);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return u(this, B);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return u(this, be);
  }
  /**
   * @description 混淆链接
   * @example 'ss://...'
   */
  get confuseLink() {
    return u(this, Fe);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return u(this, N);
  }
  /**
   * @description 将传统格式 (SIP002) 的链接转换为标准新版 URI 格式的链接
   * @param {string} sipUrl SIP002 格式链接
   * @returns {string} 标准新版 URI 格式链接
   */
  toStandard(t) {
    const n = t.match(/#(.*)$/), i = n ? `#${n[1]}` : "", o = t.replace(/#.*$/, "");
    if (!o.startsWith("ss://"))
      return t;
    const s = o.substring(5);
    if (s.includes("@"))
      return t;
    try {
      const a = He(s), l = a.lastIndexOf("@");
      if (l === -1)
        throw new Error("Invalid SIP002 format: missing @ separator");
      const c = a.substring(0, l), d = a.substring(l + 1), p = c.indexOf(":");
      if (p === -1)
        throw new Error("Invalid user info: missing colon separator");
      const h = c.substring(0, p), f = c.substring(p + 1), m = d.lastIndexOf(":");
      if (m === -1)
        throw new Error("Invalid server info: missing port");
      const g = d.substring(0, m), w = d.substring(m + 1);
      if (!h || !f || !g || !w)
        throw new Error("Invalid format: missing required fields");
      const C = `${h}:${f}`;
      let ue = `ss://${D(C)}@${g}:${w}`;
      return ue += "?type=tcp", i && (ue += i), ue;
    } catch {
      return t;
    }
  }
}
te = new WeakMap(), Fe = new WeakMap(), B = new WeakMap(), N = new WeakMap(), re = new WeakMap(), be = new WeakMap();
var ge, Ue, L, O, ie, ve;
class lr extends Se {
  constructor(t) {
    super();
    /** * @description 原始链接 */
    x(this, ge, "");
    /** * @description 混淆链接 */
    x(this, Ue, "");
    /** * @description vps原始配置 */
    x(this, L, {});
    /** * @description 混淆配置 */
    x(this, O, {});
    /** * @description 原始备注 */
    x(this, ie, "");
    /** * @description 混淆备注 */
    x(this, ve, "");
    v(this, ve, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig();
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    const [n, i] = t.match(/ssr:\/\/(.*)/) || [];
    v(this, ge, t), v(this, L, this.getOriginConfig(He(i))), v(this, ie, u(this, L).remarks ?? "");
  }
  // oxo.08050611.xyz:10000:origin:aes-256-cfb:plain:NlJWUHp2bVQ1MCthdTNXajBCL2hiTTJ6VVZ5bWxVQTJkbkx3aXZDMFR5TT0/?remarks=5rWL6K-Vc3Ny&protoparam=&obfsparam=
  getOriginConfig(t) {
    var d;
    const [n, i, o, s, a, l] = t.split(":"), c = new URL(t);
    return {
      server: n,
      port: i,
      protocol: o,
      method: s,
      obfs: a,
      password_base64: l.replace(c.search, ""),
      remarks: ho(((d = c.searchParams.get("remarks")) == null ? void 0 : d.replace("-", "+")) || ""),
      params: c.search.replace(`?remarks=${c.searchParams.get("remarks")}`, "")
    };
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    u(this, L).remarks = t, v(this, ie, t), v(this, ge, `ssr://${D(`${u(this, L).server}:${u(this, L).port}:${u(this, L).protocol}:${u(this, L).method}:${u(this, L).obfs}:${u(this, L).password_base64}?remarks=${u(this, L).remarks}${u(this, L).params}`)}`), this.setConfuseConfig();
  }
  /**
   * @description 设置混淆配置
   */
  setConfuseConfig() {
    v(this, O, structuredClone(u(this, L))), u(this, O).server = this.getHostName(), u(this, O).port = this.getPort(), u(this, O).remarks = D(S.setPs(u(this, ie), u(this, ve))), v(this, Ue, `ssr://${D(`${u(this, O).server}:${u(this, O).port}:${u(this, O).protocol}:${u(this, O).method}:${u(this, O).obfs}:${u(this, O).password_base64}?remarks=${u(this, O).remarks}${u(this, O).params}`)}`);
  }
  restoreClash(t, n) {
    var i;
    return t.name = n, t.server = this.originConfig.server ?? "", t.port = Number(((i = this.originConfig) == null ? void 0 : i.port) ?? 0), t;
  }
  restoreSingbox(t, n) {
    var i;
    return t.server = this.originConfig.server ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.tag = n, (i = t.tls) != null && i.server_name && (t.tls.server_name = this.originConfig.add ?? ""), t;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return u(this, ie);
  }
  /**
   * @description 原始链接
   * @example 'vmess://...'
   */
  get originLink() {
    return u(this, ge);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return u(this, L);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return u(this, ve);
  }
  /**
   * @description 混淆链接
   * @example 'vmess://...'
   */
  get confuseLink() {
    return u(this, Ue);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return u(this, O);
  }
}
ge = new WeakMap(), Ue = new WeakMap(), L = new WeakMap(), O = new WeakMap(), ie = new WeakMap(), ve = new WeakMap();
var ne, Me, Y, M, oe, we;
class cr extends Se {
  constructor(t) {
    super();
    /** * @description 原始链接 */
    x(this, ne, "");
    /** * @description 混淆链接 */
    x(this, Me, "");
    /** * @description vps原始配置 */
    x(this, Y, {});
    /** * @description 混淆配置 */
    x(this, M, {});
    /** * @description 原始备注 */
    x(this, oe, "");
    /** * @description 混淆备注 */
    x(this, we, "");
    v(this, we, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig(t);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    v(this, ne, t), v(this, Y, new URL(t)), v(this, oe, S.formatPs(u(this, Y).hash) ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    u(this, Y).hash = S.formatPs(t), v(this, oe, S.formatPs(t)), v(this, ne, u(this, Y).href), this.setConfuseConfig(u(this, ne));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(t) {
    v(this, M, new URL(t)), u(this, M).username = this.getUsername(), u(this, M).host = this.getHost(), u(this, M).hostname = this.getHostName(), u(this, M).port = this.getPort(), u(this, M).hash = S.setPs(u(this, oe), u(this, we)), v(this, Me, u(this, M).href);
  }
  restoreClash(t, n) {
    var i;
    return t.name = n, t.server = this.originConfig.hostname ?? "", t.port = Number(this.originConfig.port ?? 0), t.password = ((i = this.originConfig) == null ? void 0 : i.username) ?? "", t.alpn = t.alpn ? t.alpn.map((o) => decodeURIComponent(o)) : t.alpn, t;
  }
  restoreSingbox(t, n) {
    var i, o, s;
    return t.password = ((i = this.originConfig) == null ? void 0 : i.username) ?? "", t.server = this.originConfig.hostname ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.tag = n, (o = t.tls) != null && o.server_name && (t.tls.server_name = this.originConfig.hostname ?? ""), (s = t.tls) != null && s.alpn && (t.tls.alpn = t.tls.alpn.map((a) => decodeURIComponent(a))), t;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return u(this, oe);
  }
  /**
   * @description 原始链接
   * @example 'trojan://...'
   */
  get originLink() {
    return u(this, ne);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return u(this, Y);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return encodeURIComponent(u(this, we));
  }
  /**
   * @description 混淆链接
   * @example 'trojan://...'
   */
  get confuseLink() {
    return u(this, Me);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return u(this, M);
  }
}
ne = new WeakMap(), Me = new WeakMap(), Y = new WeakMap(), M = new WeakMap(), oe = new WeakMap(), we = new WeakMap();
var se, $e, W, $, ae, xe, Ke, pr;
class ur extends Se {
  constructor(t) {
    super();
    x(this, Ke);
    /** * @description 原始链接 */
    x(this, se, "");
    /** * @description 混淆链接 */
    x(this, $e, "");
    /** * @description vps原始配置 */
    x(this, W, {});
    /** * @description 混淆配置 */
    x(this, $, {});
    /** * @description 原始备注 */
    x(this, ae, "");
    /** * @description 混淆备注 */
    x(this, xe, "");
    v(this, xe, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig(t);
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    v(this, se, t), v(this, W, new URL(t)), v(this, ae, S.formatPs(u(this, W).hash) ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    u(this, W).hash = S.formatPs(t), v(this, ae, S.formatPs(t)), v(this, se, u(this, W).href), this.setConfuseConfig(u(this, se));
  }
  /**
   * @description 设置混淆配置
   * @param {string} v
   */
  setConfuseConfig(t) {
    v(this, $, new URL(t)), u(this, $).username = this.getUsername(), u(this, $).host = this.getHost(), u(this, $).hostname = this.getHostName(), u(this, $).port = this.getPort(), u(this, $).hash = S.setPs(u(this, ae), u(this, xe)), v(this, $e, u(this, $).href);
  }
  restoreClash(t, n) {
    var i, o;
    return Ze(this, Ke, pr).call(this, t), t.name = n, t.server = this.originConfig.hostname ?? "", t.port = Number(((i = this.originConfig) == null ? void 0 : i.port) ?? 0), t.uuid = this.originConfig.username ?? "", t.alpn = t.alpn ? (o = t.alpn) == null ? void 0 : o.map((s) => decodeURIComponent(s)) : t.alpn, t;
  }
  restoreSingbox(t, n) {
    var i, o;
    return t.tag = n, t.server = this.originConfig.hostname ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.uuid = this.originConfig.username ?? "", (i = t.tls) != null && i.server_name && (t.tls.server_name = this.originConfig.hostname ?? ""), (o = t.tls) != null && o.alpn && (t.tls.alpn = t.tls.alpn.map((s) => decodeURIComponent(s))), t;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return u(this, ae);
  }
  /**
   * @description 原始链接
   * @example 'vless://...'
   */
  get originLink() {
    return u(this, se);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return u(this, W);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return u(this, xe);
  }
  /**
   * @description 混淆链接
   * @example 'vless://...'
   */
  get confuseLink() {
    return u(this, $e);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return u(this, $);
  }
}
se = new WeakMap(), $e = new WeakMap(), W = new WeakMap(), $ = new WeakMap(), ae = new WeakMap(), xe = new WeakMap(), Ke = new WeakSet(), pr = function(t) {
  var n;
  t.network === "ws" && (t["ws-opts"] = {
    ...t["ws-opts"],
    path: decodeURIComponent(((n = this.originConfig.searchParams) == null ? void 0 : n.get("path")) ?? "/"),
    headers: {
      ...t["ws-opts"].headers,
      Host: this.originConfig.host
    }
  });
};
var ye, De, j, H, le, Ce, Je, hr;
class dr extends Se {
  constructor(t) {
    super();
    x(this, Je);
    /** * @description 原始链接 */
    x(this, ye, "");
    /** * @description 混淆链接 */
    x(this, De, "");
    /** * @description vps原始配置 */
    x(this, j, {});
    /** * @description 混淆配置 */
    x(this, H, {});
    /** * @description 原始备注 */
    x(this, le, "");
    /** * @description 混淆备注 */
    x(this, Ce, "");
    v(this, Ce, crypto.randomUUID()), this.setOriginConfig(t), this.setConfuseConfig();
  }
  /**
   * @description 设置原始配置
   * @param {string} v
   */
  setOriginConfig(t) {
    const [n, i] = t.match(/vmess:\/\/(.*)/) || [];
    v(this, ye, t), v(this, j, JSON.parse(He(i))), v(this, le, u(this, j).ps ?? "");
  }
  /**
   * @description 更新原始配置
   * @param {string} ps
   */
  updateOriginConfig(t) {
    u(this, j).ps = t, v(this, le, t), v(this, ye, `vmess://${D(JSON.stringify(u(this, j)))}`), this.setConfuseConfig();
  }
  /**
   * @description 设置混淆配置
   */
  setConfuseConfig() {
    v(this, H, structuredClone(u(this, j))), u(this, H).add = this.getHostName(), u(this, H).port = this.getPort(), u(this, H).id = this.getPassword(), u(this, H).ps = S.setPs(u(this, le), u(this, Ce)), v(this, De, `vmess://${D(JSON.stringify(u(this, H)))}`);
  }
  restoreClash(t, n) {
    var i, o;
    return Ze(this, Je, hr).call(this, t), t.name = n, t.server = this.originConfig.add ?? "", t.port = Number(((i = this.originConfig) == null ? void 0 : i.port) ?? 0), t.uuid = ((o = this.originConfig) == null ? void 0 : o.id) ?? "", t;
  }
  restoreSingbox(t, n) {
    var i, o;
    return t.server = this.originConfig.add ?? "", t.server_port = Number(this.originConfig.port ?? 0), t.tag = n, (i = t.tls) != null && i.server_name && (t.tls.server_name = this.originConfig.add ?? ""), t.uuid = ((o = this.originConfig) == null ? void 0 : o.id) ?? "", t;
  }
  /**
   * @description 原始备注
   * @example '#originPs'
   */
  get originPs() {
    return u(this, le);
  }
  /**
   * @description 原始链接
   * @example 'vmess://...'
   */
  get originLink() {
    return u(this, ye);
  }
  /**
   * @description 原始配置
   */
  get originConfig() {
    return u(this, j);
  }
  /**
   * @description 混淆备注
   * @example 'confusePs'
   */
  get confusePs() {
    return u(this, Ce);
  }
  /**
   * @description 混淆链接
   * @example 'vmess://...'
   */
  get confuseLink() {
    return u(this, De);
  }
  /**
   * @description 混淆配置
   */
  get confuseConfig() {
    return u(this, H);
  }
}
ye = new WeakMap(), De = new WeakMap(), j = new WeakMap(), H = new WeakMap(), le = new WeakMap(), Ce = new WeakMap(), Je = new WeakSet(), hr = function(t) {
  t.network === "ws" && (t["ws-opts"] = {
    ...t["ws-opts"],
    path: this.originConfig.path,
    headers: {
      ...t["ws-opts"].headers,
      Host: this.originConfig.host
    }
  });
};
function go(e) {
  const r = e.password || e.auth || e.auth_str;
  if (!e || !e.server || !e.port || !r)
    throw new Error("Hysteria configuration object must contain server, port, and authentication (password, auth, or auth_str).");
  const t = e.server, n = e.port, i = e.name || "", o = new URLSearchParams();
  o.append("auth", r), e.peerCA && o.append("peerCA", D(e.peerCA).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")), (e.insecure || e["skip-cert-verify"]) && o.append("insecure", "1"), e.alpn && (typeof e.alpn == "string" || Array.isArray(e.alpn)) && o.append("alpn", Array.isArray(e.alpn) ? e.alpn.join(",") : e.alpn), e.upmbps !== void 0 && e.upmbps !== null && o.append("upmbps", e.upmbps.toString()), e.downmbps !== void 0 && e.downmbps !== null && o.append("downmbps", e.downmbps.toString()), e.obfs && o.append("obfs", e.obfs), e["obfs-param"] && o.append("obfs-param", e["obfs-param"]), G(e, "up") && o.append("up", e.up), G(e, "down") && o.append("down", e.down), G(e, "delay") && o.append("delay", e.delay), G(e, "sni") && o.append("sni", e.sni);
  const s = o.toString(), a = encodeURIComponent(t), l = encodeURIComponent(i);
  let c = `hysteria://${a}:${n}`;
  return s && (c += `?${s}`), i && (c += `#${l}`), c;
}
function vo(e) {
  if (!e || !e.server || !e.port || !e.password)
    throw new Error("Hysteria2 configuration object must contain server, port, and password.");
  const r = e.server, t = e.port, n = e.password, i = e.name || "", o = new URLSearchParams();
  o.append("password", n);
  const s = e.sni || e.servername || e.server;
  s && o.append("sni", s), (e.insecure || e["skip-cert-verify"]) && o.append("insecure", "1"), e.alpn && (typeof e.alpn == "string" || Array.isArray(e.alpn)) && o.append("alpn", Array.isArray(e.alpn) ? e.alpn.join(",") : e.alpn), e.obfs && o.append("obfs", e.obfs), e["obfs-param"] && o.append("obfs-param", e["obfs-param"]), e["obfs-password"] && o.append("obfs-password", e["obfs-password"]);
  const a = o.toString(), l = encodeURIComponent(r), c = encodeURIComponent(i);
  let d = `hysteria2://${l}:${t}`;
  return a && (d += `?${a}`), i && (d += `#${c}`), d;
}
function wo(e) {
  if (!e || !e.server || !e.port || !e.cipher || !e.password)
    throw new Error("Shadowsocks configuration object must contain server, port, cipher, and password.");
  const r = e.cipher, t = e.password, n = e.server, i = e.port, o = e.name || "", s = `${r}:${t}`, a = D(s), l = new URLSearchParams(), c = e.network || "tcp";
  if ((c !== "tcp" || e.network) && l.append("type", c), e.tls) {
    l.append("security", "tls");
    const f = e.sni || e.servername || e.server;
    f && l.append("sni", f), e["client-fingerprint"] && l.append("fp", e["client-fingerprint"]), e["skip-cert-verify"] && l.append("allowInsecure", "1");
  }
  switch (c) {
    case "ws":
    // WebSocket
    case "http": {
      const f = e["ws-opts"] || e["http-opts"] || {};
      let m;
      f.headers && f.headers.Host ? m = f.headers.Host : e.sni || e.servername ? m = e.sni || e.servername : m = e.server, m && l.append("host", m);
      const g = f.path || "/";
      g !== "/" && l.append("path", g);
      break;
    }
    case "grpc": {
      const f = e["grpc-opts"] || {};
      f.serviceName && l.append("serviceName", f.serviceName);
      break;
    }
  }
  e.tfo && l.append("tfo", "1"), e.udp && l.append("udp", "1");
  const d = encodeURIComponent(n);
  let p = `ss://${a}@${d}:${i}`;
  const h = l.toString();
  if (h && (p += `?${h}`), o) {
    const f = encodeURIComponent(o);
    p += `#${f}`;
  }
  return p;
}
function Ve(e) {
  return D(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function xo(e) {
  if (!e || !e.server || !e.port || !e.protocol || !e.method || !e.obfs || !e.password)
    throw new Error("ShadowsocksR configuration object must contain server, port, protocol, method, obfs, and password.");
  const r = e.server, t = e.port, n = e.protocol, i = e.method || e.cipher, o = e.obfs, s = e.password, a = e["obfs-param"] || "", l = e["protocol-param"] || "", c = e.name || "", d = Ve(s);
  let p = `${r}:${t}:${n}:${i}:${o}:${d}/`;
  const h = new URLSearchParams();
  if (a) {
    const C = Ve(a);
    h.append("obfsparam", C);
  }
  if (l) {
    const C = Ve(l);
    h.append("protoparam", C);
  }
  const f = h.toString();
  f && (p += `?${f}`);
  const m = Ve(p), g = encodeURIComponent(c);
  let w = `ssr://${m}`;
  return c && (w += `#${g}`), w;
}
function yo(e) {
  if (!e || !e.server || !e.port || !e.password)
    throw new Error("Trojan configuration object must contain server, port, and password.");
  const r = e.password, t = e.server, n = e.port, i = e.name || "", o = new URLSearchParams(), s = e.sni || e.servername || e.server;
  s && o.append("sni", s), e["skip-cert-verify"] && o.append("allowInsecure", "1");
  const a = e.network || "tcp";
  switch (o.append("type", a), a) {
    case "ws":
    // WebSocket
    case "http": {
      const h = e["ws-opts"] || e["http-opts"] || {};
      let f;
      h.headers && h.headers.Host ? f = h.headers.Host : e.sni || e.servername ? f = e.sni || e.servername : f = e.server, f && o.append("host", f);
      const m = h.path || "/";
      m !== "/" && o.append("path", m);
      break;
    }
    case "grpc": {
      const h = e["grpc-opts"] || {};
      h.serviceName && o.append("serviceName", h.serviceName);
      break;
    }
  }
  e.flow && o.append("flow", e.flow), e.tfo && o.append("tfo", "1"), e.udp && o.append("udp", "1"), e["client-fingerprint"] && o.append("fp", e["client-fingerprint"]);
  const l = encodeURIComponent(r), c = encodeURIComponent(t);
  let d = `trojan://${l}@${c}:${n}`;
  const p = o.toString();
  if (p && (d += `?${p}`), i) {
    const h = encodeURIComponent(i);
    d += `#${h}`;
  }
  return d;
}
function Co(e) {
  var d, p, h, f, m, g;
  if (e.type !== "vless")
    throw new Error('Configuration type must be "vless"');
  if (!e.uuid || !e.server || !e.port)
    throw new Error("Missing required fields: uuid, server, or port");
  const r = e.uuid, t = e.server, n = e.port, i = `#${encodeURIComponent(e.name || "vless-node")}`, o = new URLSearchParams(), s = e.network || "tcp";
  let a = "none";
  if (e.security === "reality" || e["reality-opts"] ? a = "reality" : (e.security === "tls" || e.tls === !0) && (a = "tls"), (s !== "tcp" || s === "tcp" && ((p = (d = e["tcp-opts"]) == null ? void 0 : d.header) != null && p.type) && e["tcp-opts"].header.type !== "none") && o.set("type", s), a === "tls") {
    o.set("security", "tls"), e.servername && o.set("sni", e.servername), Array.isArray(e.alpn) && e.alpn.length > 0 && o.set("alpn", encodeURIComponent(e.alpn.join(",")));
    const w = e["client-fingerprint"] || e.fingerprint;
    w && o.set("fp", encodeURIComponent(w)), e["skip-cert-verify"] === !0 && o.set("allowInsecure", "1"), e.flow && o.set("flow", e.flow);
  } else if (a === "reality") {
    o.set("security", "reality"), e.servername && o.set("sni", e.servername);
    const w = e["reality-opts"] || {}, C = w["public-key"] || w.publicKey, y = w["short-id"] || w.shortId;
    C && o.set("pbk", encodeURIComponent(C)), y && o.set("sid", encodeURIComponent(y));
    const ue = e["client-fingerprint"] || e.fingerprint;
    ue && o.set("fp", encodeURIComponent(ue));
  }
  switch (s) {
    case "tcp":
      (f = (h = e["tcp-opts"]) == null ? void 0 : h.header) != null && f.type && e["tcp-opts"].header.type !== "none" && o.set("headerType", e["tcp-opts"].header.type);
      break;
    case "ws":
      e["ws-opts"] && ((m = e["ws-opts"].headers) != null && m.Host && o.set("host", e["ws-opts"].headers.Host), e["ws-opts"].path && o.set("path", encodeURIComponent(e["ws-opts"].path)));
      break;
    case "grpc":
      if (e["grpc-opts"]) {
        (e["grpc-opts"]["grpc-mode"] || e["grpc-opts"].mode) === "multi" && o.set("mode", "multi");
        const C = e["grpc-opts"]["grpc-service-name"];
        C && o.set("serviceName", encodeURIComponent(C));
      }
      break;
    case "quic":
      a !== "tls" && a !== "reality" && (o.has("security") || o.set("security", "tls")), e["quic-opts"] && (e["quic-opts"].security && e["quic-opts"].security !== "none" && o.set("quicSecurity", encodeURIComponent(e["quic-opts"].security)), e["quic-opts"].key && o.set("key", encodeURIComponent(e["quic-opts"].key)), (g = e["quic-opts"].header) != null && g.type && e["quic-opts"].header.type !== "none" && o.set("headerType", e["quic-opts"].header.type));
      break;
    case "httpupgrade":
      e["httpupgrade-opts"] && (e["httpupgrade-opts"].host && o.set("host", e["httpupgrade-opts"].host), e["httpupgrade-opts"].path && o.set("path", encodeURIComponent(e["httpupgrade-opts"].path)));
      break;
    case "h2":
      if (a !== "tls" && a !== "reality" && (o.has("security") || o.set("security", "tls")), e["h2-opts"]) {
        const w = e["h2-opts"].host;
        Array.isArray(w) && w.length > 0 ? o.set("host", encodeURIComponent(w.join(","))) : typeof w == "string" && o.set("host", encodeURIComponent(w)), e["h2-opts"].path && o.set("path", encodeURIComponent(e["h2-opts"].path));
      }
      break;
    default:
      console.warn(`Unsupported network type for URL generation: ${s}`);
  }
  e.tfo === !0 && o.set("tfo", "1");
  const l = o.toString();
  return `vless://${r}@${t}:${n}${l ? `?${l}` : ""}${i}`;
}
function _o(e) {
  if (!e || !e.server || !e.port || !e.uuid)
    throw new Error("Vmess configuration object must contain server, port, and uuid.");
  const r = {
    v: "2",
    // Vmess 协议版本，通常是 2
    ps: e.name || "",
    add: e.server,
    port: e.port,
    id: e.uuid,
    aid: e.alterId || 0,
    scy: e.cipher || "auto",
    net: e.network || "tcp"
  };
  switch (e.tls ? (r.tls = "tls", r.sni = e.servername || e.server, e["client-fingerprint"] && (r.fp = e["client-fingerprint"])) : r.tls = "", r.net) {
    case "ws":
    case "http": {
      const i = e["ws-opts"] || e["http-opts"] || {};
      i.headers && i.headers.Host ? r.host = i.headers.Host : r.sni ? r.host = r.sni : r.host = r.add, r.path = i.path || "/", r.net === "http" && !e.tls ? r.type = "http" : r.net === "ws" && !e.tls && (r.type = "ws");
      break;
    }
    case "tcp":
      e.tls || (r.type = "none");
      break;
    case "grpc":
      e["grpc-opts"] && e["grpc-opts"].serviceName && (r.serviceName = e["grpc-opts"].serviceName), r.type = "grpc";
      break;
  }
  (r.type === "none" || r.net === r.type && !e.tls) && delete r.type, r.tfo = e.tfo ? "1" : "0", r.udp = e.udp ? "1" : "0";
  const t = JSON.stringify(r);
  return `vmess://${D(t)}`;
}
function So(e) {
  const r = [];
  for (const t of e)
    try {
      t.type === "vmess" && r.push(_o(t)), t.type === "trojan" && r.push(yo(t)), t.type === "vless" && r.push(Co(t)), t.type === "ss" && r.push(wo(t)), t.type === "ssr" && r.push(xo(t)), (t.type === "hysteria2" || t.type === "hy2") && r.push(vo(t)), t.type === "hysteria" && r.push(go(t));
    } catch {
      continue;
    }
  return r;
}
class fr extends bo {
  constructor(t, n = [], i = "") {
    super(n);
    k(this, "urlSet", /* @__PURE__ */ new Set());
    k(this, "vpsStore", /* @__PURE__ */ new Map());
    k(this, "originUrls", /* @__PURE__ */ new Set());
    k(this, "vps", []);
    k(this, "includeProtocol", []);
    this.vps = t, this.includeProtocol = i ? JSON.parse(i) : [];
  }
  async parse(t = this.vps) {
    for await (const n of t)
      try {
        const i = this.updateVpsPs(n);
        if (i) {
          let o = null;
          i.startsWith("vless://") && this.hasProtocol("vless") ? o = new ur(i) : i.startsWith("vmess://") && this.hasProtocol("vmess") ? o = new dr(i) : i.startsWith("trojan://") && this.hasProtocol("trojan") ? o = new cr(i) : i.startsWith("ss://") && this.hasProtocol("shadowsocks") ? o = new ar(i) : i.startsWith("ssr://") && this.hasProtocol("shadowsocksr") ? o = new lr(i) : this.isHysteria2(i) && this.hasProtocol("hysteria", "hysteria2", "hy2") && (o = new sr(i)), o && this.setStore(i, o);
        }
        if (n.startsWith("https://") || n.startsWith("http://")) {
          const o = await dt(n, { retries: 3 }).then((l) => l.data.text()), { subType: s, content: a } = this.getSubType(o);
          if (s === "base64" && a && (this.updateExist(Array.from(this.originUrls)), await this.parse(a.split(`
`).filter(Boolean))), s === "yaml" && a) {
            const l = a.proxies;
            if (l.length) {
              this.updateExist(Array.from(this.originUrls));
              const c = So(l);
              await this.parse(c.filter(Boolean));
            }
          }
        }
      } catch {
        continue;
      }
  }
  setStore(t, n) {
    this.urlSet.add(n.confuseLink), this.originUrls.add(t), this.vpsStore.set(n.confusePs, n);
  }
  getSubType(t) {
    try {
      return {
        subType: "base64",
        content: He(t)
      };
    } catch {
      try {
        return {
          subType: "yaml",
          content: or(t)
        };
      } catch {
        try {
          const n = JSON.parse(t);
          return {
            subType: "json",
            content: JSON.stringify(n)
          };
        } catch {
          return {
            subType: "unknown",
            content: t
          };
        }
      }
    }
  }
  isHysteria2(t) {
    return t.startsWith("hysteria2://") || t.startsWith("hysteria://") || t.startsWith("hy2://");
  }
  hasProtocol(...t) {
    return this.includeProtocol.length === 0 || t.some((n) => this.includeProtocol.includes(n));
  }
  get urls() {
    return Array.from(this.urlSet);
  }
  get vpsMap() {
    return this.vpsStore;
  }
  get originVps() {
    return Array.from(this.originUrls);
  }
}
let ko = class {
  async getConfig(r) {
    try {
      const n = (await Promise.all(r.map((i) => dt(i, { retries: 3 }).then((o) => o.data.text())))).map((i) => or(i));
      return this.mergeClashConfig(n);
    } catch (t) {
      throw new Error(`Failed to get clash config: ${t.message || t}`);
    }
  }
  /**
   * @description 合并配置
   * @param {ClashType[]} configs
   * @returns {ClashType} mergedConfig
   */
  mergeClashConfig(r = []) {
    var t, n, i, o;
    try {
      if (!r.length)
        return {};
      const s = structuredClone(r[0]);
      if (r.length === 1)
        return s;
      const a = {
        ...s,
        proxies: s.proxies || [],
        "proxy-groups": s["proxy-groups"] || []
      }, l = r.reduce((f, m) => {
        var g;
        return f + (((g = m.proxies) == null ? void 0 : g.length) || 0);
      }, 0), c = new Int32Array(l), d = new Set((t = s.proxies) == null ? void 0 : t.map((f) => f.name));
      let p = ((n = s.proxies) == null ? void 0 : n.length) || 0;
      const h = new Map(a["proxy-groups"].map((f) => [f.name, f]));
      for (let f = 1; f < r.length; f++) {
        const m = r[f];
        if ((i = m.proxies) != null && i.length)
          for (const g of m.proxies)
            d.has(g.name) || (a.proxies[p] = g, c[p] = p, d.add(g.name), p++);
        if ((o = m["proxy-groups"]) != null && o.length)
          for (const g of m["proxy-groups"]) {
            const w = h.get(g.name);
            if (w) {
              const C = new Set(w.proxies);
              for (const y of g.proxies || [])
                C.add(y);
              w.proxies = Array.from(C), Object.assign(w, {
                ...g,
                proxies: w.proxies
              });
            } else
              a["proxy-groups"].push(g), h.set(g.name, g);
          }
      }
      return a.proxies = a.proxies.filter((f, m) => c[m] !== -1), a;
    } catch (s) {
      throw new Error(`Failed to merge clash config: ${s.message || s}`);
    }
  }
}, Ao = class {
  async getConfig(r) {
    try {
      const n = (await Promise.all(r.map((i) => dt(i, { retries: 3 }).then((o) => o.data.text())))).filter((i) => uo(i)).map((i) => JSON.parse(i));
      return this.mergeConfig(n);
    } catch (t) {
      throw new Error(`Failed to get singbox config: ${t.message || t}`);
    }
  }
  mergeConfig(r) {
    var t, n;
    try {
      if (r.length === 0)
        return {};
      const i = structuredClone(r[0]), o = [], s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
      for (const l of r)
        if ((t = l.outbounds) != null && t.length) {
          for (const c of l.outbounds)
            if (c.outbounds) {
              const d = `${c.type}:${c.tag}`;
              if (!a.has(d)) {
                const p = new Set(c.outbounds.filter((h) => !S.isConfigType(h)));
                a.set(d, {
                  base: c,
                  baseOutbounds: p,
                  linkOutbounds: /* @__PURE__ */ new Set()
                });
              }
              c.outbounds.forEach((p) => {
                var h;
                S.isConfigType(p) && ((h = a.get(d)) == null || h.linkOutbounds.add(p));
              });
            }
        }
      for (const l of r)
        if ((n = l.outbounds) != null && n.length) {
          for (const c of l.outbounds)
            if (!c.outbounds)
              if (S.isConfigType(c.tag))
                o.push(c);
              else {
                const d = `${c.type}:${c.tag}`;
                s.has(d) || (s.add(d), o.push(c));
              }
        }
      for (const [l, c] of a) {
        const d = { ...c.base }, p = /* @__PURE__ */ new Set([...c.baseOutbounds, ...c.linkOutbounds]);
        d.outbounds = Array.from(p), o.push(d);
      }
      return i.outbounds = o, i;
    } catch (i) {
      throw new Error(`Failed to merge singbox config: ${i.message || i}`);
    }
  }
}, Eo = class extends fr {
  async getConfig(r, t) {
    try {
      return await this.parse(t), fo(this.originVps.join(`
`));
    } catch (n) {
      throw new Error(`Failed to get v2ray config: ${n.message || n}`);
    }
  }
};
class Lo {
  constructor(r) {
    k(this, "urls", []);
    k(this, "vps", []);
    k(this, "chunkCount", Number(Ae.CHUNK_COUNT));
    k(this, "backend", Ae.BACKEND);
    k(this, "parser", null);
    k(this, "clashClient", new ko());
    k(this, "singboxClient", new Ao());
    k(this, "v2rayClient", new Eo(this.vps));
    this.chunkCount = Number(r.CHUNK_COUNT ?? Ae.CHUNK_COUNT), this.backend = r.BACKEND ?? Ae.BACKEND, this.parser = null;
  }
  async setSubUrls(r) {
    const { searchParams: t } = new URL(r.url), n = t.get("url"), i = t.get("protocol");
    this.backend = t.get("backend") ?? this.backend;
    const o = n.split(/\||\n/).filter(Boolean);
    this.parser = new fr(o, [], i), this.vps = o, await this.parser.parse(o);
    const s = co(Array.from(this.parser.urls), Number(this.chunkCount));
    this.urls = s.map((a) => {
      const l = new URL(`${this.backend}/sub`), { searchParams: c } = new URL(r.url);
      return c.set("url", a), l.search = c.toString(), l.toString();
    });
  }
  async getClashConfig() {
    return await this.clashClient.getConfig(this.urls);
  }
  async getSingboxConfig() {
    return await this.singboxClient.getConfig(this.urls);
  }
  async getV2RayConfig() {
    return await this.v2rayClient.getConfig(this.urls, this.vps);
  }
  get vpsStore() {
    var r;
    return (r = this.parser) == null ? void 0 : r.vpsMap;
  }
}
class Oo {
  constructor(r) {
    k(this, "confuseConfig");
    this.confuseConfig = r;
  }
  getOriginConfig(r) {
    var t, n;
    try {
      return this.confuseConfig.proxies = this.restoreProxies(this.confuseConfig.proxies, r), this.confuseConfig["proxy-groups"] = (n = (t = this.confuseConfig) == null ? void 0 : t["proxy-groups"]) == null ? void 0 : n.map((i) => (i.proxies && (i.proxies = this.updateProxiesGroups(i.proxies)), i)), this.confuseConfig;
    } catch (i) {
      throw new Error(`Get origin config failed: ${i.message || i}, function trace: ${i.stack}`);
    }
  }
  restoreProxies(r, t) {
    const n = [];
    if (!r)
      return n;
    for (const i of r)
      try {
        const [o, s] = S.getPs(i.name);
        if (t.has(s)) {
          const a = t.get(s);
          a == null || a.restoreClash(i, o), n.push(i);
        }
      } catch (o) {
        console.warn(`Restore proxies failed: ${o.message || o}, function trace: ${o.stack}`);
        continue;
      }
    return n;
  }
  updateProxiesGroups(r) {
    try {
      return r.map((t) => {
        const [n] = S.getPs(t);
        return n;
      });
    } catch (t) {
      throw new Error(`Update proxies groups failed: ${t.message || t}, function trace: ${t.stack}`);
    }
  }
}
class Ro {
  constructor(r) {
    k(this, "confuseConfig");
    this.confuseConfig = r;
  }
  getOriginConfig(r) {
    try {
      return this.confuseConfig.outbounds = this.restoreOutbounds(this.confuseConfig.outbounds, r), this.confuseConfig;
    } catch (t) {
      throw new Error(`Get origin config failed: ${t.message || t}, function trace: ${t.stack}`);
    }
  }
  restoreOutbounds(r = [], t) {
    const n = [];
    if (!r)
      return n;
    for (const i of r)
      try {
        if (this.isConfuseVps(i.tag)) {
          const [o, s] = S.getPs(i.tag), a = t.get(s);
          a == null || a.restoreSingbox(i, o);
        }
        Reflect.has(i, "outbounds") && (i.outbounds = this.updateOutbouns(i.outbounds)), n.push(i);
      } catch (o) {
        console.warn(`Restore outbounds failed: ${o.message || o}, function trace: ${o.stack}`);
        continue;
      }
    return n;
  }
  updateOutbouns(r = []) {
    try {
      return r.map((t) => {
        if (this.isConfuseVps(t)) {
          const [n] = S.getPs(t);
          return n;
        }
        return t;
      });
    } catch (t) {
      throw new Error(`Update outbounds failed: ${t.message || t}, function trace: ${t.stack}`);
    }
  }
  isConfuseVps(r) {
    return S.isConfigType(r);
  }
}
class To {
  constructor(r) {
    k(this, "confuseConfig");
    this.confuseConfig = r;
  }
  getOriginConfig() {
    try {
      return this.confuseConfig;
    } catch (r) {
      throw new Error(`Get origin config failed: ${r.message || r}, function trace: ${r.stack}`);
    }
  }
}
class No {
  constructor(r) {
    this.confuse = r, this.confuse = r;
  }
  async getClashConfig() {
    const r = await this.confuse.getClashConfig();
    return new Oo(r).getOriginConfig(this.confuse.vpsStore);
  }
  async getSingboxConfig() {
    const r = await this.confuse.getSingboxConfig();
    return new Ro(r).getOriginConfig(this.confuse.vpsStore);
  }
  async getV2RayConfig() {
    const r = await this.confuse.getV2RayConfig();
    return new To(r).getOriginConfig();
  }
}
class Io {
  constructor(r) {
    this.db = r;
  }
  async toSub(r, t, n) {
    try {
      const i = new Lo(t);
      await i.setSubUrls(r);
      const o = new No(i);
      if (["clash", "clashr"].includes(n)) {
        const s = await o.getClashConfig();
        return new Response(lo(s, { indent: 2, lineWidth: 200 }), {
          headers: new Headers({
            "Content-Type": "text/yaml; charset=UTF-8",
            "Cache-Control": "no-store"
          })
        });
      }
      if (n === "singbox") {
        const s = await o.getSingboxConfig();
        return new Response(JSON.stringify(s), {
          headers: new Headers({
            "Content-Type": "text/plain; charset=UTF-8",
            "Cache-Control": "no-store"
          })
        });
      }
      if (n === "v2ray") {
        const s = await o.getV2RayConfig();
        return new Response(s, {
          headers: new Headers({
            "Content-Type": "text/plain; charset=UTF-8",
            "Cache-Control": "no-store"
          })
        });
      }
      return _.error("Unsupported client type, support list: clash, singbox, v2ray");
    } catch (i) {
      throw new Error(i.message || "Invalid request");
    }
  }
  async getVersion(r, t) {
    const { searchParams: n } = new URL(r.url), i = n.get("backend") ?? t.BACKEND ?? Ae.BACKEND;
    return Response.redirect(`${i}/version`, 302);
  }
  async add(r, t) {
    if (!this.db)
      throw new Error("Database is not initialized");
    const n = this.generateShortCode(), i = `${t}/${n}`, o = await this.db.prepare("INSERT INTO short_url (short_code, short_url, long_url) VALUES (?, ?, ?) RETURNING id").bind(n, i, r).first();
    if (!(o != null && o.id))
      throw new Error("Failed to create short URL");
    return { id: o.id, short_code: n, short_url: i, long_url: r };
  }
  async delete(r) {
    if (!this.db)
      throw new Error("Database is not initialized");
    await this.db.prepare("DELETE FROM short_url WHERE id = ?").bind(r).run();
  }
  async getById(r) {
    if (!this.db)
      throw new Error("Database is not initialized");
    return await this.db.prepare("SELECT id, short_url, long_url FROM short_url WHERE id = ?").bind(r).first();
  }
  async getList(r = 1, t = 10) {
    if (!this.db)
      throw new Error("Database is not initialized");
    const n = (r - 1) * t, [i, o] = await Promise.all([
      this.db.prepare("SELECT COUNT(*) as count FROM short_url").first(),
      this.db.prepare("SELECT id, short_code, short_url, long_url FROM short_url LIMIT ? OFFSET ?").bind(t, n).all()
    ]);
    return {
      total: (i == null ? void 0 : i.count) || 0,
      items: (o == null ? void 0 : o.results) || []
    };
  }
  async getByShortUrl(r) {
    if (!this.db)
      throw new Error("Database is not initialized");
    return await this.db.prepare("SELECT id, short_code, short_url, long_url FROM short_url WHERE short_url = ?").bind(r).first();
  }
  async getByCode(r) {
    if (!this.db)
      throw new Error("Database is not initialized");
    return await this.db.prepare("SELECT id, short_code, short_url, long_url FROM short_url WHERE short_code = ?").bind(r).first();
  }
  async deleteByCode(r) {
    if (!this.db)
      throw new Error("Database is not initialized");
    await this.db.prepare("DELETE FROM short_url WHERE short_code = ?").bind(r).run();
  }
  generateShortCode() {
    return crypto.randomUUID().substring(0, 8);
  }
}
const It = new vr(), $o = {
  async fetch(e, r) {
    try {
      if (e.method === "OPTIONS")
        return _.cors(new Response(null, { status: 200 }));
      const t = new Io(r.DB), n = new gr(t);
      It.get("/", (o) => $r(o, r)).get("/favicon.ico", () => new Response(null, { status: 200 })).get("/sub", (o) => n.toSub(o, r)).get("/version", (o) => n.getVersion(o, r)).post("/api/add", (o) => n.add(o)).delete("/api/delete", (o) => n.delete(o)).get("/api/queryByCode", (o) => n.queryByCode(o)).get("/api/queryList", (o) => n.queryList(o)).get("/:code", (o) => n.redirect(o));
      const i = await It.handle(e, r);
      return _.cors(i);
    } catch (t) {
      return _.error(t.message || t);
    }
  }
};
export {
  $o as default
};
