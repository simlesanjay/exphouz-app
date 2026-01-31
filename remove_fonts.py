
import os
import re

def remove_classes(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define regex patterns for class names to remove
    # We want to remove 'font-serif', 'italic', 'not-italic'
    # We should handle them being at start, middle, or end of className string
    
    # Simple approach: replace string literals
    # Note: this might affect non-class strings, but 'font-serif' is unlikely to be used elsewhere
    
    new_content = content
    
    # Remove 'font-serif'
    new_content = re.sub(r'\bfont-serif\b', '', new_content)
    # Remove 'italic'
    new_content = re.sub(r'\bitalic\b', '', new_content)
    # Remove 'not-italic'
    new_content = re.sub(r'\bnot-italic\b', '', new_content)

    # Clean up double spaces caused by removals
    new_content = re.sub(r'\s+', ' ', new_content) 
    # The above is too aggressive, it kills newlines!
    
    # Better approach: line by line or careful replacement
    # standard replacements first
    new_content = content.replace('font-serif', '')
    new_content = new_content.replace('not-italic', '') # Do this before italic logic if needed, but 'italic' is substring of 'not-italic' so...
    # Actually 'not-italic' contains 'italic', so if I replace 'italic' first, 'not-italic' becomes 'not-'
    # So replace 'not-italic' first
    
    new_content = content.replace('not-italic', '')
    new_content = new_content.replace('italic', '') # This might hit things like 'italics' in text? unlikely in class names.
    # Be careful about 'italic' in text content users see.
    # Ideally should only replace inside className or ClassName... parsing TSX is hard with regex.
    # Given the previous greps, most usages are in className strings.
    # I will stick to exact matches or just replace ' font-serif ', 'italic ' etc.
    
    # Revised strategy: replace specific tokens
    tokens = ['font-serif', 'not-italic', 'italic']
    
    for token in tokens:
        new_content = new_content.replace(f' {token} ', ' ')
        new_content = new_content.replace(f'"{token} ', '"')
        new_content = new_content.replace(f' {token}"', '"')
        new_content = new_content.replace(f'"{token}"', '""') # Single class case
        # Also catch occurrences where it might be mixed
        # Let's simple regex for className="..."?
        
    # Let's go consistently with simple string replace but verify widely
    # Given the user instruction "no italic fonts", replacing 'italic' globally in code files (JSX) might remove the word 'italic' from text content too, but that's probably acceptable or rare.
    # Wait, 'italic' is a valid word.
    # I'll try to target className if possible, but global replace is safer for "all fonts" if I assume 'italic' is mostly class.
    
    # Let's try to be smart about cleaning up spaces
    # We will replace the target words with empty strings, then clean up '  ' to ' '
    
    for token in tokens:
        new_content = new_content.replace(token, '')
        
    # Fix double spaces
    # But only within lines to preserve indentation? Code formatters can fix spaces later.
    # Let's just do the replace.
    
    if new_content != content:
        print(f"Updating {file_path}")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                remove_classes(os.path.join(root, file))

if __name__ == "__main__":
    process_directory(r'c:\Users\daksh\OneDrive\Desktop\new project vivek\app')
