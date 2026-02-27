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
                    
                    # Find all imported icons
                    imports = []
                    for match in lucide_pattern.finditer(content):
                        names = [n.strip() for n in match.group(1).split(',')]
                        imports.extend(names)
                    
                    # Find all used components (capitalized tags)
                    # We filter for common icon names or check against the import list
                    used = set(component_pattern.findall(content))
                    
                    # Common non-icon components to ignore
                    ignore = {'Link', 'Route', 'Routes', 'BrowserRouter', 'AnimatePresence', 'motion', 'Navbar', 'Footer', 'AnimatedBackground', 'HeroSection', 'ProjectsShowcase', 'SkillsSection', 'BlogSection', 'Experience', 'BlogPost', 'BlogList', 'ProjectDetail', 'AdminDashboard', 'FadeUp', 'StaggerParent', 'StaggerChild', 'InteractiveHero3D', 'CustomCursor', 'AboutForm', 'ContactForm', 'ExperienceForm', 'SkillsForm', 'AdminBlogForm', 'AdminProjectForm', 'ProjectCard', 'BentoProjectsGrid', 'GithubPulse', 'SkillsMarquee', 'App'}
                    
                    missing = []
                    for icon in used:
                        if icon not in imports and icon not in ignore and not icon.startswith('motion.'):
                            missing.append(icon)
                    
                    if missing:
                        print(f"File: {path}")
                        print(f"  Missing imports: {', '.join(missing)}")
                        total_missing += len(missing)

    print(f"\nTotal missing icons found: {total_missing}")

if __name__ == "__main__":
    check_icons()
