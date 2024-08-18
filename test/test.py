import json
from playwright.sync_api import sync_playwright

# Function to read JSON data from a file
def load_json_from_file(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

# Load JSON data from file in the 'data' folder
json_file_path = '../data/actions.json'
actions = load_json_from_file(json_file_path)["actions"]

# Function to log action results
def log_action_result(action, status, error_message=None):
    report_item = {
        "action_type": action["action_type"],
        "text": action["text"],
        "status": status,
        "error": error_message
    }
    report.append(report_item)

# Playwright test script generation
def run(playwright):
    # Launch the browser with headless mode off
    browser = playwright.chromium.launch(headless=False)
    page = browser.new_page()

    # Navigate to the page (replace with the actual URL)
    page.goto("https://codelabs.developers.google.com/")

    # Initialize report list
    global report
    report = []

    # Iterate over the actions and perform them
    for action in actions:
        try:
            if action["action_type"] == "click":
                if action["class_name"] and action["text"]:
                    elements = page.query_selector_all(f".{action['class_name']}")
                    clicked = False
                    for element in elements:
                        if element.inner_text().strip() == action["text"].strip():
                            element.click()
                            log_action_result(action, "Success")
                            clicked = True
                            break
                    if not clicked:
                        log_action_result(action, "Failed", "Element not found or text did not match.")
                elif action["css_selector"]:
                    page.click(action["css_selector"])
                    log_action_result(action, "Success")
                elif action["xpath"]:
                    page.click(f"xpath={action['xpath']}")
                    log_action_result(action, "Success")
            else:
                log_action_result(action, "Skipped", "Unknown action type.")
        except Exception as e:
            log_action_result(action, "Failed", str(e))

    # Close the browser
    browser.close()

    # Print the report
    print("Test Report:")
    for item in report:
        print(f"Action: {item['action_type']}, Text: {item['text']}, Status: {item['status']}, Error: {item.get('error', 'N/A')}")

# Run the Playwright script
with sync_playwright() as playwright:
    run(playwright)
