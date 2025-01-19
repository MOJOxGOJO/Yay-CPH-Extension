def two_sum(nums, target):
    num_map = {}

    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [2] + [num_map[complement], i]  # Include the size (2) and the indices
        num_map[num] = i

    return [0]  # If no solution, return 0 as per your format


if __name__ == "__main__":
    # Read the first line (array of numbers)
    nums = list(map(int, input().strip().split()))[1:]  # Skip the first element (size)
    
    # Read the second line (target)
    target = int(input().strip())  # Reading the target value
    
    result = two_sum(nums, target)

    # Print the result in the required format
    print(" ".join(map(str, result)))
