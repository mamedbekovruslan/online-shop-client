import {
  Flex,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  addProduct,
  deleteProduct,
  getCategories,
  getProducts,
} from "../../api/auth";

export const ManageProduct = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [categories, setCategories] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category_id: "",
    price: "",
    quantity: "",
    image: "",
  });

  const getCategoryNameById = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Неизвестно";
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleDeleteProduct = (id) => {
    setSelectedProductId(id);
    onOpen();
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(selectedProductId);
      setProducts(
        products.filter((product) => product.id !== selectedProductId)
      );
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleAddProduct = async () => {
    // Валидация перед отправкой
    if (
      !newProduct.name ||
      !newProduct.category_id ||
      !newProduct.price ||
      !newProduct.quantity
    ) {
      alert("Все поля должны быть заполнены");
      return;
    }

    const productToAdd = {
      ...newProduct,
      price: Number(newProduct.price),
      quantity: Number(newProduct.quantity),
      category_id: Number(newProduct.category_id),
      photo: newProduct.image, // Изменил image -> photo
    };

    console.log("Sending product data:", productToAdd);

    try {
      const response = await addProduct(productToAdd);
      setProducts([...products, response.data]);

      // Очистить форму
      setNewProduct({
        name: "",
        category_id: "",
        price: "",
        quantity: "",
        image: "", // Оставляем image на фронте, но отправляем как photo
      });
    } catch (err) {
      console.error("Error adding product:", err);
      if (err.response) {
        console.error("Error details:", err.response.data);
        alert(`Error: ${err.response.data.error}`);
      } else {
        alert("Произошла ошибка. Попробуйте снова.");
      }
    }
  };

  return (
    <Flex direction="column">
      <h1>Блок для добавления или редактирования товара</h1>
      <Flex direction="column">
        <FormControl id="name" mb={4}>
          <FormLabel>Название товара</FormLabel>
          <Input
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            placeholder="Введите название товара"
          />
        </FormControl>
        <FormControl id="category" mb={4}>
          <FormLabel>Категория</FormLabel>
          <Select
            name="category_id"
            value={newProduct.category_id}
            onChange={handleInputChange}
            placeholder="Выберите категорию"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl id="price" mb={4}>
          <FormLabel>Цена</FormLabel>
          <Input
            name="price"
            type="number"
            value={newProduct.price}
            onChange={handleInputChange}
            placeholder="Введите цену"
          />
        </FormControl>
        <FormControl id="quantity" mb={4}>
          <FormLabel>Количество</FormLabel>
          <Input
            name="quantity"
            type="number"
            value={newProduct.quantity}
            onChange={handleInputChange}
            placeholder="Введите количество"
          />
        </FormControl>
        <FormControl id="image" mb={4}>
          <FormLabel>Фото</FormLabel>
          <Input
            name="image"
            value={newProduct.image}
            onChange={handleInputChange}
            placeholder="Введите URL фото"
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleAddProduct}>
          Добавить товар
        </Button>
      </Flex>

      <TableContainer mt={8}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Наименование</Th>
              <Th>Категория</Th>
              <Th>Стоимость</Th>
              <Th>Кол-во</Th>
              <Th>Фото</Th>
              <Th>Действия</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Th>{product.id}</Th>
                <Th>{product.name}</Th>
                <Th>{getCategoryNameById(product.category_id)}</Th>
                <Th>{product.price}р</Th>
                <Th>{product.quantity}шт</Th>
                <Th>Фото</Th>
                <Th>
                  <Button>Изменить</Button>
                  <Button onClick={() => handleDeleteProduct(product.id)}>
                    Удалить
                  </Button>
                </Th>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Удалить товар</ModalHeader>
          <ModalBody>Вы действительно хотите удалить этот товар?</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Нет
            </Button>
            <Button colorScheme="red" onClick={confirmDelete}>
              Да
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
