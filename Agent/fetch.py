import requests
import json

"""
Contains the example code to retrieve response from the server in python-requests"""

## without previous_state
url = "https://arpit-bansal-healthbridge.hf.space/retrieve"
headers = {
    "accept": "application/json",
    "Content-Type": "application/json"
}
data = {
    "query": "what's my name?"
}

response = requests.post(url, headers=headers, json=data)

print(response.json())

## with previous_state

url = "http://localhost:8000/retrieve"
headers = {
    "accept": "application/json",
    "Content-Type": "application/json"
}
data = {
    "previous_state": [
        {"message": "hi", "response": "Hi there! How can I help you today?\n"},
        {"message": "my name is arpit", "response": "hi arpit.  What's up with you?\n"}
    ],
    "query": "what's my name?"
}

response = requests.post(url, headers=headers, json=data)

print(response.json())