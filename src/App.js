import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';

import Header from './components/Header';
import Chatbot from './components/Chatbot';
import Page from './components/Page';
import { ThemeProvider } from './theme/ThemeContext';
import './App.css';

const AppSkeleton = () => (
  <div className="app-shell" aria-hidden="true">
    <div className="container">
      <div className="app-shell__hero shimmer-panel">
        <div className="app-shell__hero-copy">
          <span className="app-shell__eyebrow shimmer-block" />
          <span className="app-shell__title shimmer-block" />
          <span className="app-shell__line shimmer-block" />
          <span className="app-shell__line app-shell__line--short shimmer-block" />
        </div>

        <div className="app-shell__hero-card shimmer-block" />
      </div>

      <div className="app-shell__grid">
        <div className="app-shell__card shimmer-panel">
          <span className="app-shell__card-title shimmer-block" />
          <span className="app-shell__line shimmer-block" />
          <span className="app-shell__line app-shell__line--short shimmer-block" />
        </div>

        <div className="app-shell__card shimmer-panel">
          <span className="app-shell__card-title shimmer-block" />
          <div className="app-shell__stats">
            <span className="app-shell__stat shimmer-block" />
            <span className="app-shell__stat shimmer-block" />
          </div>
        </div>

        <div className="app-shell__card shimmer-panel">
          <span className="app-shell__card-title shimmer-block" />
          <div className="app-shell__tags">
            <span className="app-shell__tag shimmer-block" />
            <span className="app-shell__tag shimmer-block" />
            <span className="app-shell__tag shimmer-block" />
            <span className="app-shell__tag shimmer-block" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const [siteData, setSiteData] = useState({
    logo: '',
    favicon: '',
    main_menu: [],
    pages: []
  });
  const [loading, setLoading] = useState(true);

  const JWT_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2RhcnNoYm9hcmQuY29tIiwiaWF0IjoxNzQ3NDIyMjc2LCJuYmYiOjE3NDc0MjIyNzYsImV4cCI6NDkwMTAyMjI3NiwiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMSJ9fX0.qAcZwVdMHPdw0byip-Kh8Ss6d8mzkncG_P82cnfI8JQ';

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`
          }
        };

        const [siteRes, pagesRes] = await Promise.all([
          axios.get('https://darshboard.com/wp-json/custom/v1/site-info', config),
          axios.get('https://darshboard.com/wp-json/wp/v2/pages?per_page=100', config)
        ]);

        setSiteData({
          logo: siteRes.data.logo || '',
          favicon: siteRes.data.favicon || '',
          main_menu: Array.isArray(siteRes.data.main_menu) ? siteRes.data.main_menu : [],
          pages: Array.isArray(pagesRes.data) ? pagesRes.data : []
        });
      } catch (err) {
        console.error('App init error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const aboutPage = siteData.pages.find((p) => p.slug === 'about-me');

  return (
    <ThemeProvider>
      <Router>
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://darshboard.com/#website',
                  url: 'https://darshboard.com/',
                  name: 'Darshboard',
                  description: 'Darshan Patel - Frontend Developer with 4+ years of experience building responsive React.js & WordPress websites.',
                  publisher: {
                    '@id': 'https://darshboard.com/#organization'
                  }
                },
                {
                  '@type': 'Organization',
                  '@id': 'https://darshboard.com/#organization',
                  name: 'Darshboard',
                  url: 'https://darshboard.com/',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://darshboard.com/wp-content/uploads/2025/06/darshboard_logo.svg'
                  },
                  sameAs: [
                    'https://www.linkedin.com/in/pateldarshan8311',
                    'https://github.com/pateldarshan8311',
                    'https://www.youtube.com/@darshboard',
                    'https://www.behance.net/pateldarshan8311',
                    'https://dribbble.com/pateldarshan8311',
                    'https://stackoverflow.com/users/7642929/pateldarshan8311',
                    'https://www.quora.com/profile/Darshan-Patel-2422'
                  ]
                },
                {
                  '@type': 'Person',
                  '@id': 'https://darshboard.com/#person',
                  name: 'Darshan Patel',
                  url: 'https://darshboard.com/',
                  image: {
                    '@type': 'ImageObject',
                    url: 'https://darshboard.com/wp-content/uploads/2025/06/darshboard_logo.svg'
                  },
                  jobTitle: 'Frontend Developer',
                  worksFor: {
                    '@id': 'https://darshboard.com/#organization'
                  },
                  sameAs: [
                    'https://www.linkedin.com/in/pateldarshan8311',
                    'https://github.com/pateldarshan8311',
                    'https://www.youtube.com/@darshboard',
                    'https://www.behance.net/pateldarshan8311',
                    'https://dribbble.com/pateldarshan8311',
                    'https://stackoverflow.com/users/7642929/pateldarshan8311',
                    'https://www.quora.com/profile/Darshan-Patel-2422'
                  ]
                }
              ]
            })}
          </script>
        </Helmet>

        <Header
          menuItems={siteData.main_menu}
          loading={loading}
          logo={siteData.logo}
        />

        <main role="main" id="main-content">
          {loading ? (
            <AppSkeleton />
          ) : (
            <Routes>
              {aboutPage && (
                <>
                  <Route path="/" element={<Page pageData={aboutPage} />} />
                  <Route path="/about-me" element={<Page pageData={aboutPage} />} />
                </>
              )}

              {siteData.pages
                .filter((page) => page.slug !== 'about-me')
                .map((page) => (
                  <Route
                    key={page.id}
                    path={`/${page.slug}`}
                    element={<Page pageData={page} />}
                  />
                ))}
            </Routes>
          )}
        </main>
        <Chatbot />
      </Router>
    </ThemeProvider>
  );
}

export default App;
