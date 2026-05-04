import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Search,
  Sparkles,
  WandSparkles
} from 'lucide-react';
import './styles.css';

const fallbackRepoUrl = 'https://github.com/freestylefly/awesome-gpt-image-2';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function useCopy() {
  const [copiedId, setCopiedId] = useState(null);

  async function copyPrompt(caseItem) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(caseItem.prompt);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = caseItem.prompt;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedId(caseItem.id);
    window.setTimeout(() => setCopiedId(null), 1600);
  }

  return { copiedId, copyPrompt };
}

function Hero({ hotCases, repoUrl, totalCases, categoryCount }) {
  return (
    <section className="hero">
      <div className="heroGlow heroGlowA" />
      <div className="heroGlow heroGlowB" />
      <div className="scanGrid" />
      <div className="heroCopy">
        <div className="eyebrow">
          <Sparkles size={16} />
          Live GPT-Image2 prompt gallery
        </div>
        <h1>Browse viral GPT-Image2 cases like a product catalog.</h1>
        <p>
          A visual front door for the awesome-gpt-image-2 repository: copy production-ready prompts,
          filter by style or scene, and jump straight into the GitHub source.
        </p>
        <div className="heroActions">
          <a className="primaryAction" href="#gallery">
            Explore cases
            <ArrowUpRight size={18} />
          </a>
          <a className="secondaryAction" href={repoUrl} target="_blank" rel="noreferrer">
            <Github size={18} />
            GitHub project
          </a>
        </div>
        <div className="metrics">
          <span><strong>{totalCases}</strong> cases</span>
          <span><strong>{categoryCount}</strong> categories</span>
          <span><strong>20+</strong> templates</span>
        </div>
      </div>
      <div className="heroDeck" aria-label="Featured GPT-Image2 cases">
        {hotCases.slice(0, 5).map((caseItem, index) => (
          <a
            className={`heroCard heroCard${index + 1}`}
            href={caseItem.githubUrl}
            target="_blank"
            rel="noreferrer"
            key={caseItem.id}
          >
            <img src={caseItem.image} alt={caseItem.imageAlt} />
            <span>Case {caseItem.id}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function FilterPill({ active, children, onClick }) {
  return (
    <button className={cx('filterPill', active && 'active')} type="button" onClick={onClick}>
      {children}
    </button>
  );
}

function PromptCard({ caseItem, copied, onCopy }) {
  return (
    <article className="caseCard">
      <a className="caseImage" href={caseItem.githubUrl} target="_blank" rel="noreferrer">
        <img src={caseItem.image} alt={caseItem.imageAlt} loading="lazy" />
        <span className="caseBadge">Case {caseItem.id}</span>
      </a>
      <div className="caseBody">
        <div className="caseMeta">
          <span>{caseItem.category}</span>
          {caseItem.sourceUrl ? (
            <a href={caseItem.sourceUrl} target="_blank" rel="noreferrer">
              {caseItem.sourceLabel}
            </a>
          ) : (
            <span>{caseItem.sourceLabel}</span>
          )}
        </div>
        <h3>{caseItem.title}</h3>
        <p>{caseItem.promptPreview}</p>
        <div className="tagRow">
          {[...new Set([...caseItem.styles, ...caseItem.scenes])].slice(0, 4).map((tag) => (
            <span key={`${caseItem.id}-${tag}`}>{tag}</span>
          ))}
        </div>
        <div className="cardActions">
          <button type="button" onClick={() => onCopy(caseItem)}>
            {copied ? <Check size={17} /> : <Copy size={17} />}
            {copied ? 'Copied' : 'Copy Prompt'}
          </button>
          <a href={caseItem.githubUrl} target="_blank" rel="noreferrer" aria-label="Open on GitHub">
            <Github size={18} />
          </a>
        </div>
      </div>
    </article>
  );
}

function App() {
  const [siteData, setSiteData] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [style, setStyle] = useState('All');
  const [scene, setScene] = useState('All');
  const { copiedId, copyPrompt } = useCopy();
  const repoUrl = siteData?.repository || fallbackRepoUrl;

  useEffect(() => {
    let cancelled = false;
    fetch('/cases.json')
      .then((response) => response.json())
      .then((payload) => {
        if (!cancelled) setSiteData(payload);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const hotCases = useMemo(() => {
    if (!siteData) return [];
    return [...siteData.cases]
      .filter((item) => item.featured)
      .sort((a, b) => b.id - a.id);
  }, [siteData]);

  const filteredCases = useMemo(() => {
    if (!siteData) return [];
    const q = query.trim().toLowerCase();
    return siteData.cases.filter((item) => {
      const matchQuery =
        !q ||
        `${item.id} ${item.title} ${item.category} ${item.prompt} ${item.sourceLabel}`
          .toLowerCase()
          .includes(q);
      const matchCategory = category === 'All' || item.category === category;
      const matchStyle = style === 'All' || item.styles.includes(style);
      const matchScene = scene === 'All' || item.scenes.includes(scene);
      return matchQuery && matchCategory && matchStyle && matchScene;
    });
  }, [siteData, query, category, style, scene]);

  const visibleCases = filteredCases.slice(0, 72);

  if (!siteData) {
    return (
      <main>
        <div className="loadingScreen">
          <WandSparkles size={28} />
          <span>Loading GPT-Image2 cases...</span>
        </div>
      </main>
    );
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#">
          <WandSparkles size={21} />
          GPT-Image2 Gallery
        </a>
        <nav>
          <a href="#gallery">Cases</a>
          <a href={repoUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </header>

      <Hero
        hotCases={hotCases}
        repoUrl={repoUrl}
        totalCases={siteData.totalCases}
        categoryCount={siteData.categories.length}
      />

      <section className="hotStrip">
        {hotCases.slice(0, 8).map((caseItem) => (
          <a href={caseItem.githubUrl} target="_blank" rel="noreferrer" key={caseItem.id}>
            <img src={caseItem.image} alt={caseItem.imageAlt} />
            <span>#{caseItem.id}</span>
          </a>
        ))}
      </section>

      <section className="gallerySection" id="gallery">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">Copy, filter, remix</span>
            <h2>Viral cases with prompts one click away.</h2>
          </div>
          <div className="searchBox">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search cases, sources, prompts..."
            />
          </div>
        </div>

        <div className="filterPanel">
          <div>
            <strong>Category</strong>
            <div className="filterRow">
              <FilterPill active={category === 'All'} onClick={() => setCategory('All')}>All</FilterPill>
              {siteData.categories.map((item) => (
                <FilterPill key={item} active={category === item} onClick={() => setCategory(item)}>
                  {item}
                </FilterPill>
              ))}
            </div>
          </div>
          <div>
            <strong>Style</strong>
            <div className="filterRow">
              <FilterPill active={style === 'All'} onClick={() => setStyle('All')}>All</FilterPill>
              {siteData.styles.map((item) => (
                <FilterPill key={item} active={style === item} onClick={() => setStyle(item)}>
                  {item}
                </FilterPill>
              ))}
            </div>
          </div>
          <div>
            <strong>Scene</strong>
            <div className="filterRow">
              <FilterPill active={scene === 'All'} onClick={() => setScene('All')}>All</FilterPill>
              {siteData.scenes.map((item) => (
                <FilterPill key={item} active={scene === item} onClick={() => setScene(item)}>
                  {item}
                </FilterPill>
              ))}
            </div>
          </div>
        </div>

        <div className="resultBar">
          <span>{filteredCases.length} matching cases</span>
          <a href={repoUrl} target="_blank" rel="noreferrer">
            Open GitHub project
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="caseGrid">
          {visibleCases.map((caseItem) => (
            <PromptCard
              caseItem={caseItem}
              copied={copiedId === caseItem.id}
              onCopy={copyPrompt}
              key={caseItem.id}
            />
          ))}
        </div>

        {filteredCases.length > visibleCases.length && (
          <p className="limitNote">
            Showing the first {visibleCases.length} results for speed. Use search or filters to narrow the gallery.
          </p>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
