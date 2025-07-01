import os
import json
import time

def generate_summary(description):
    words = description.split()
    return f"{words[0]} {words[1]}, {' '.join(words[:10])}..."

def info(query):
    start_time = time.time()
    base_dir = os.path.dirname(os.path.abspath(__file__))
    train_file = os.path.join(base_dir, "ss.txt")

    query = query.lower()
    matches = []
    
    common_words = {"the", "a", "an", "of", "in", "on", "for", "to", "with"}
    filtered_query_words = [word for word in query.split() if word not in common_words]

    if not os.path.exists(train_file):
        print("Data file not found. Ensure 'ss.txt' is available.")
        return

    with open(train_file, "r", encoding="utf-8") as f:
        content = f.readlines()
        
        for line in content:
            line_lower = line.lower()
            if all(word in line_lower for word in filtered_query_words):
                matches.append(line.strip())    
    
    elapsed_time = round(time.time() - start_time, 9)
    
    if not matches:
        print("Sorry, no keyword matches.")
        return
    
    print(f"Status: Cosmotalker found {len(matches)} results in {elapsed_time} seconds")
    print(f"Query matches with keyword:\n{'-'*30}")
    print(f"Matches found in Cosmotalker's memory for v1")
    print("Topics Cosmotalker found:")
    
    match_dict = {idx + 1: match for idx, match in enumerate(matches)}
    for idx, match in match_dict.items():
        summary = generate_summary(match)
        print(f"{idx}. {summary}")
    
    while True:
        try:
            choice = float(input("Enter the ID for a specific title: "))
            if choice in match_dict:
                title = " ".join(match_dict[choice].split()[:2])
                description = match_dict[choice]
                response = {
                    "Title": title,
                    "Description": description
                }
                print(json.dumps(response, indent=4))
                return  # Ensure function exits cleanly
            else:
                print("Invalid ID. Sorry, no keyword matches. Exiting.")
                return
        except ValueError:
            print("Invalid input. Please enter a valid number.")
            return

info('earth')
