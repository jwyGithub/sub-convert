import { getConfiguredAdminKey } from '../../../shared/adminKey';
import { SubButton, SubForm, SubFormItem, SubInput, SubMessage, SubModal, SubTable, SubTextarea } from '../../components';
import { theme } from '../../script/theme';
import { layout } from '../../style/layout';
import { style } from '../../style/style';

export function showShortUrlPage(_request: Request, env: Env): Response {
    const hasDBConfig = env.SHORT_URL_ENABLED === true;
    const hasAdminKey = getConfiguredAdminKey(env) !== null;

    const columns = [
        { key: 'short_url', title: '短链' },
        { key: 'long_url', title: '长链', ellipsis: true },
        { key: 'created_at', title: '创建时间', width: '170px' },
        { type: 'actions', title: '操作', width: '120px' }
    ];

    const actions = [
        { key: 'copy', label: '复制' },
        { key: 'delete', label: '删除', danger: true }
    ];

    const html = `
    <!DOCTYPE html>
        <html lang="zh-CN" theme="dark" class="short-url-page">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>短链管理</title>
                ${style()}
                ${layout()}
                <style>
                    .modal-form-actions {
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        gap: 10px;
                    }

                    .admin-key-input {
                        width: 100%;
                        min-height: 32px;
                        padding: 4px 11px;
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius);
                        background: var(--background);
                        color: var(--text-primary);
                        box-sizing: border-box;
                        font-size: 14px;
                        outline: none;
                        transition: var(--transition);
                    }

                    .admin-key-input:focus {
                        border-color: var(--primary-color);
                        box-shadow: 0 0 0 2px var(--shadow);
                    }

                    #short-url-main[hidden] {
                        display: none !important;
                    }
                </style>
            </head>
            <body>
                ${theme()}

                <main id="short-url-main" hidden>
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

                        <span class="header__title">短链管理</span>

                        <div class="header__right">
                            <a class="header__nav" href="/">订阅转换</a>
                            <button class="header__theme" type="button"></button>
                        </div>
                    </header>

                    <section class="short-url-list">
                        <div class="short-url-toolbar">
                            <sub-button id="open-create-modal-btn" type="default">
                                生成短链
                            </sub-button>
                        </div>
                        <sub-table
                            id="short-url-table"
                            row-key="short_code"
                            columns='${JSON.stringify(columns)}'
                            actions='${JSON.stringify(actions)}'
                            data="[]"
                            empty-text="暂无数据"
                        ></sub-table>
                        <div class="short-url-pagination" id="short-url-pagination">
                            <span id="pagination-total">共 0 条</span>
                            <button type="button" id="pagination-prev" disabled>上一页</button>
                            <span id="pagination-page">第 1/1 页</span>
                            <button type="button" id="pagination-next" disabled>下一页</button>
                        </div>
                    </section>
                </main>

                <sub-modal id="auth-modal" title="管理验证">
                    <sub-form-item label="管理密钥">
                        <input
                            id="admin-key-input"
                            class="admin-key-input"
                            type="password"
                            placeholder="请输入管理密钥"
                            autocomplete="current-password"
                        />
                    </sub-form-item>
                    <div class="modal-form-actions" slot="footer">
                        <sub-button id="auth-cancel-btn" type="default">取消</sub-button>
                        <sub-button id="auth-submit-btn" type="default">进入</sub-button>
                    </div>
                </sub-modal>

                <sub-modal id="create-modal" title="生成短链">
                    <sub-form id="short-url-form" label-width="100px">
                        <sub-form-item label="长链地址">
                            <sub-textarea
                                key="long_url"
                                placeholder="输入需要缩短的完整 URL"
                                rows="4"
                            ></sub-textarea>
                        </sub-form-item>
                        <sub-form-item label="自定义后缀">
                            <sub-input
                                key="short_code"
                                placeholder="可选，留空则自动生成"
                            ></sub-input>
                        </sub-form-item>
                    </sub-form>
                    <div class="modal-form-actions" slot="footer">
                        <sub-button id="cancel-create-btn" type="default">取消</sub-button>
                        <sub-button id="create-short-url-btn" type="default">
                            生成短链
                        </sub-button>
                    </div>
                </sub-modal>

                ${SubTextarea()}
                ${SubInput()}
                ${SubFormItem()}
                ${SubForm()}
                ${SubButton()}
                ${SubTable()}
                ${SubModal()}
                ${SubMessage()}

                <script>
                    class ShortUrlManager {
                        #enabled = ${hasDBConfig};
                        #hasAdminKey = ${hasAdminKey};
                        #authenticated = false;
                        #adminKey = '';
                        #page = 1;
                        #pageSize = 20;
                        #total = 0;
                        #model = { long_url: '', short_code: '' };
                        #storageKey = 'short_url_admin_key';

                        #main = document.querySelector('#short-url-main');
                        #authModal = document.querySelector('#auth-modal');
                        #adminKeyInput = document.querySelector('#admin-key-input');
                        #authCancelBtn = document.querySelector('#auth-cancel-btn');
                        #authSubmitBtn = document.querySelector('#auth-submit-btn');
                        #form = document.querySelector('#short-url-form');
                        #modal = document.querySelector('#create-modal');
                        #openModalBtn = document.querySelector('#open-create-modal-btn');
                        #cancelBtn = document.querySelector('#cancel-create-btn');
                        #createBtn = document.querySelector('#create-short-url-btn');
                        #table = document.querySelector('#short-url-table');
                        #prevBtn = document.querySelector('#pagination-prev');
                        #nextBtn = document.querySelector('#pagination-next');
                        #totalEl = document.querySelector('#pagination-total');
                        #pageEl = document.querySelector('#pagination-page');
                        #headerIcon = document.querySelector('.header__icon');

                        constructor() {
                            this.#bindEvents();
                            this.#bootstrap();
                        }

                        async #bootstrap() {
                            if (!this.#enabled) {
                                notification.error('短链服务未启用');
                                setTimeout(() => {
                                    location.href = '/';
                                }, 800);
                                return;
                            }

                            if (!this.#hasAdminKey) {
                                notification.error('请先配置 SHORT_URL_KEY');
                                setTimeout(() => {
                                    location.href = '/';
                                }, 1200);
                                return;
                            }

                            const cached = sessionStorage.getItem(this.#storageKey) || '';
                            if (cached) {
                                const ok = await this.#verifyKey(cached, false);
                                if (ok) {
                                    this.#enter(cached);
                                    return;
                                }
                                sessionStorage.removeItem(this.#storageKey);
                            }

                            this.#authModal.setAttribute('open', '');
                            setTimeout(() => this.#adminKeyInput?.focus(), 0);
                        }

                        #bindEvents() {
                            this.#headerIcon?.addEventListener('click', () => {
                                window.open('https://github.com/jwyGithub/sub-convert');
                            });

                            this.#form?.addEventListener('form:change', e => {
                                this.#model[e.detail.key] = e.detail.value;
                                this.#form.setAttribute('model', JSON.stringify(this.#model));
                            });

                            this.#form?.setAttribute('model', JSON.stringify(this.#model));

                            this.#authSubmitBtn?.addEventListener('click', () => this.#submitAuth());
                            this.#authCancelBtn?.addEventListener('click', () => this.#goHome());
                            this.#adminKeyInput?.addEventListener('keydown', e => {
                                if (e.key === 'Enter') this.#submitAuth();
                            });
                            this.#authModal?.addEventListener('modal:close', () => {
                                if (!this.#authenticated) this.#goHome();
                            });

                            this.#openModalBtn?.addEventListener('click', () => this.#openModal());
                            this.#cancelBtn?.addEventListener('click', () => this.#closeModal());
                            this.#createBtn?.addEventListener('click', () => this.#create());

                            this.#prevBtn?.addEventListener('click', () => {
                                if (this.#page > 1) {
                                    this.#page -= 1;
                                    this.#loadList();
                                }
                            });
                            this.#nextBtn?.addEventListener('click', () => {
                                if (this.#page < this.#totalPages()) {
                                    this.#page += 1;
                                    this.#loadList();
                                }
                            });

                            this.#table?.addEventListener('table:action', e => {
                                const { action, row } = e.detail;
                                if (action === 'copy') this.#copy(row.short_url);
                                if (action === 'delete') this.#delete(row.short_code);
                            });
                        }

                        #goHome() {
                            location.href = '/';
                        }

                        async #submitAuth() {
                            const key = (this.#adminKeyInput?.value || '').trim();
                            if (!key) {
                                notification.error('请输入管理密钥');
                                return;
                            }

                            const ok = await this.#verifyKey(key, true);
                            if (!ok) {
                                notification.error('密钥不正确');
                                setTimeout(() => this.#goHome(), 800);
                                return;
                            }

                            sessionStorage.setItem(this.#storageKey, key);
                            this.#enter(key);
                        }

                        async #verifyKey(key, silentNetworkError) {
                            try {
                                const res = await fetch('/api/admin/verify', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ key })
                                });
                                if (res.ok) return true;
                                if (res.status === 401) return false;
                                let message = '验证失败';
                                try {
                                    const err = await res.json();
                                    message = err.message || message;
                                } catch (_) {}
                                if (!silentNetworkError) notification.error(message);
                                return false;
                            } catch (error) {
                                if (!silentNetworkError) {
                                    notification.error(error.message || '验证失败');
                                }
                                return false;
                            }
                        }

                        #enter(key) {
                            this.#adminKey = key;
                            this.#authenticated = true;
                            this.#authModal.removeAttribute('open');
                            this.#main.hidden = false;
                            this.#loadList();
                        }

                        #adminHeaders(extra = {}) {
                            return {
                                ...extra,
                                'X-Admin-Key': this.#adminKey
                            };
                        }

                        #openModal() {
                            this.#modal.setAttribute('open', '');
                        }

                        #closeModal() {
                            this.#modal.removeAttribute('open');
                        }

                        #formatTime(value) {
                            if (!value) return '-';
                            const date = new Date(value);
                            if (Number.isNaN(date.getTime())) return String(value);
                            const pad = n => String(n).padStart(2, '0');
                            return \`\${date.getFullYear()}-\${pad(date.getMonth() + 1)}-\${pad(date.getDate())} \${pad(date.getHours())}:\${pad(date.getMinutes())}:\${pad(date.getSeconds())}\`;
                        }

                        #totalPages() {
                            return Math.max(1, Math.ceil(this.#total / this.#pageSize) || 1);
                        }

                        #updatePagination() {
                            const totalPages = this.#totalPages();
                            this.#totalEl.textContent = \`共 \${this.#total} 条\`;
                            this.#pageEl.textContent = \`第 \${this.#page}/\${totalPages} 页\`;
                            this.#prevBtn.disabled = this.#page <= 1;
                            this.#nextBtn.disabled = this.#page >= totalPages;
                        }

                        async #loadList() {
                            if (!this.#authenticated) return;
                            this.#table.setAttribute('loading', '');
                            try {
                                const res = await fetch(\`/api/queryList?page=\${this.#page}&pageSize=\${this.#pageSize}\`, {
                                    headers: this.#adminHeaders()
                                });
                                if (!res.ok) throw new Error('加载失败');
                                const json = await res.json();
                                const data = json.data || { total: 0, items: [] };
                                this.#total = data.total || 0;
                                const totalPages = this.#totalPages();
                                if (this.#page > totalPages) {
                                    this.#page = totalPages;
                                    return this.#loadList();
                                }
                                this.#table.setAttribute(
                                    'data',
                                    JSON.stringify(
                                        (data.items || []).map(item => ({
                                            ...item,
                                            created_at: this.#formatTime(item.created_at)
                                        }))
                                    )
                                );
                                this.#updatePagination();
                            } catch (error) {
                                this.#table.setAttribute('data', '[]');
                                notification.error(error.message || '加载列表失败');
                            } finally {
                                this.#table.removeAttribute('loading');
                            }
                        }

                        async #create() {
                            const longUrl = (this.#model.long_url || '').trim();
                            if (!longUrl) {
                                notification.error('请输入长链地址');
                                return;
                            }

                            const customCode = (this.#model.short_code || '').trim();
                            if (customCode && !/^[a-zA-Z0-9_-]{1,64}$/.test(customCode)) {
                                notification.error('自定义后缀仅支持字母、数字、下划线和短横线，长度 1-64');
                                return;
                            }

                            const serve = \`\${location.protocol}//\${location.host}\`;
                            try {
                                const res = await fetch('/api/add', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ long_url: longUrl, serve, short_code: customCode })
                                });
                                if (!res.ok) {
                                    let message = '生成短链失败';
                                    try {
                                        const err = await res.json();
                                        message = err.message || message;
                                    } catch (_) {}
                                    throw new Error(message);
                                }
                                notification.success('生成短链成功');
                                this.#model.long_url = '';
                                this.#model.short_code = '';
                                this.#form.setAttribute('model', JSON.stringify(this.#model));
                                this.#closeModal();
                                this.#page = 1;
                                await this.#loadList();
                            } catch (error) {
                                notification.error(error.message || '生成短链失败');
                            }
                        }

                        async #copy(text) {
                            if (!text) {
                                notification.error('复制内容不能为空');
                                return;
                            }
                            try {
                                if (navigator.clipboard && window.isSecureContext) {
                                    await navigator.clipboard.writeText(text);
                                } else {
                                    const textArea = document.createElement('textarea');
                                    textArea.value = text;
                                    textArea.style.position = 'fixed';
                                    textArea.style.left = '-999999px';
                                    document.body.appendChild(textArea);
                                    textArea.select();
                                    const ok = document.execCommand('copy');
                                    textArea.remove();
                                    if (!ok) throw new Error('复制失败');
                                }
                                notification.success('复制成功');
                            } catch (error) {
                                notification.error('复制失败: ' + (error.message || '未知错误'));
                            }
                        }

                        async #delete(code) {
                            if (!code) return;
                            if (!confirm('确认删除该短链？')) return;
                            try {
                                const res = await fetch(\`/api/delete?code=\${encodeURIComponent(code)}\`, {
                                    method: 'DELETE',
                                    headers: this.#adminHeaders()
                                });
                                if (!res.ok) throw new Error('删除失败');
                                notification.success('删除成功');
                                await this.#loadList();
                            } catch (error) {
                                notification.error(error.message || '删除失败');
                            }
                        }
                    }

                    new ShortUrlManager();
                </script>
            </body>
        </html>
    `;

    return new Response(html, {
        headers: new Headers({
            'Content-Type': 'text/html; charset=UTF-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate'
        })
    });
}
