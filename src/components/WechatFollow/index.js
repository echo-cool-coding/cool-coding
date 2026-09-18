import React, {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

/**
 * 微信公众号引流组件：右下角悬浮窗 + 首次访问自动弹窗。
 *
 * 所有文案、图片和行为都来自 docusaurus.config.js 的 customFields.wechat，
 * 改公众号名字 / 换二维码只需要改配置，不需要动这个文件。
 * 下面是每个字段的默认值，配置里没写的字段会回落到这里。
 */
const DEFAULTS = {
    enabled: true,
    // 公众号名称，会显示在悬浮卡片和弹窗标题里
    name: '公众号',
    // 一句话介绍
    description: '关注公众号，第一时间获取最新教程与更新。',
    // 二维码图片，相对 static/ 目录
    qrImage: 'img/wechat-qrcode.jpg',
    // 悬浮按钮上的文字
    floatLabel: '关注公众号',
    // 弹窗标题，留空则自动生成「关注「xxx」公众号」
    popupTitle: null,
    popup: {
        enabled: true,
        // 页面打开多久后弹出（毫秒）
        delayMs: 20000,
        // 关闭后多少天内不再弹
        dismissDays: 7,
    },
    // localStorage 键名，留空则自动带上公众号名称：改名后弹窗会重新对所有读者展示一次
    storageKey: null,
};

function mergeConfig(userConfig) {
    const cfg = {...DEFAULTS, ...(userConfig || {})};
    cfg.popup = {...DEFAULTS.popup, ...((userConfig && userConfig.popup) || {})};
    if (!cfg.popupTitle) {
        cfg.popupTitle = `关注「${cfg.name}」公众号`;
    }
    if (!cfg.storageKey) {
        cfg.storageKey = `wechat-follow-dismissed:${cfg.name}`;
    }
    return cfg;
}

function readDismissedAt(key) {
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? Number(raw) : 0;
    } catch (e) {
        return 0;
    }
}

function writeDismissedAt(key) {
    try {
        window.localStorage.setItem(key, String(Date.now()));
    } catch (e) {
        // 隐私模式等情况下忽略
    }
}

function detectEnvironment() {
    if (typeof navigator === 'undefined') {
        return 'desktop';
    }
    const ua = navigator.userAgent || '';
    if (/MicroMessenger/i.test(ua)) {
        return 'wechat';
    }
    if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) {
        return 'mobile';
    }
    return 'desktop';
}

const SCAN_HINTS = {
    wechat: '长按二维码，识别并关注公众号',
    mobile: '保存二维码，在微信中「扫一扫」关注',
    desktop: '打开微信「扫一扫」，扫码关注公众号',
};

function WechatIcon({className}) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            width="20"
            height="20"
            aria-hidden="true"
            focusable="false">
            <path
                fill="currentColor"
                d="M9.5 4C5.36 4 2 6.83 2 10.3c0 1.9 1 3.6 2.6 4.75l-.65 2.3 2.7-1.4c.9.28 1.85.45 2.85.45h.36a5.3 5.3 0 0 1-.2-1.4c0-3.42 3.3-6.2 7.37-6.2.3 0 .58.02.87.05C17.2 6.02 13.7 4 9.5 4Zm-2.75 4.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm5.5 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM16.9 10c-3.36 0-6.1 2.28-6.1 5.1 0 2.81 2.74 5.1 6.1 5.1.8 0 1.57-.13 2.27-.36L21.4 21l-.55-1.9C22.1 18.16 23 16.7 23 15.1c0-2.82-2.73-5.1-6.1-5.1Zm-2.1 3.3a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm4.2 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z"
            />
        </svg>
    );
}

function QrCard({cfg, qrSrc, hint, size}) {
    return (
        <div className={clsx(styles.card, size === 'large' && styles.cardLarge)}>
            <img
                className={styles.qr}
                src={qrSrc}
                alt={`${cfg.name} 微信公众号二维码`}
                loading="lazy"
                draggable={false}
            />
            <div className={styles.cardName}>{cfg.name}</div>
            <p className={styles.cardDescription}>{cfg.description}</p>
            <div className={styles.cardHint}>{hint}</div>
        </div>
    );
}

export default function WechatFollow() {
    const {siteConfig} = useDocusaurusContext();
    const cfg = useMemo(
        () => mergeConfig(siteConfig.customFields && siteConfig.customFields.wechat),
        [siteConfig],
    );
    const qrSrc = useBaseUrl(cfg.qrImage);

    const [modalOpen, setModalOpen] = useState(false);
    const [floatHidden, setFloatHidden] = useState(false);
    const [env, setEnv] = useState('desktop');

    useEffect(() => {
        setEnv(detectEnvironment());
    }, []);

    // 首次访问自动弹窗
    useEffect(() => {
        if (!cfg.enabled || !cfg.popup.enabled) {
            return undefined;
        }
        const dismissedAt = readDismissedAt(cfg.storageKey);
        const ttl = cfg.popup.dismissDays * 24 * 60 * 60 * 1000;
        if (dismissedAt && Date.now() - dismissedAt < ttl) {
            return undefined;
        }
        const timer = window.setTimeout(() => setModalOpen(true), cfg.popup.delayMs);
        return () => window.clearTimeout(timer);
    }, [cfg]);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        writeDismissedAt(cfg.storageKey);
    }, [cfg.storageKey]);

    // Esc 关闭 + 弹窗打开时锁定页面滚动
    useEffect(() => {
        if (!modalOpen) {
            return undefined;
        }
        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [modalOpen, closeModal]);

    if (!cfg.enabled) {
        return null;
    }

    const hint = SCAN_HINTS[env] || SCAN_HINTS.desktop;

    return (
        <>
            {!floatHidden && !modalOpen && (
                <div className={styles.float}>
                    <div className={styles.floatCard}>
                        <QrCard cfg={cfg} qrSrc={qrSrc} hint={hint} size="small" />
                    </div>
                    <button
                        type="button"
                        className={styles.floatButton}
                        onClick={() => setModalOpen(true)}
                        aria-haspopup="dialog"
                        aria-label={`${cfg.floatLabel}：${cfg.name}`}>
                        <WechatIcon className={styles.floatIcon} />
                        <span className={styles.floatLabel}>{cfg.floatLabel}</span>
                    </button>
                    <button
                        type="button"
                        className={styles.floatClose}
                        onClick={() => setFloatHidden(true)}
                        aria-label="隐藏公众号悬浮窗">
                        ×
                    </button>
                </div>
            )}

            {modalOpen && (
                <div
                    className={styles.backdrop}
                    onClick={closeModal}
                    role="presentation">
                    <div
                        className={styles.modal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="wechat-follow-title"
                        onClick={(event) => event.stopPropagation()}>
                        <button
                            type="button"
                            className={styles.modalClose}
                            onClick={closeModal}
                            aria-label="关闭">
                            ×
                        </button>
                        <h2 id="wechat-follow-title" className={styles.modalTitle}>
                            <WechatIcon className={styles.modalTitleIcon} />
                            {cfg.popupTitle}
                        </h2>
                        <QrCard cfg={cfg} qrSrc={qrSrc} hint={hint} size="large" />
                        <button
                            type="button"
                            className={clsx('button button--secondary button--outline', styles.modalLater)}
                            onClick={closeModal}>
                            {cfg.popup.dismissDays > 0
                                ? `稍后再说（${cfg.popup.dismissDays} 天内不再提醒）`
                                : '稍后再说'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
