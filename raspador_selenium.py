from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import requests, os, re, time
from urllib.parse import urljoin

def safe_filename(path):
    return re.sub(r'[^a-zA-Z0-9._-]', '_', os.path.basename(path))

def descargar(url, carpeta, nombre):
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            path = os.path.join(carpeta, nombre)
            with open(path, "wb") as f:
                f.write(resp.content)
            print(f"Descargado: {path}")
            return True
    except Exception as e:
        print(f"Error con {url}: {e}")
    return False

# Configuración de Selenium
options = Options()
options.add_argument("--headless")
driver = webdriver.Chrome(options=options)

url = "https://empresas.officebanking.cl/"  # prueba con sitios abiertos
driver.get(url)
time.sleep(5)

html = driver.page_source
soup = BeautifulSoup(html, "html.parser")

# Carpeta base
base_path = r"C:\Users\ofici\Downloads"
img_dir = os.path.join(base_path, "imagenes")
css_dir = os.path.join(base_path, "css")
js_dir = os.path.join(base_path, "js")
assets_dir = os.path.join(base_path, "assets")

for d in [img_dir, css_dir, js_dir, assets_dir]:
    os.makedirs(d, exist_ok=True)

# --- Imágenes explícitas ---
for img in soup.find_all("img"):
    src = img.get("src")
    if not src: continue
    img_url = urljoin(url, src)
    img_name = safe_filename(src)
    if descargar(img_url, img_dir, img_name):
        img["src"] = "imagenes/" + img_name

# --- Recursos generales (src/href con extensiones de imagen) ---
for tag in soup.find_all(["img", "link", "script"]):
    for attr in ["src", "href"]:
        val = tag.get(attr)
        if val and any(val.lower().endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".svg", ".gif"]):
            asset_url = urljoin(url, val)
            asset_name = safe_filename(val)
            if descargar(asset_url, assets_dir, asset_name):
                tag[attr] = "assets/" + asset_name

# --- CSS ---
for css in soup.find_all("link", rel="stylesheet"):
    href = css.get("href")
    if not href: continue
    css_url = urljoin(url, href)
    css_name = safe_filename(href)
    if descargar(css_url, css_dir, css_name):
        css["href"] = "css/" + css_name

# --- JS ---
for script in soup.find_all("script"):
    src = script.get("src")
    if not src: continue
    js_url = urljoin(url, src)
    js_name = safe_filename(src)
    if descargar(js_url, js_dir, js_name):
        script["src"] = "js/" + js_name

# Guardar HTML modificado
html_path = os.path.join(base_path, "clon_renderizado.html")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(soup.prettify())

driver.quit()
print("Clon mejorado creado en Descargas con imágenes locales.")
