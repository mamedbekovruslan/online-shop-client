import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
} from "@chakra-ui/react";
import { AiOutlineUpload } from "react-icons/ai";

export const ProductForm = ({
  newProduct,
  handleInputChange,
  categories,
  handleImageChange,
  imageFile,
  handleSaveProduct,
  isEditing,
}) => (
  <VStack spacing={4} w={{ base: "100%", lg: "25%" }}>
    <FormControl id="name">
      <FormLabel>Название товара</FormLabel>
      <Input name="name" value={newProduct.name} onChange={handleInputChange} />
    </FormControl>
    <FormControl id="category">
      <FormLabel>Категория</FormLabel>
      <Select
        name="category_id"
        value={newProduct.category_id}
        onChange={handleInputChange}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
    </FormControl>
    <FormControl id="price">
      <FormLabel>Цена</FormLabel>
      <Input
        name="price"
        type="number"
        min="0"
        value={newProduct.price}
        onChange={handleInputChange}
      />
    </FormControl>
    <FormControl id="quantity">
      <FormLabel>Количество</FormLabel>
      <Input
        name="quantity"
        type="number"
        min="0"
        value={newProduct.quantity}
        onChange={handleInputChange}
      />
    </FormControl>
    <FormControl id="image">
      <FormLabel>Фото</FormLabel>
      <Button
        as="label"
        htmlFor="file-upload"
        cursor="pointer"
        leftIcon={<AiOutlineUpload />}
        colorScheme="teal"
        variant="outline"
        width="100%"
      >
        Загрузить фото
      </Button>
      <Input
        id="file-upload"
        type="file"
        accept="image/*"
        display="none"
        onChange={handleImageChange}
      />
      {imageFile && (
        <Text fontSize="sm" mt={2}>
          Выбран файл: {imageFile.name}
        </Text>
      )}
    </FormControl>
    <Button colorScheme="teal" onClick={handleSaveProduct} w="100%">
      {isEditing ? "Сохранить изменения" : "Добавить товар"}
    </Button>
  </VStack>
);
