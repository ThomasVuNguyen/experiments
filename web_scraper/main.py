import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import sys

# --- Configuration ---
# Set the starting URL from the command-line arguments
if len(sys.argv) > 1:
    START_URL = sys.argv[1]
else:
    print("Error: Please provide a starting URL as a command-line argument.")
    print("Usage: python scraper.py https://example.com")
    sys.exit(1)

# The output file where all the scraped content will be saved
OUTPUT_FILE = "scraped_content.txt"

# --- Global Variables ---
# A set to store all the URLs that have already been visited to avoid re-crawling
visited_urls = set()
# A list to store all the content scraped from the pages
all_content = []
# Get the domain name from the start URL to ensure we only crawl pages on the same site
DOMAIN = urlparse(START_URL).netloc

def scrape_page(url):
    """
    Scrapes a single page, extracts its content and finds new links to crawl.

    Args:
        url (str): The URL of the page to scrape.
    """
    if url in visited_urls:
        return  # Skip if we've already visited this URL

    print(f"Scraping: {url}")
    visited_urls.add(url)

    try:
        # Send an HTTP GET request to the URL
        response = requests.get(url, timeout=10)
        # Raise an exception for bad status codes (4xx or 5xx)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return

    # Parse the HTML content of the page
    soup = BeautifulSoup(response.content, 'html.parser')

    # --- Extract Content ---
    # Find the main content of the page. This might need to be adjusted
    # based on the specific structure of the target website.
    # Common tags for main content are <main>, <article>, or divs with specific IDs/classes.
    main_content = soup.find('main') or soup.find('article') or soup.body
    if main_content:
        # Get all the text from the main content area, stripping leading/trailing whitespace
        text = main_content.get_text(separator='\n', strip=True)
        all_content.append(f"\n\n--- Content from {url} ---\n\n")
        all_content.append(text)

    # --- Find and Follow Links ---
    # Find all anchor (<a>) tags with an href attribute
    for link in soup.find_all('a', href=True):
        href = link['href']
        # Create an absolute URL from the href
        absolute_url = urljoin(url, href)
        # Parse the URL to remove fragments (#) and query parameters (?) for cleaner links
        parsed_url = urlparse(absolute_url)
        clean_url = parsed_url._replace(query="", fragment="").geturl()

        # Check if the link belongs to the same domain and hasn't been visited
        if urlparse(clean_url).netloc == DOMAIN and clean_url not in visited_urls:
            # Recursively scrape the new page
            scrape_page(clean_url)

def save_content_to_file():
    """
    Saves all the scraped content into a single text file.
    """
    print(f"\nSaving all scraped content to {OUTPUT_FILE}...")
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write("".join(all_content))
        print("Scraping complete!")
        print(f"Total pages scraped: {len(visited_urls)}")
        print(f"Output saved to: {OUTPUT_FILE}")
    except IOError as e:
        print(f"Error writing to file {OUTPUT_FILE}: {e}")

def main():
    """
    Main function to start the web scraping process.
    """
    print(f"Starting crawl at: {START_URL}")
    print(f"Will only crawl URLs within the domain: {DOMAIN}")

    # Start the recursive scraping process from the initial URL
    scrape_page(START_URL)

    # Save all the collected content to the output file
    save_content_to_file()

if __name__ == "__main__":
    main()
