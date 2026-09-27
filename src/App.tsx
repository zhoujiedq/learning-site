import { useCallback, useMemo, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider, useI18n } from './i18n';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { PostList } from './pages/PostList';
import { PostDetail } from './pages/PostDetail';
import { Import } from './pages/Import';
import { About } from './pages/About';
import { loadRepoPosts } from './utils/posts';
import { loadUploadPosts } from './utils/uploadStore';
import type { Post } from './types';

function RoutedApp() {
  const { t } = useI18n();
  // uploadVersion 用于在导入/删除后触发重新读取 localStorage
  const [uploadVersion, setUploadVersion] = useState(0);
  const refresh = useCallback(() => setUploadVersion((v) => v + 1), []);

  const repoPosts = useMemo(() => loadRepoPosts(), []);
  const uploadPosts = useMemo(() => loadUploadPosts(), [uploadVersion]);

  const posts: Post[] = useMemo(() => [...repoPosts, ...uploadPosts], [repoPosts, uploadPosts]);

  return (
    <div className="min-h-screen flex flex-col bg-ink-50">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-5 sm:px-8">
        <Routes>
          <Route path="/" element={<Home posts={posts} />} />
          <Route path="/notes" element={<PostList posts={posts} type="note" title={t.listTitles.note} description={t.listDesc.note} />} />
          <Route path="/papers" element={<PostList posts={posts} type="paper" title={t.listTitles.paper} description={t.listDesc.paper} />} />
          <Route path="/projects" element={<PostList posts={posts} type="project" title={t.listTitles.project} description={t.listDesc.project} />} />
          <Route path="/post/:id" element={<PostDetail posts={posts} onChange={refresh} />} />
          <Route path="/import" element={<Import onImported={refresh} uploads={uploadPosts} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <HashRouter>
        <RoutedApp />
      </HashRouter>
    </I18nProvider>
  );
}
