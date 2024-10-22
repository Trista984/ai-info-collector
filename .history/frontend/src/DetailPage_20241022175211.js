import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './App.css';
import { ResultContext } from './ResultContext';

function DetailPage() {
  const { index } = useParams();
  const navigate = useNavigate();
  const { result } = useContext(ResultContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [expansion, setExpansion] = useState('');

  useEffect(() => {
    if (!result || !result.summaries) {
      navigate('/');
      return;
    }
    const idx = parseInt(index, 10);
    const currentItem = result.summaries[idx];
    if (!currentItem) {
      navigate('/');
      return;
    }
    setItem(currentItem);

    // 调用后端 API，获取总结和扩展
    const fetchDetailedSummary = async () => {
      try {
        const response = await fetch('http://localhost:5000/further_summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: currentItem.text, link: currentItem.link }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setSummary(data.summary);
        setExpansion(data.expansion);
      } catch (error) {
        console.error("Error fetching detailed summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedSummary();
  }, [index, navigate, result]);

  if (!item) {
    return null;
  }

  return (
    <div className="app">
      <div className="detail-page">
        <button className="back-button" onClick={() => navigate(-1)}>
          返回
        </button>
        <h2 className="detail-title">{item.title}</h2>
        {loading ? (
          <p>处理中...</p>
        ) : (
          <div>
            <div className="section">
              <h3 className="section-title">总结</h3>
              <p className="section-content">{summary}</p>
            </div>
            <div className="section">
              <h3 className="section-title">扩展</h3>
              <p className="section-content">{expansion}</p>
            </div>
            {item.link && (
              <a
                href={item.link}
                className="result-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                阅读原文
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailPage;
