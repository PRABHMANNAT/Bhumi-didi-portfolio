"""Check deployment files, navigation, and preservation of the original hero."""
from pathlib import Path
from html.parser import HTMLParser
import json, subprocess, re

root=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.links=[]; self.assets=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        if tag=='a' and 'href' in a: self.links.append(a['href'])
        if tag in ['img','script'] and 'src' in a: self.assets.append(a['src'])
        if tag=='link' and a.get('rel') in ['stylesheet','icon']: self.assets.append(a['href'])

current=(root/'dist/index.html').read_text(encoding='utf-8')
p=Page();p.feed(current)
assert len(p.ids)==len(set(p.ids)), 'Duplicate element IDs'
for link in p.links:
    if link.startswith('#') and len(link)>1: assert link[1:] in p.ids, f'Missing anchor: {link}'
for asset in p.assets+[x for x in p.links if x.startswith('assets/')]:
    assert (root/'dist'/asset).is_file(), f'Missing asset: {asset}'
data=json.loads((root/'dist/project-data.json').read_text(encoding='utf-8'))
for project in data: assert (root/'dist/assets'/project['image']).is_file()
assert len(data)==7
config=json.loads((root/'vercel.json').read_text())
assert config['outputDirectory']=='dist' and config['framework'] is None
assert 'VIDEO PLACEHOLDER' not in current and '<video' not in current
for removed in ['class="say-hi"', 'class="footer-socials"', '09 — Let’s work together', '07 — Research & case studies', 'Let’s make the idea']:
    assert removed not in current, f'Removed UI returned: {removed}'
assert current.index('class="footer-name"') < current.index('class="footer-top"'), 'Footer navigation must follow the portfolio name'
baseline=subprocess.check_output(['git','-c',f'safe.directory={root.as_posix()}','show','9a1e828:dist/index.html'],cwd=root).decode('utf-8')
def section(source, marker):
    return source[source.index(marker):source.index('</section>',source.index(marker))+10]
skills_section=section(current,'<section class="about section"')
assert 'skills-marquee' in skills_section, 'Skills marquee is missing'
for skill in ['Pandas','NumPy','Scikit-learn','TensorFlow','PyTorch','Matplotlib','Power BI','Tableau','Jupyter','Git','GitHub','Docker','FastAPI','Streamlit','PostgreSQL','MongoDB','LangChain','Hugging Face']:
    assert skill in skills_section, f'Missing skill: {skill}'
for marker in ['class="specialties"','class="hero-statement"','class="portrait-wrap"','class="name"','class="stats"','class="micro"','class="signature"','class="scroll"']:
    current_line=next(line.strip() for line in current.splitlines() if marker in line)
    baseline_line=next(line.strip() for line in baseline.splitlines() if marker in line)
    assert current_line==baseline_line, f'Hero content changed: {marker}'
assert (root/'dist/style.css').read_bytes().replace(b'\r\n',b'\n')==subprocess.check_output(['git','-c',f'safe.directory={root.as_posix()}','show','9a1e828:dist/style.css'],cwd=root).replace(b'\r\n',b'\n')
print(f'PASS: {len(p.ids)} unique IDs, {len(p.assets)} local resource references, seven project details, all navigation targets, Vercel config, preserved hero content, and expanded skills marquee.')
