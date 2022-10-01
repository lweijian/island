import { SideBar } from '../../components/Siderbar/index';
import styles from './index.module.scss';
import { Aside } from '../../components/Aside/index';

import { DocFooter } from '../../components/DocFooter/index';
import { Content, usePageData } from 'island/client';
import { useLocaleSiteData } from '../../logic';
import { useLocation } from 'react-router-dom';

export function DocLayout() {
  const { toc: headers = [], siteData, pagePath } = usePageData();
  const { pathname } = useLocation();
  const themeConfig = siteData.themeConfig;
  const localesData = useLocaleSiteData(themeConfig, pathname);
  const sidebar = localesData.sidebar || [];
  const hasSidebar =
    (Array.isArray(sidebar) && sidebar.length > 0) ||
    Object.keys(sidebar).length > 0;
  const outlineTitle =
    localesData?.outlineTitle || themeConfig?.outlineTitle || 'ON THIS PAGE';

  const hasAside = headers.length > 0 && themeConfig.outline !== false;
  return (
    <div className={styles.doc}>
      <div className={styles.sideBar}>{hasSidebar ? <SideBar /> : null}</div>
      <div
        className={`${styles.content} ${hasSidebar ? styles.hasSidebar : ''}`}
      >
        <div className={styles.container}>
          <div className={styles.contentContainer}>
            <main className={styles.main}>
              <div className="island-doc">
                <Content fallback={<div>Loading...</div>} />
              </div>
              <DocFooter />
            </main>
          </div>
        </div>
        <div className={styles.aside}>
          <div className={styles.asideCurtain} />
          <div className={styles.asideContainer}>
            <div className={styles.asideContent}>
              {hasAside ? (
                <Aside
                  headers={headers}
                  outlineTitle={outlineTitle}
                  pagePath={pagePath}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
