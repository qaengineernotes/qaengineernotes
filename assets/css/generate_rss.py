import json
from datetime import datetime
from email.utils import format_datetime

SITE_URL = "https://qaengineernotes.com"

def format_pubdate(date_str):
    # Expects YYYY-MM-DD
    dt = datetime.strptime(date_str, "%Y-%m-%d")
    return format_datetime(dt)

with open("assets/data/blogs.json", "r", encoding="utf-8") as f:
    data = json.load(f)

rss_items = []
for blog in data["blogs"]:
    pub_date = format_pubdate(blog["date"])
    item = f"""    <item>
      <title>{blog['title']}</title>
      <link>{SITE_URL}/{blog['path']}</link>
      <description>{blog['description']}</description>
      <author>{blog['author']}</author>
      <pubDate>{pub_date}</pubDate>
      <guid>{SITE_URL}/{blog['path']}</guid>
    </item>"""
    rss_items.append(item)

rss_feed = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>QA Engineer Notes Blog</title>
    <link>{SITE_URL}/</link>
    <description>Latest blog posts and resources for QA engineers and software testers.</description>
    <language>en-us</language>
    <generator>Python Script</generator>
    <copyright>2025 QA Engineer Notes</copyright>

{chr(10).join(rss_items)}
  </channel>
</rss>
"""

with open("rss.xml", "w", encoding="utf-8") as f:
    f.write(rss_feed)

print("rss.xml generated successfully!")