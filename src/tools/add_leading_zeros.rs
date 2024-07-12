// Add the missing leading zeros, so every
// id has the same size.
// Eg 1 -> 0001
pub fn add_leading_zeros(id: &str) -> String {
    format!("{:0>4}", id)
}
