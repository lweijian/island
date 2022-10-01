/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import { ComponentPropsWithIsland, Header } from 'shared/types/index';
import { bindingAsideScroll } from '../../logic';

export function Aside(
  props: ComponentPropsWithIsland<{
    headers: Header[];
    pagePath: string;
    outlineTitle: string;
  }>
) {
  const [headers, setHeaders] = useState(props.headers || []);
  // For outline text highlight
  const markerRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);
  // We promise: in complete dev/prod render process, the hooks order will be consistent
  if (import.meta.env.ENABLE_SPA || import.meta.env.DEV) {
    useEffect(() => {
      if (markerRef.current) {
        markerRef.current.style.opacity = '0';
      }
      const unbinding = bindingAsideScroll();
      window.scrollTo(0, 0);
      return unbinding;
    }, [headers]);
  }

  useEffect(() => {
    setHeaders(props.headers);
  }, [props.headers]);

  useEffect(() => {
    // Handle aside hmr:
    // When mdx file changed, server will send a custom event to client.
    // Then we listen the event and pull the latest page module so we can get and render the new headers.
    if (import.meta.env.DEV) {
      import.meta.hot?.on('md(x)-changed', ({ filePath }) => {
        if (filePath !== props.pagePath) {
          return;
        }
        import(/* @vite-ignore */ `${filePath}?import&t=${Date.now()}`).then(
          (mod) => {
            setHeaders(mod.toc);
          }
        );
      });
    }
  }, [props.pagePath]);

  const renderHeader = (header: Header) => {
    const isNested = header.depth > 2;
    return (
      <li key={header.text}>
        <a
          href={`#${header.id}`}
          className={`${styles.outlineLink}  ${isNested ? styles.nested : ''}`}
        >
          {header.text}
        </a>
      </li>
    );
  };

  return (
    <div className={styles.docAside}>
      <div className={styles.docsAsideOutline}>
        <div className={styles.content} ref={asideRef} id="aside-container">
          <div
            className={styles.outlineMarker}
            ref={markerRef}
            id="aside-marker"
          ></div>
          <div className={styles.outlineTitle}>{props.outlineTitle}</div>
          <nav>
            <ul className={styles.root}>{headers.map(renderHeader)}</ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
