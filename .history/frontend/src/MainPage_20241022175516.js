// MainPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { ResultContext } from './ResultContext';

function MainPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const navigate = useNavigate();
  const { result, setResult } = useContext(ResultContext);

  // 处理滚动事件，隐藏或显示搜索栏
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/scrape_and_summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      setResult(data); // 使用 Context 存储结果数据
    } catch (error) {
      console.error("Error fetching data:", error);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLinkClick = (siteUrl) => {
    setUrl(siteUrl);
    handleSubmit({ preventDefault: () => {} });
  };

  return (
    <div className="app">
      {/* 搜索栏和快捷链接区域 */}
      <div className={`header ${showHeader ? '' : 'header-hidden'}`}>
        <h1 className="title">AI网页新闻整理</h1>

        <div className="search-container">
          <input
            type="text"
            className="input"
            placeholder="输入网址"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            className="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '处理中...' : '开始收集'}
          </button>
        </div>

        <div className="quick-links">
          <button onClick={() => handleQuickLinkClick('https://www.artificialintelligence-news.com/')}>
            人工智能新闻
          </button>
          <button onClick={() => handleQuickLinkClick('https://news.mit.edu/topic/artificial-intelligence2')}>
            MIT人工智能资讯
          </button>
          <button onClick={() => handleQuickLinkClick('https://www.wsj.com/tech/ai')}>
            华尔街日报科技
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      {result && result.summaries && (
        <div className="result">
          <div>
            {result.summaries.map((item, index) => (
              <div key={index} className="summary-block">
                <h3 className="summary-title">{item.title}</h3>
                <p className="result-summary">{item.summary}</p>
                {item.link && (
                  <div className="link-container">
                    <a
                      href={item.link}
                      className="result-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      阅读原文
                    </a>
                    {/* 新增的“深入了解”按钮 */}
                    <button
                      className="further-button"
                      onClick={() => navigate(`/detail/${index}`)}
                    >
                      深入了解
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
