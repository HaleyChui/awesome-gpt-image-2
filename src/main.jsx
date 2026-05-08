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

const copy = {
  en: {
    loading: 'Loading GPT-Image2 cases...',
    brand: 'GPT-Image2 Gallery',
    navCases: 'Cases',
    navTemplates: 'Templates',
    eyebrow: 'Live GPT-Image2 prompt gallery',
    title: 'From viral images to reusable prompts.',
    subtitle:
      'A visual front door for the awesome-gpt-image-2 repository: copy production-ready prompts, filter by style or scene, and jump straight into the GitHub source.',
    explore: 'Explore cases',
    githubProject: 'GitHub project',
    cases: 'cases',
    categories: 'categories',
    templates: 'templates',
    sectionEyebrow: 'Copy, filter, remix',
    sectionTitle: 'Viral cases with prompts one click away.',
    templateEyebrow: '20+ industrial prompt templates',
    templateTitle: 'Start from a proven template, then remix the case library.',
    templateSubtitle:
      'Each template is distilled from real GPT-Image2 examples and includes structure, constraints, and pitfalls for production use.',
    templateKind: 'Prompt Template',
    openTemplate: 'Open Template',
    search: 'Search cases, sources, prompts...',
    category: 'Category',
    style: 'Style',
    scene: 'Scene',
    all: 'All',
    matching: 'matching cases',
    openGithub: 'Open GitHub project',
    copied: 'Copied',
    copyPrompt: 'Copy Prompt',
    openOnGithub: 'Open on GitHub',
    limit: (count) => `Showing the first ${count} results for speed. Use search or filters to narrow the gallery.`
  },
  zh: {
    loading: '正在加载 GPT-Image2 案例...',
    brand: 'GPT-Image2 画廊',
    navCases: '案例',
    navTemplates: '模板',
    eyebrow: '实时更新的 GPT-Image2 提示词画廊',
    title: '从爆款图片，到可复用 Prompt。',
    subtitle:
      '这是 awesome-gpt-image-2 的可视化入口：复制可直接复用的 Prompt，按风格或场景筛选，并一键跳转到 GitHub 源项目。',
    explore: '浏览案例',
    githubProject: 'GitHub 项目',
    cases: '个案例',
    categories: '个分类',
    templates: '套模板',
    sectionEyebrow: '复制、筛选、复用',
    sectionTitle: '爆款案例和 Prompt，一键可取。',
    templateEyebrow: '20+ 套工业级提示词模板',
    templateTitle: '先用成熟模板起稿，再从案例库里继续 remix。',
    templateSubtitle:
      '每套模板都从真实 GPT-Image2 案例里提炼，包含结构、约束和防坑经验，适合生产流程直接复用。',
    templateKind: '提示词模板',
    openTemplate: '打开模板',
    search: '搜索案例、来源、Prompt...',
    category: '分类',
    style: '风格',
    scene: '场景',
    all: '全部',
    matching: '个匹配案例',
    openGithub: '打开 GitHub 项目',
    copied: '已复制',
    copyPrompt: '复制 Prompt',
    openOnGithub: '在 GitHub 打开',
    limit: (count) => `为了保证浏览速度，当前展示前 ${count} 条结果。可以用搜索或筛选缩小范围。`
  }
};

const labelMap = {
  zh: {
    'Architecture & Spaces': '建筑与空间',
    Architecture: '建筑',
    Brand: '品牌',
    'Brand & Logos': '品牌与标志',
    Character: '角色',
    Characters: '人物',
    'Characters & People': '人物与角色',
    Charts: '图表',
    'Charts & Infographics': '图表与信息可视化',
    Classical: '古典',
    Commerce: '商业',
    Creative: '创意',
    Documents: '文档',
    'Documents & Publishing': '文档与出版物',
    Education: '教育',
    Fashion: '时尚',
    Food: '食品饮品',
    History: '历史',
    'History & Classical Themes': '历史与古风题材',
    Illustration: '插画',
    'Illustration & Art': '插画与艺术',
    Infographic: '信息图',
    'Other Use Cases': '其他应用场景',
    Photography: '摄影',
    'Photography & Realism': '摄影与写实',
    Poster: '海报',
    'Posters & Typography': '海报与排版',
    Product: '商品',
    Products: '商品',
    'Products & E-commerce': '商品与电商',
    Realistic: '写实',
    Scenes: '场景',
    'Scenes & Storytelling': '场景与叙事',
    Social: '社媒',
    Story: '叙事',
    Tech: '科技',
    Travel: '旅行',
    UI: '界面',
    'UI & Interfaces': 'UI 与界面'
  }
};

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function textFor(value, language) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[language] || value.en || value.zh || '';
}

