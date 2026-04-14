"""
preprocess.py
Lightweight text cleaning for hate-speech classification.
No external NLP libraries — uses only Python stdlib + re.
"""
import re


def clean(text: str) -> str:
    """
    Apply essential preprocessing steps:
    1. Lowercase
    2. Remove URLs
    3. Remove mentions (@user) and hashtags symbols (#)
    4. Remove punctuation and non-alphanumeric characters
    5. Collapse extra whitespace
    """
    if not isinstance(text, str):
        text = str(text)

    # Lowercase
    text = text.lower()

    # Remove URLs (http/https/www)
    text = re.sub(r"http\S+|www\.\S+", "", text)

    # Remove Twitter mentions and hashtag symbol (keep the word)
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"#", "", text)

    # Remove punctuation and special characters — keep letters, digits, spaces
    text = re.sub(r"[^a-z0-9\s]", " ", text)

    # Collapse multiple whitespace into one
    text = re.sub(r"\s+", " ", text).strip()

    return text
