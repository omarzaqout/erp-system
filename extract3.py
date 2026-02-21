import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # robust regex finding template: \`...\`
    # and styles: [\`...\`] or styles: [\`...\`, \`...\`] 
    
    template_pattern = re.compile(r'template\s*:\s*`(.*?)`', re.DOTALL)
    styles_pattern = re.compile(r'styles\s*:\s*\[\s*`(.*?)`\s*\]', re.DOTALL)

    template_match = template_pattern.search(content)
    styles_match = styles_pattern.search(content)

    modified = False
    base_name = os.path.basename(filepath).replace('.component.ts', '')
    dir_name = os.path.dirname(filepath)

    new_content = content
    if template_match:
        html_content = template_match.group(1)
        html_path = os.path.join(dir_name, base_name + '.component.html')
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content.strip() + '\n')
            
        start = template_match.start()
        end = template_match.end()
        new_content = new_content[:start] + f"templateUrl: './{base_name}.component.html'" + new_content[end:]
        modified = True

    # search again on new_content to not mess up indices
    styles_match = styles_pattern.search(new_content)
    if styles_match:
        scss_content = styles_match.group(1)
        scss_path = os.path.join(dir_name, base_name + '.component.scss')
        with open(scss_path, 'w', encoding='utf-8') as f:
            f.write(scss_content.strip() + '\n')
            
        start = styles_match.start()
        end = styles_match.end()
        new_content = new_content[:start] + f"styleUrls: ['./{base_name}.component.scss']" + new_content[end:]
        modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Processed:", filepath)

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.component.ts'):
                process_file(os.path.join(root, file))

process_directory(r'e:/Kimi/Kimi_Agent_Angular ERP Mock Site/erp-system/src/app')
