#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> num_map;

    // Iterate over the vector
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (num_map.find(complement) != num_map.end()) {
            // Return the result with correct size
            vector<int> result;
            result.push_back(num_map[complement]);
            result.push_back(i);
            return result;
        }
        num_map[nums[i]] = i;
    }

    // Return an empty vector if no solution is found (although it's assumed there is one)
    return vector<int>();
}

int main() {
    int n, target;
    cin >> n;  // Size of the array
    vector<int> nums(n);
    
    // Reading the array elements
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    
    // Reading the target value
    cin >> target;
    
    // Getting the result from the twoSum function
    vector<int> result = twoSum(nums, target);

    // Output the result
    if (!result.empty()) {
        cout << result.size() << " ";  // Output the size of the result
        for (int i : result) {
            cout << i << " ";  // Output each element in the result
        }
        cout << endl;
    }

    return 0;
}