function localizeLabel(value, language, styleLibrary) {
  const libraryItems = [
    ...(styleLibrary?.categories || []),
    ...(styleLibrary?.styles || []),
    ...(styleLibrary?.scenes || [])
  ];
  const match = libraryItems.find((item) => item.value === value || item.id === value);
  if (match) return textFor(match.title, language);
  return labelMap[language]?.[value] || value;
}

function localizeTemplateTag(value, language, styleLibrary) {
  const tagLabel = styleLibrary?.tagLabels?.[value];
  if (tagLabel) return textFor(tagLabel, language);
  return localizeLabel(value, language, styleLibrary);
}

function orderByLibrary(values, libraryItems = []) {
  const order = new Map(libraryItems.map((item, index) => [item.value, index]));
  return [...values].sort((a, b) => {
    const aOrder = order.has(a) ? order.get(a) : Number.MAX_SAFE_INTEGER;
    const bOrder = order.has(b) ? order.get(b) : Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.localeCompare(b);
  });
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

function Hero({ hotCases, language, repoUrl, totalCases, categoryCount }) {
  const t = copy[language];

  return (
    <section className="hero">
      <div className="heroGlow heroGlowA" />
      <div className="heroGlow heroGlowB" />
      <div className="scanGrid" />
      <div className="heroCopy">
        <div className="eyebrow">
          <Sparkles size={16} />
          {t.eyebrow}
        </div>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
        <div className="heroActions">
          <a className="primaryAction" href="#gallery">
            {t.explore}
            <ArrowUpRight size={18} />
          </a>
          <a className="secondaryAction" href={repoUrl} target="_blank" rel="noreferrer">
            <Github size={18} />
            {t.githubProject}
          </a>
        </div>
        <div className="metrics">
          <span><strong>{totalCases}</strong> {t.cases}</span>
          <span><strong>{categoryCount}</strong> {t.categories}</span>
          <span><strong>20+</strong> {t.templates}</span>
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
            <span>{language === 'zh' ? '案例' : 'Case'} {caseItem.id}</span>
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

function LanguageSwitch({ language, setLanguage }) {
  return (
    <div className="languageSwitch" aria-label="Language switcher">
      <button
        className={cx(language === 'en' && 'active')}
        type="button"
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
      <button
        className={cx(language === 'zh' && 'active')}
        type="button"
        onClick={() => setLanguage('zh')}
      >
        中文
      </button>
    </div>
  );
}

function TemplateSection({ language, styleLibrary }) {
  const t = copy[language];
  const repoDocsUrl = `${styleLibrary.repository || fallbackRepoUrl}/blob/main/${styleLibrary.templateDocument}`;
  const templates = styleLibrary.templates || [];

  return (
    <section className="templateSection" id="templates">
      <div className="sectionHead templateHead">
        <div>
          <span className="eyebrow">{t.templateEyebrow}</span>
          <h2>{t.templateTitle}</h2>
          <p>{t.templateSubtitle}</p>
        </div>
        <a className="templateCta" href={`${repoDocsUrl}#section-templates`} target="_blank" rel="noreferrer">
          {t.openTemplate}
          <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="caseGrid templateCaseGrid">
        {templates.map((item, index) => {
          const title = textFor(item.title, language);
          const description = textFor(item.description, language);
          return (
            <article className="caseCard templateVisualCard" key={item.id}>
              <a
                className="caseImage templateImage"
                href={`${repoDocsUrl}#${item.anchor}`}
                target="_blank"
                rel="noreferrer"
              >
                <img src={item.cover} alt={title} loading="lazy" />
                <span className="caseBadge">
                  {language === 'zh' ? '模板' : 'Template'} {String(index + 1).padStart(2, '0')}
                </span>
              </a>
              <div className="caseBody">
                <div className="caseMeta">
                  <span>{t.templateKind}</span>
                  <span>{localizeLabel(item.category, language, styleLibrary)}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="tagRow">
                  {(item.tags || []).map((tag) => (
                    <span key={`${item.id}-${tag}`}>{localizeTemplateTag(tag, language, styleLibrary)}</span>
                  ))}
                </div>
                <div className="cardActions singleAction">
                  <a href={`${repoDocsUrl}#${item.anchor}`} target="_blank" rel="noreferrer">
                    {t.openTemplate}
                    <ArrowUpRight size={17} />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PromptCard({ caseItem, copied, language, onCopy, styleLibrary }) {
  const t = copy[language];
  const tags = [...new Set([...caseItem.styles, ...caseItem.scenes])].slice(0, 4);

  return (
    <article className="caseCard">
      <a className="caseImage" href={caseItem.githubUrl} target="_blank" rel="noreferrer">
        <img src={caseItem.image} alt={caseItem.imageAlt} loading="lazy" />
        <span className="caseBadge">{language === 'zh' ? '案例' : 'Case'} {caseItem.id}</span>
      </a>
      <div className="caseBody">
        <div className="caseMeta">
          <span>{localizeLabel(caseItem.category, language, styleLibrary)}</span>
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
          {tags.map((tag) => (
            <span key={`${caseItem.id}-${tag}`}>{localizeLabel(tag, language, styleLibrary)}</span>
          ))}
        </div>
        <div className="cardActions">
          <button type="button" onClick={() => onCopy(caseItem)}>
            {copied ? <Check size={17} /> : <Copy size={17} />}
            {copied ? t.copied : t.copyPrompt}
          </button>
          <a href={caseItem.githubUrl} target="_blank" rel="noreferrer" aria-label={t.openOnGithub}>
            <Github size={18} />
          </a>
        </div>
      </div>
    </article>
  );
}

function App() {
  const [siteData, setSiteData] = useState(null);
  const [styleLibrary, setStyleLibrary] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [style, setStyle] = useState('All');
  const [scene, setScene] = useState('All');
  const { copiedId, copyPrompt } = useCopy();
  const repoUrl = siteData?.repository || fallbackRepoUrl;
  const t = copy[language];

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/cases.json').then((response) => response.json()),
      fetch('/style-library.json').then((response) => response.json())
    ])
      .then(([payload, library]) => {
        if (!cancelled) {
          setSiteData(payload);
          setStyleLibrary(library);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  }, [language]);

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

  const orderedCategories = useMemo(
    () => (siteData && styleLibrary ? orderByLibrary(siteData.categories, styleLibrary.categories) : []),
    [siteData, styleLibrary]
  );
  const orderedStyles = useMemo(
    () => (siteData && styleLibrary ? orderByLibrary(siteData.styles, styleLibrary.styles) : []),
    [siteData, styleLibrary]
  );
  const orderedScenes = useMemo(
    () => (siteData && styleLibrary ? orderByLibrary(siteData.scenes, styleLibrary.scenes) : []),
    [siteData, styleLibrary]
  );

  const visibleCases = filteredCases.slice(0, 72);

  if (!siteData || !styleLibrary) {
    return (
      <main>
        <div className="loadingScreen">
          <WandSparkles size={28} />
          <span>{t.loading}</span>
        </div>
      </main>
    );
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#">
          <WandSparkles size={21} />
          {t.brand}
        </a>
        <div className="topbarControls">
          <nav>
            <a href="#templates">{t.navTemplates}</a>
            <a href="#gallery">{t.navCases}</a>
            <a href={repoUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </nav>
          <LanguageSwitch language={language} setLanguage={setLanguage} />
        </div>
      </header>

      <Hero
        hotCases={hotCases}
        language={language}
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

      <TemplateSection language={language} styleLibrary={styleLibrary} />

      <section className="gallerySection" id="gallery">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">{t.sectionEyebrow}</span>
            <h2>{t.sectionTitle}</h2>
          </div>
          <div className="searchBox">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search}
            />
          </div>
        </div>

        <div className="filterPanel">
          <div>
            <strong>{t.category}</strong>
            <div className="filterRow">
              <FilterPill active={category === 'All'} onClick={() => setCategory('All')}>{t.all}</FilterPill>
              {orderedCategories.map((item) => (
                <FilterPill key={item} active={category === item} onClick={() => setCategory(item)}>
                  {localizeLabel(item, language, styleLibrary)}
                </FilterPill>
              ))}
            </div>
          </div>
          <div>
            <strong>{t.style}</strong>
            <div className="filterRow">
              <FilterPill active={style === 'All'} onClick={() => setStyle('All')}>{t.all}</FilterPill>
              {orderedStyles.map((item) => (
                <FilterPill key={item} active={style === item} onClick={() => setStyle(item)}>
                  {localizeLabel(item, language, styleLibrary)}
                </FilterPill>
              ))}
            </div>
          </div>
          <div>
            <strong>{t.scene}</strong>
            <div className="filterRow">
              <FilterPill active={scene === 'All'} onClick={() => setScene('All')}>{t.all}</FilterPill>
              {orderedScenes.map((item) => (
                <FilterPill key={item} active={scene === item} onClick={() => setScene(item)}>
                  {localizeLabel(item, language, styleLibrary)}
                </FilterPill>
              ))}
            </div>
          </div>
        </div>

        <div className="resultBar">
          <span>{language === 'zh' ? `${filteredCases.length} ${t.matching}` : `${filteredCases.length} ${t.matching}`}</span>
          <a href={repoUrl} target="_blank" rel="noreferrer">
            {t.openGithub}
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="caseGrid">
          {visibleCases.map((caseItem) => (
            <PromptCard
              caseItem={caseItem}
              copied={copiedId === caseItem.id}
              language={language}
              onCopy={copyPrompt}
              styleLibrary={styleLibrary}
              key={caseItem.id}
            />
          ))}
        </div>

        {filteredCases.length > visibleCases.length && (
          <p className="limitNote">
            {t.limit(visibleCases.length)}
          </p>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
