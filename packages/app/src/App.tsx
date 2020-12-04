import React, { FC } from 'react';
import {
  createApp,
  AlertDisplay,
  OAuthRequestDialog,
  SidebarPage,
  createRouteRef,
  gitlabAuthApiRef,
  githubAuthApiRef,
  SignInPage,
} from '@backstage/core';
import { apis } from './apis';
import * as plugins from './plugins';
import { AppSidebar } from './sidebar';
import { Route, Routes, Navigate } from 'react-router';
import { Router as CatalogRouter } from '@backstage/plugin-catalog';
import { Router as DocsRouter } from '@backstage/plugin-techdocs';
import { Router as RegisterComponentRouter } from '@backstage/plugin-register-component';
import { Router as TechRadarRouter } from '@backstage/plugin-tech-radar';

import { EntityPage } from './components/catalog/EntityPage';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
  components: {
    SignInPage: props => {
      return (
        <SignInPage
          {...props}
          providers={[
            // ('guest'),
            // ('custom'),
            // {
            //   id: 'oauth-auth-provider',
            //   title: 'KeyClpak',
            //   message: 'sdfsfsfsfs',
            //   apiRef: oauth2ApiRef,
            // },
            {
              id: 'github-auth-provider',
              title: 'Login GitHub',
              message: '一个简单的登陆页面',
              apiRef: githubAuthApiRef,
            },
            // {
            //   id: 'gitlab-auth-provider',
            //   title: 'Login GitLab',
            //   message: '一个简单的登陆页面',
            //   apiRef: gitlabAuthApiRef,
            // },
          ]}
          align="center"
          title="请使用GitLab登录试用" />
      )
    }
  }
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();
const deprecatedAppRoutes = app.getRoutes();

const catalogRouteRef = createRouteRef({
  path: '/catalog',
  title: 'Service Catalog',
});


const App: FC<{}> = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <SidebarPage>
        <AppSidebar />
        <Routes>
          <Navigate key="/" to="/catalog" />
          <Route
            path="/catalog/*"
            element={<CatalogRouter EntityPage={EntityPage} />}
          />
          <Route path="/docs/*" element={<DocsRouter />} />
          <Route
            path="/tech-radar"
            element={<TechRadarRouter width={1500} height={800} />}
          />
          <Route
            path="/register-component"
            element={<RegisterComponentRouter catalogRouteRef={catalogRouteRef} />}
          />
          {deprecatedAppRoutes}
        </Routes>
      </SidebarPage>
    </AppRouter>
  </AppProvider>
);

export default App;
