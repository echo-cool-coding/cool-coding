import React from 'react';
import clsx from 'clsx';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import {
  PageMetadata,
  SkipToContentFallbackId,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import SkipToContent from '@theme/SkipToContent';
import AnnouncementBar from '@theme/AnnouncementBar';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';
import LayoutProvider from '@theme/Layout/Provider';
import ErrorPageContent from '@theme/ErrorPageContent';
import styles from './styles.module.css';
import {PageMetaDataWithoutSiteName} from "../../components/PageMetaDataWithoutSiteName";
import WechatFollow from "../../components/WechatFollow";
export default function Layout(props) {
  const {
    children,
    noFooter,
    wrapperClassName,
    // Not really layout-related, but kept for convenience/retro-compatibility
    title,
    description,
  } = props;
  return (
      <LayoutProvider>
          <PageMetaDataWithoutSiteName title={title} description={description}/>
          {/*<PageMetadata title={title} description={description}/>*/}
          <SkipToContent/>

          <AnnouncementBar/>

          <Navbar/>

          <div
              id={SkipToContentFallbackId}
              className={clsx(
                  ThemeClassNames.layout.main.container,
                  ThemeClassNames.wrapper.main,
                  styles.mainWrapper,
                  wrapperClassName,
              )}>
              <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>
                  {children}
              </ErrorBoundary>
          </div>

          {!noFooter && <Footer/>}

          {/* 微信公众号悬浮窗 + 弹窗，文案/二维码见 docusaurus.config.js customFields.wechat */}
          <WechatFollow/>
      </LayoutProvider>
  );
}
