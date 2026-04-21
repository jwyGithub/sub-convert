import { SubIcon } from './sub-icon';

const ICONS = SubIcon();

export function SubSelect(): string {
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
                arrow.innerHTML = \`${ICONS.arrow}\`;

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
                        <div class="sub-select__empty-icon">${ICONS.empty}</div>
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
    </script>`;
}
