import os

count = 0
for root, dirs, files in os.walk(r'e:\Kimi\Kimi_Agent_Angular ERP Mock Site\erp-system\src\app'):
    for f in files:
        if f.endswith('.component.ts'):
            filepath = os.path.join(root, f)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
                if 'template:' in content:
                    idx1 = content.find('template:')
                    idx2 = content.find('`', idx1)
                    if idx2 != -1:
                        # find the closing backtick
                        idx3 = content.find('`', idx2 + 1)
                        if idx3 != -1:
                            html = content[idx2+1:idx3]
                            base_name = f.replace('.component.ts', '')
                            html_path = os.path.join(root, base_name + '.component.html')
                            with open(html_path, 'w', encoding='utf-8') as html_file:
                                html_file.write(html.strip())
                            
                            # styles
                    idx_style = content.find('styles:')
                    if idx_style != -1:
                        idx_style2 = content.find('`', idx_style)
                        if idx_style2 != -1:
                            idx_style3 = content.find('`', idx_style2 + 1)
                            if idx_style3 != -1:
                                scss = content[idx_style2+1:idx_style3]
                                scss_path = os.path.join(root, base_name + '.component.scss')
                                with open(scss_path, 'w', encoding='utf-8') as scss_file:
                                    scss_file.write(scss.strip())

                                new_content = content[:idx1] + "templateUrl: './" + base_name + ".component.html',\n  styleUrls: ['./" + base_name + ".component.scss']\n})"
                                class_idx = content.find('export class', idx_style3)
                                if class_idx != -1:
                                    new_content += "\n" + content[class_idx:]
                                    with open(filepath, 'w', encoding='utf-8') as out_f:
                                        out_f.write(new_content)
                                    print("Replaced:", filepath)
                                    count += 1

print("Total modified:", count)
