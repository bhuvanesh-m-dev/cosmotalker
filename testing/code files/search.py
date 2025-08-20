import webbrowser


shortcut_sites = {
    "yt": ["yt", "youtube", "utube"],
    "insta": ["insta", "instagram"],
    "fb": ["fb", "facebook"],
    "wa": ["wa", "whatsapp"],
    "twitter": ["twitter", "x"],
    "reddit": ["reddit"],
    "linkedin": ["linkedin"],
    "tiktok": ["tiktok"],
    'bhuvanesh':['bhuvanesh','authour','author','bhuvi','developer'],
    'chatgpt':['chatgpt','gpt'],
    'mail':['mail','gmail','email'],
}


site_urls = {
    "yt": "https://www.youtube.com",
    "insta": "https://www.instagram.com",
    "fb": "https://www.facebook.com",
    "wa": "https://web.whatsapp.com",
    "twitter": "https://twitter.com",
    "reddit": "https://www.reddit.com",
    "linkedin": "https://www.linkedin.com",
    "tiktok": "https://www.tiktok.com",
    'bhuvanesh':'https://bhuvaneshm.in',
    'chatgpt':'https://chatgpt.com',
    'mail':'https://gmail.com',
}

def search(query):

    query = query.lower()  

    for key, variations in shortcut_sites.items():
        if query in variations:
            webbrowser.open(site_urls[key])
            return


    url = f"https://www.ecosia.org/search?q={query}"
    webbrowser.open(url)
