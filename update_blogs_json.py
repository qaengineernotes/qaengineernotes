import json
import os

file_path = r'd:\QA Engineer Notes\assets\data\blogs.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for blog in data['blogs']:
    if blog['path'].endswith('.html'):
        blog['path'] = blog['path'][:-5]

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4)

print("Updated blogs.json")
