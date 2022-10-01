import { Layout } from 'island/theme';
import { routes } from 'virtual:routes';
import { matchRoutes, useLocation } from 'react-router-dom';
import siteData from 'island:site-data';
import { Route } from '../node/plugin-routes';
import { getRelativePagePath, omit } from './utils';
import { PageData } from '../shared/types';
import { HelmetProvider } from 'react-helmet-async';
import { useContext, useLayoutEffect } from 'react';
import { DataContext } from 'island/client';
import { cleanUrl } from '../shared/utils';

export async function waitForApp(path: string): Promise<PageData> {
  const matched = matchRoutes(routes, path, siteData.base)!;
  if (matched) {
    // Preload route component
    const matchedRoute = matched[0].route;
    const mod = await (matchedRoute as Route).preload();

    const pagePath = cleanUrl((matched[0].route as Route).filePath);
    const relativePagePath = getRelativePagePath(path, pagePath, siteData.base);
    const isApiPage = mod?.meta?.api || mod?.meta?.pageType === 'api';
    // API Page
    if (isApiPage) {
      const subModules = await Promise.all(
        routes
          .filter(
            (route: Route) =>
              route.path.startsWith(path) && route !== matchedRoute
          )
          .map(async (route: Route) => {
            const mod = await route.preload();
            return {
              ...mod,
              routePath: route.path
            };
          })
      );
      return {
        siteData,
        pagePath,
        relativePagePath,
        subModules,
        ...omit(mod, ['default']),
        pageType: 'api'
      };
    } else {
      // Doc/Custom Page
      return {
        siteData,
        pagePath,
        relativePagePath,
        ...omit(mod, ['default']),
        pageType: mod?.meta?.pageType || 'doc'
      } as PageData;
    }
  } else {
    // 404 Page
    return {
      siteData,
      pagePath: '',
      relativePagePath: '',
      pageType: '404'
    };
  }
}

export function App({ helmetContext }: { helmetContext?: object }) {
  const { pathname } = useLocation();
  const { setData: setPageData } = useContext(DataContext);

  useLayoutEffect(() => {
    async function refetchData() {
      try {
        const pageData = await waitForApp(pathname);
        setPageData(pageData);
      } catch (e) {
        console.log(e);
      }
    }
    refetchData();
  }, [pathname, setPageData]);

  return (
    <HelmetProvider context={helmetContext}>
      <Layout />
    </HelmetProvider>
  );
}
