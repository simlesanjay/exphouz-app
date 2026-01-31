
import os
import re

def clean_class_spaces(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find className="..." and normalize spaces inside
    # This is slightly complex to do perfectly with regex for all cases, 
    # but we can target common simple cases or just global double space reduction 
    # if we are careful about string literals.
    
    # Safest approach for now: Global double space replacement is risky for non-HTML content.
    # However, for .tsx files in this project, mostly double spaces outside strings are fine (formatting),
    # and inside strings (className) they are what we want to fix.
    # The only risk is if there's a string like "Hello  World" that needs the space.
    # Given the previous script introduced these spaces in class lists, checking className patterns is better.
    
    # Let's try to match className="[^"]*" and clean inside.
    
    def replacer(match):
        full_string = match.group(0)
        # normalize spaces inside the string part
        # className="  foo   bar " -> className="foo bar"
        prefix = full_string[:11] # className="
        inner = full_string[11:-1]
        suffix = full_string[-1]
        
        normalized_inner = ' '.join(inner.split())
        return f'{prefix}{normalized_inner}{suffix}'

    new_content = re.sub(r'className="[^"]*"', replacer, content)
    
    # Also handle className={`...`} if possible, but that's harder.
    # Most of our previous edits were on static strings.

    if new_content != content:
        print(f"Cleaning {file_path}")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                clean_class_spaces(os.path.join(root, file))

if __name__ == "__main__":
    process_directory(r'c:\Users\daksh\OneDrive\Desktop\new project vivek\app')
    process_directory(r'c:\Users\daksh\OneDrive\Desktop\new project vivek\components')
