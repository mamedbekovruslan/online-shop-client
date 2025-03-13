import { Flex, Input, Select } from "@chakra-ui/react";

export const ProductFilter = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
}) => (
  <Flex mb={4} gap={4} direction={{ base: "column", md: "row" }}>
    <Input
      placeholder="Поиск по наименованию..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <Select
      placeholder="Все категории"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </Select>
  </Flex>
);
