import type { Hysteria2Parser } from './protocol/hysteria2';
import type { SsParser } from './protocol/ss';
import type { SsrParser } from './protocol/ssr';
import type { TrojanParser } from './protocol/trojan';
import type { VlessParser } from './protocol/vless';
import type { VmessParser } from './protocol/vmess';

export interface BaseConfig {
    href: string;
    origin: string;
    protocol: string;
    username: string;
    password: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    searchParams: URLSearchParams;
    hash: string;
    [key: string]: any;
}

export interface VmessConfig {
    v: string;
    ps: string;
    add: string;
    port: string;
    id: string;
    aid: string;
    scy: string;
    net: string;
    type: string;
    host: string;
    path: string;
    tls: string;
    sni: string;
    alpn: string;
    fp: string;
    [key: string]: any;
}

export interface SsrConfig {
    server: string;
    port: string;
    protocol: string;
    method: string;
    obfs: string;
    password_base64: string;
    remarks: string;
    params: string;
    [key: string]: any;
}

export interface VlessConfig extends BaseConfig {}

export interface TrojanConfig extends BaseConfig {}

export interface SsConfig extends BaseConfig {}

export interface Hysteria2Config extends BaseConfig {}

export type ParserType = VlessParser | VmessParser | TrojanParser | SsParser | Hysteria2Parser | SsrParser;
