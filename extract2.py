import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the indices of `template: \`` and the closing \`
    # We can do this manually without regex to avoid issues
    idx1 = content.find('template: `')
    if idx1 == -1: return False
    
    idx_end = content.find('`', idx1 + 12)
    while idx_end != -1 and content[idx_end-1] == '\\':
        idx_end = content.find('`', idx_end + 1)
        
    html = content[idx1+11:idx_end]
    
    # Styles
    idx_style = content.find('styles: [`')
    style_end = content.find('`]', idx_style + 10)
    scss = ""
    if idx_style != -1:
        scss = content[idx_style+10:style_end]

    base_name = os.path.basename(filepath).replace('.component.ts', '')
    dir_name = os.path.dirname(filepath)
    
    # Write HTML
    html_path = os.path.join(dir_name, base_name + '.component.html')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html.strip())
        
    # Write SCSS
    if idx_style != -1:
        scss_path = os.path.join(dir_name, base_name + '.component.scss')
        with open(scss_path, 'w', encoding='utf-8') as f:
            f.write(scss.strip())
            
    # Replace in content
    new_content = content[:idx1] + "templateUrl: './" + base_name + ".component.html'"
    
    if idx_style != -1:
        # We need to replace until style_end + 2
        after_style = content[style_end+2:]
        # Wait, what about the space between template and style?
        # Let's just string replace the template text, and style text.
        pass

    # Better logic:
    new_text = content.replace("template: `" + html + "`", "templateUrl: './" + base_name + ".component.html'")
    if idx_style != -1:
        new_text = new_text.replace("styles: [`" + scss + "`]", "styleUrls: ['./" + base_name + ".component.scss']")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_text)

    print("Processed:", filepath)
    return True

for root, dirs, files in os.walk(r'e:\\Kimi\\Kimi_Agent_Angular ERP Mock Site\\erp-system\\src\\app'):
    for f in files:
        if f.endswith('.component.ts'):
            process_file(os.path.join(root, f))
