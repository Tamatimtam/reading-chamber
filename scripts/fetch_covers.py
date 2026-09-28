import urllib.request
import json
import os

books = [
    ("The Psychology of Money", "Morgan Housel", "psychology_of_money.jpg"),
    ("Meditations", "Marcus Aurelius", "meditations.jpg"),
    ("Atomic Habits", "James Clear", "atomic_habits.jpg"),
    ("Public Choice Theory", "Gordon Tullock", "public_choice.jpg"),
    ("The Logic of Collective Action", "Mancur Olson", "logic_of_collective.jpg"),
    ("The Republic", "Plato", "republic.jpg"),
    ("The Odyssey", "Homer", "odyssey.jpg"),
]

os.makedirs('assets', exist_ok=True)

for title, author, filename in books:
    query = urllib.parse.quote(f"{title} {author}")
    url = f"https://openlibrary.org/search.json?q={query}&limit=1"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if data['docs'] and 'cover_i' in data['docs'][0]:
                cover_id = data['docs'][0]['cover_i']
                cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
                urllib.request.urlretrieve(cover_url, f"assets/{filename}")
                print(f"Downloaded {filename}")
            else:
                print(f"No cover found for {title}")
    except Exception as e:
        print(f"Error fetching {title}: {e}")
