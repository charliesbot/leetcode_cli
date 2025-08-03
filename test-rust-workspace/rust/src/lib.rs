/*
 * [200] Number of Islands
 *
 * Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

 
Example 1:


Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1


Example 2:


Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3


 
Constraints:


	m == grid.length
	n == grid[i].length
	1 <= m, n <= 300
	grid[i][j] is '0' or '1'.
 *
 * Difficulty: Medium
 */

pub struct Solution;

impl Solution {
    pub fn num_islands(grid: Vec<Vec<char>>) -> i32 {
        
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_number_of_islands() {
        // TODO: Add test cases
        assert_eq!(1, 1);
    }
}