import {
  Box,
  Button,
  Select,
  Skeleton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";

export const CategoryFilter = ({
  categories,
  loading,
  selected,
  setSelected,
}) => {
  const isMobile = useBreakpointValue({ base: true, lg: false });

  return (
    <Box w={{ base: "100%", lg: "15%" }}>
      <Text fontSize="xl" mb={4}>
        Категории
      </Text>

      {loading ? (
        [...Array(categories.length)].map((_, i) => (
          <Skeleton height="30px" mb={2} key={i} borderRadius="md" />
        ))
      ) : isMobile ? (
        <Select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          mb={4}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      ) : (
        categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            padding="0px 0px 0px 10px"
            w="100%"
            justifyContent="flex-start"
            onClick={() => setSelected(category.id)}
          >
            {category.name}
          </Button>
        ))
      )}
    </Box>
  );
};
