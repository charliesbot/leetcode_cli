package problem0704

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*

class BinarySearchTest {
    private val solution = Solution()

    @Test
    fun `should solve search`() {
        val nums = intArrayOf(-1, 0, 3, 5, 9, 12)
        val result = solution.search(nums, 9)
        assertEquals(-1, result) // Expected to fail until implemented correctly
    }
}