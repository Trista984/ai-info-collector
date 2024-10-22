# app.py
# coding: utf-8
from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()  # 加载环境变量

app = Flask(__name__)
CORS(app)

# 从环境变量获取 Moonshot API Key
MOONSHOT_API_KEY = os.getenv("MOONSHOT_API_KEY")
if not MOONSHOT_API_KEY:
    raise ValueError("请在环境变量中设置 MOONSHOT_API_KEY")

class MoonshotAI:
    def __init__(self):
        self.url = "https://api.moonshot.cn/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {MOONSHOT_API_KEY}",
            "Content-Type": "application/json"
        }

    def generate_summary(self, content, link):
        try:
            response = requests.post(
                self.url,
                headers=self.headers,
                json={
                    "model": "moonshot-v1-32k",
                    "temperature": 0.5,
                    "max_tokens": 1024,
                    "messages": [{
                        "role": "user",
                        "content": f"请总结以下内容，用中文输出：\n\n{content}\n\n原文链接：{link}"
                    }]
                }
            )
            if response.status_code == 200:
                return response.json()['choices'][0]['message']['content']
            else:
                print(f"Failed to generate summary: {response.status_code} – {response.text}")
                return None
        except Exception as e:
            print(f"Error generating summary: {e}")
            return None

    def generate_detailed_summary(self, content, link):
        try:
            response = requests.post(
                self.url,
                headers=self.headers,
                json={
                    "model": "moonshot-v1-32k",
                    "temperature": 0.7,
                    "max_tokens": 3000,
                    "messages": [{
                        "role": "user",
                        "content": (
                            f"请对以下内容进行深入的分析和总结，用中文输出，要求如下：\n"
                            f"1. **详细总结**：提供对内容的详细总结，包括背景、主要观点和结论。\n"
                            f"2. **关键要点**：列出内容中的关键要点或重要信息。\n"
                            f"3. **深度分析**：对内容进行批判性分析，提供见解和评论。\n"
                            f"4. **相关案例或引用**：提供与主题相关的案例或引用，增强理解。\n"
                            f"请严格按照以下JSON格式返回结果，不要添加额外的文本：\n"
                            f"{{\n"
                            f'  "detailed_summary": "这里是详细总结",\n'
                            f'  "key_points": ["要点1", "要点2", ...],\n'
                            f'  "analysis": "这里是深度分析",\n'
                            f'  "references": ["引用1", "引用2", ...]\n'
                            f"}}\n\n"
                            f"内容如下：\n\n{content}\n\n原文链接：{link}"
                        )
                    }]
                }
            )
            if response.status_code == 200:
                ai_response = response.json()['choices'][0]['message']['content']
                # 解析 AI 返回的 JSON
                import json
                try:
                    result = json.loads(ai_response)
                    detailed_summary = result.get('detailed_summary', '')
                    key_points = result.get('key_points', [])
                    analysis = result.get('analysis', '')
                    references = result.get('references', [])
                    return detailed_summary, key_points, analysis, references
                except json.JSONDecodeError:
                    print("Failed to parse AI response as JSON")
                    return None, None, None, None
            else:
                print(f"Failed to generate detailed summary: {response.status_code} – {response.text}")
                return None, None, None, None

        except Exception as e:
            print(f"Error generating detailed summary: {e}")
            return None, None, None, None

def scrape_ai_content(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            # 根据实际网站的结构调整以下代码
            articles = soup.find_all('article')
            content_list = []
            for index, article in enumerate(articles):
                # 尝试在文章中查找 h1-h6 标签作为标题
                title_tag = article.find(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
                if not title_tag:
                    # 如果文章中没有标题，尝试从页面的 <title> 标签中获取
                    title_tag = soup.find('title')
                title = title_tag.get_text().strip() if title_tag else f"内容 {index + 1}"
                paragraphs = article.find_all('p')
                text = ' '.join([p.get_text().strip() for p in paragraphs])
                link_tag = article.find('a')
                link = link_tag['href'] if link_tag and link_tag.has_attr('href') else url
                if text:
                    content_list.append({'title': title, 'text': text, 'link': link})
            return content_list
        else:
            print(f"Failed to retrieve the page: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error scraping the site: {e}")
        return None

@app.route('/scrape_and_summarize', methods=['POST'])
def scrape_and_summarize():
    print("Request received")
    data = request.get_json()
    print("Data received:", data)
    url = data.get('url')
    print("URL to scrape:", url)

    if not url:
        print("No URL provided")
        return jsonify({"error": "No URL provided"}), 400

    content_list = scrape_ai_content(url)
    if content_list:
        moonshot = MoonshotAI()
        summaries = []
        all_contents = ''
        for item in content_list:
            content = f"{item['title']}\n{item['text']}"
            link = item['link']
            summary_text = moonshot.generate_summary(content, link)
            if summary_text:
                summaries.append({
                    'title': item['title'],
                    'summary': summary_text,
                    'link': link,
                    'text': item['text']  # 确保将 'text' 包含在返回的数据中
                })
                all_contents += f"{summary_text}\n"
            else:
                return jsonify({"error": "Failed to generate summary"}), 500

        return jsonify({
            "summaries": summaries
        })
    else:
        return jsonify({"error": "Failed to retrieve or process content"}), 500

@app.route('/further_summarize', methods=['POST'])
def further_summarize():
    data = request.get_json()
    print("Received data:", data)
    content = data.get('content')
    link = data.get('link')

    if not content:
        return jsonify({"error": "No content provided"}), 400

    moonshot = MoonshotAI()
    detailed_summary, key_points, analysis, references = moonshot.generate_detailed_summary(content, link)

    if detailed_summary:
        return jsonify({
            "detailed_summary": detailed_summary,
            "key_points": key_points,
            "analysis": analysis,
            "references": references
        })
    else:
        return jsonify({"error": "Failed to generate detailed summary"}), 500

if __name__ == "__main__":
    app.run(port=5000)
