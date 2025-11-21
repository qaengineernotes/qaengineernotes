"""
Script to fix critical SEO issues:
1. Remove duplicate sitemap entry
2. Fix RSS feed URLs (remove .html)
3. Fix canonical URLs in blog posts
4. Fix Open Graph and Twitter URLs
5. Fix structured data URLs
"""

import os
import re
from pathlib import Path

def fix_sitemap():
    """Remove duplicate entry for top-5-security-testing-tools"""
    sitemap_path = Path("sitemap.xml")
    content = sitemap_path.read_text(encoding='utf-8')
    
    # Find all occurrences of the security tools entry
    pattern = r'<url>\s*<loc>https://qablogs\.com/blogs/top-5-security-testing-tools-qa-professionals-2025</loc>.*?</url>'
    matches = list(re.finditer(pattern, content, re.DOTALL))
    
    if len(matches) > 1:
        # Remove the second occurrence (keep the first one)
        content = content[:matches[1].start()] + content[matches[1].end():]
        sitemap_path.write_text(content, encoding='utf-8')
        print(f"[OK] Removed duplicate sitemap entry (found {len(matches)} occurrences)")
    else:
        print(f"[OK] No duplicate sitemap entries found")

def fix_rss_feed():
    """Remove .html extensions from RSS feed URLs"""
    rss_path = Path("rss.xml")
    content = rss_path.read_text(encoding='utf-8')
    
    # Replace .html in URLs
    original_content = content
    content = re.sub(r'(https://qablogs\.com/blogs/[^<]+)\.html', r'\1', content)
    
    if content != original_content:
        rss_path.write_text(content, encoding='utf-8')
        print("[OK] Fixed RSS feed URLs (removed .html extensions)")
    else:
        print("[OK] RSS feed URLs already correct")

def fix_blog_post_urls(blog_file):
    """Fix URLs in a single blog post"""
    content = blog_file.read_text(encoding='utf-8')
    original_content = content
    changes = []
    
    # Fix canonical URL
    content = re.sub(
        r'(<link rel="canonical" href="https://qablogs\.com/[^"]+)\.html(")',
        r'\1\2',
        content
    )
    if content != original_content:
        changes.append("canonical")
        original_content = content
    
    # Fix Open Graph URL
    content = re.sub(
        r'(<meta property="og:url" content="https://qablogs\.com/[^"]+)\.html(")',
        r'\1\2',
        content
    )
    if content != original_content:
        changes.append("og:url")
        original_content = content
    
    # Fix Twitter image URL if it has .html
    content = re.sub(
        r'(<meta name="twitter:url" content="https://qablogs\.com/[^"]+)\.html(")',
        r'\1\2',
        content
    )
    if content != original_content:
        changes.append("twitter:url")
        original_content = content
    
    # Fix structured data URLs in JSON-LD
    content = re.sub(
        r'("https://qablogs\.com/[^"]+)\.html(")',
        r'\1\2',
        content
    )
    if content != original_content:
        changes.append("structured data")
        original_content = content
    
    # Fix internal navigation links (.html extensions)
    content = re.sub(
        r'href="/([^"]+)\.html"',
        r'href="/\1"',
        content
    )
    if content != original_content:
        changes.append("internal links")
    
    if changes:
        blog_file.write_text(content, encoding='utf-8')
        return changes
    return None

def fix_all_blog_posts():
    """Fix URLs in all blog posts"""
    blogs_dir = Path("blogs")
    if not blogs_dir.exists():
        print("[ERROR] Blogs directory not found")
        return
    
    fixed_count = 0
    for blog_file in blogs_dir.glob("*.html"):
        changes = fix_blog_post_urls(blog_file)
        if changes:
            fixed_count += 1
            print(f"  [OK] Fixed {blog_file.name}: {', '.join(changes)}")
    
    if fixed_count > 0:
        print(f"[OK] Fixed URLs in {fixed_count} blog posts")
    else:
        print("[OK] All blog posts already have correct URLs")

def main():
    print("=" * 60)
    print("Fixing Critical SEO Issues")
    print("=" * 60)
    print()
    
    print("1. Fixing sitemap duplicate entry...")
    fix_sitemap()
    print()
    
    print("2. Fixing RSS feed URLs...")
    fix_rss_feed()
    print()
    
    print("3. Fixing blog post URLs...")
    fix_all_blog_posts()
    print()
    
    print("=" * 60)
    print("[OK] All critical SEO issues fixed!")
    print("=" * 60)

if __name__ == "__main__":
    main()
