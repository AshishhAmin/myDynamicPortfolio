import os
import re

def check_icons():
    client_src = r'c:\Users\ashish k amin\Desktop\projects\myDynamicPortfolio\client\src'
    lucide_pattern = re.compile(r'import\s*\{([^}]+)\}\s*from\s*[\'"]lucide-react[\'"]')
    component_pattern = re.compile(r'<([A-Z][a-zA-Z0-9]*)')

    total_missing = 0

    for root, dirs, files in os.walk(client_src):
        for file in files:
            if file.endswith('.jsx'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Find all imported icons from lucide-react
                    imports = []
                    for match in lucide_pattern.finditer(content):
                        names = [n.strip() for n in match.group(1).split(',')]
                        imports.extend(names)
                    
                    # Find all used components (capitalized tags)
                    used = set(component_pattern.findall(content))
                    
                    # Find all locally defined components in the same file
                    local_defs = set(re.findall(r'(?:const|function|class)\s+([A-Z][a-zA-Z0-9]*)', content))
                    
                    # Find all other imports
                    other_imports = set(re.findall(r'import\s+(?:\{[^}]+\}|[a-zA-Z0-9]+)\s+from\s+[\'"](?!\.lucide-react)([^\'"]+)[\'"]', content))
                    # This is complex, let's just use a simpler list of known components
                    common_ignore = {'React', 'Fragment', 'BrowserRouter', 'Routes', 'Route', 'Link', 'NavLink', 'AnimatePresence', 'motion', 'StaggerParent', 'StaggerChild', 'FadeUp'}
                    
                    missing = []
                    for icon in used:
                        # If it's used but not imported from lucide, and not local, and not common...
                        if icon not in imports and icon not in local_defs and icon not in common_ignore and not icon.startswith('motion.'):
                            # Check if it's imported from somewhere else (approximate)
                            if f'import {icon}' not in content and f', {icon}' not in content and f'{{ {icon}' not in content:
                                missing.append(icon)
                    
                    if missing:
                        print(f"File: {path}")
                        print(f"  Missing: {', '.join(missing)}")
                        total_missing += len(missing)

    print(f"\nTotal potential missing items: {total_missing}")

if __name__ == "__main__":
    check_icons()
