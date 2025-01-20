# **LeetCode Test Case Manager for VS Code**  

This VS Code extension simplifies the process of coding and debugging LeetCode problems by automating test case management. It allows you to fetch test cases directly from LeetCode problem URLs, run them locally against your code, and debug effectively. With support for Python and C++, this tool is perfect for competitive programmers.  

---

## **Features**  

### **1. Fetch LeetCode Test Cases**  
- Extract input and expected output test cases directly from a LeetCode problem URL.  
- Handles problems with multiple test cases.  
- Stores test cases in a structured format for easy access and local testing.  

### **2. Organized Test Case Storage**  
- Saves test cases as:  
  - **Input files**: `input_1.txt`, `input_2.txt`, etc.  
  - **Output files**: `output_1.txt`, `output_2.txt`, etc.  
- Ensures compatibility with the Competitive Programming Helper (CPH) extension.  

### **3. Local Code Execution**  
- Write your solution in your preferred language (Python or C++).  
- Run your code against the fetched test cases.  
- Compare actual outputs with the expected outputs for accurate debugging.  

### **4. Multi-Language Support**  
- Supports Python and C++ out of the box.  
- Allows customization of compile and run commands in the settings for additional flexibility.  

---

## **How to Use**  

### **Commands**  

#### **1. Fetch Test Cases**  
Command: `cph.fetchTestCases`  
- Prompts you to enter the LeetCode problem URL.  
- Fetches and stores test cases locally in the workspace.  

#### **2. Run Test Cases**  
Command: `cph.runTestCases`  
- Executes your code against the stored test cases.  
- Displays results for each test case, highlighting mismatches for easier debugging.  

---

## **Setup and Installation**  

1. Clone the repository. 
2. Open the cloned folder in VS Code.  
3. Install dependencies:  npm install
4. Launch the extension for testing:  
   - Press `F5` in VS Code to open a new window with the extension active.  

---

## **Dependencies**  
- **Puppeteer**: For web scraping LeetCode problems.  
- **Child Process**: To execute code locally.  
- **Node.js File System**: For managing input and output files.  

---

## **Contributing**  
Contributions are welcome!  
If you have suggestions or want to add new features, feel free to open an issue or submit a pull request.  

---
