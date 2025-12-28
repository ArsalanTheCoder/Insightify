import google.generativeai as genai
import os

# 👇 PASTE YOUR KEY HERE
API_KEY = 'AIzaSyAHpa-pG6_54yBExUw720k5uxfvBFE1BZw'

# Configure the SDK
genai.configure(api_key=API_KEY)

# Define the exact model name from your list
model_name = 'gemini-2.5-flash'

print(f"Testing model: {model_name}...")

try:
    # 1. Initialize the Model
    model = genai.GenerativeModel(model_name)

    # 2. Send a Simple Prompt
    print("Sending prompt...")
    response = model.generate_content("Are you working? Reply with 'Yes, I am online!'")

    # 3. Print the Result
    print("\n✅ SUCCESS!")
    print(f"Gemini says: {response.text}")

except Exception as e:
    print("\n❌ TEST FAILED.")
    print(f"Error details: {e}")